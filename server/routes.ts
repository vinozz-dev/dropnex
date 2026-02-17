import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import Stripe from "stripe";
import { insertProductSchema, insertStoreSchema, insertOrderSchema } from "@shared/schema";
import { z } from "zod";

// Make Stripe optional - only initialize if key is available
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  // Middleware to check authentication
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.sendStatus(401);
    }
    next();
  };

  // Middleware to check role
  const requireRole = (roles: string[]) => (req: any, res: any, next: any) => {
    if (!req.isAuthenticated() || !roles.includes(req.user.role)) {
      return res.sendStatus(403);
    }
    next();
  };

  // Store routes
  app.get("/api/stores", async (req, res) => {
    try {
      const { lat, lng, radius = 10 } = req.query;
      let stores;
      
      if (lat && lng) {
        stores = await storage.getStoresNearLocation(
          parseFloat(lat as string), 
          parseFloat(lng as string), 
          parseInt(radius as string)
        );
      } else {
        // For now, return all stores
        stores = await storage.getStoresNearLocation(0, 0, 1000);
      }
      
      res.json(stores);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stores" });
    }
  });

  app.get("/api/stores/:id", async (req, res) => {
    try {
      const store = await storage.getStore(req.params.id);
      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      res.json(store);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch store" });
    }
  });

  app.post("/api/stores", requireAuth, requireRole(["store_owner", "admin"]), async (req, res) => {
    try {
      const validatedData = insertStoreSchema.parse({
        ...req.body,
        ownerId: req.user.id
      });
      
      const store = await storage.createStore(validatedData);
      res.status(201).json(store);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create store" });
    }
  });

  // Product routes
  app.get("/api/stores/:storeId/products", async (req, res) => {
    try {
      const products = await storage.getProductsByStore(req.params.storeId);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/stores/:storeId/products", requireAuth, requireRole(["store_owner", "admin"]), async (req, res) => {
    try {
      const validatedData = insertProductSchema.parse({
        ...req.body,
        storeId: req.params.storeId
      });
      
      const product = await storage.createProduct(validatedData);
      res.status(201).json(product);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put("/api/products/:id", requireAuth, requireRole(["store_owner", "admin"]), async (req, res) => {
    try {
      const updates = req.body;
      delete updates.id;
      delete updates.storeId;
      
      const product = await storage.updateProduct(req.params.id, updates);
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete("/api/products/:id", requireAuth, requireRole(["store_owner", "admin"]), async (req, res) => {
    try {
      await storage.deleteProduct(req.params.id);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  // Order routes
  app.get("/api/orders", requireAuth, async (req, res) => {
    try {
      let orders;
      const role = req.user.role;
      
      if (role === "customer") {
        orders = await storage.getOrdersByCustomer(req.user.id);
      } else if (role === "store_owner") {
        // Get orders for stores owned by this user
        const stores = await storage.getStoresByOwner(req.user.id);
        const allOrders = await Promise.all(
          stores.map(store => storage.getOrdersByStore(store.id))
        );
        orders = allOrders.flat();
      } else if (role === "delivery_partner") {
        orders = await storage.getOrdersByDeliveryPartner(req.user.id);
      } else if (role === "admin") {
        // For admin, get all recent orders
        orders = await storage.getOrdersByCustomer(""); // This would need to be implemented differently
      }
      
      res.json(orders || []);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", requireAuth, requireRole(["customer"]), async (req, res) => {
    try {
      const orderData = insertOrderSchema.parse({
        ...req.body,
        customerId: req.user.id
      });
      
      const order = await storage.createOrder(orderData);
      
      // Broadcast new order to relevant users
      broadcastToRole("store_owner", {
        type: "new_order",
        data: order
      });
      
      res.status(201).json(order);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create order" });
    }
  });

  app.put("/api/orders/:id/status", requireAuth, async (req, res) => {
    try {
      const { status } = req.body;
      const order = await storage.updateOrderStatus(req.params.id, status);
      
      // Broadcast status update
      if (order) {
        broadcastOrderUpdate(order);
      }
      
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Delivery Partner routes
  app.get("/api/delivery-partner/profile", requireAuth, requireRole(["delivery_partner"]), async (req, res) => {
    try {
      const partner = await storage.getDeliveryPartner(req.user.id);
      res.json(partner);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch delivery partner profile" });
    }
  });

  app.post("/api/delivery-partner/status", requireAuth, requireRole(["delivery_partner"]), async (req, res) => {
    try {
      const { isOnline, isAvailable } = req.body;
      const partner = await storage.updateDeliveryPartnerStatus(req.user.id, isOnline, isAvailable);
      res.json(partner);
    } catch (error) {
      res.status(500).json({ message: "Failed to update status" });
    }
  });

  app.post("/api/delivery-partner/location", requireAuth, requireRole(["delivery_partner"]), async (req, res) => {
    try {
      const { lat, lng } = req.body;
      const partner = await storage.updateDeliveryPartnerLocation(req.user.id, { lat, lng });
      res.json(partner);
    } catch (error) {
      res.status(500).json({ message: "Failed to update location" });
    }
  });

  // Stripe payment routes
  app.post("/api/create-payment-intent", requireAuth, async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ message: "Payment processing not available - Stripe not configured" });
      }
      
      const { amount, currency = "inr" } = req.body;
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to paise for INR
        currency,
        metadata: {
          userId: req.user?.id || ""
        }
      });
      
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Notification routes
  app.get("/api/notifications", requireAuth, async (req, res) => {
    try {
      const { unread } = req.query;
      const notifications = await storage.getUserNotifications(
        req.user.id, 
        unread === "true"
      );
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.put("/api/notifications/:id/read", requireAuth, async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.sendStatus(204);
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  const httpServer = createServer(app);

  // WebSocket setup for real-time features
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  const clients = new Map<string, { ws: WebSocket, userId: string, role: string }>();

  wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection');
    
    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'auth') {
          // Store client info for broadcasting
          clients.set(message.userId, {
            ws,
            userId: message.userId,
            role: message.role
          });
        }
        
        if (message.type === 'location_update' && message.role === 'delivery_partner') {
          // Broadcast location update to relevant orders
          broadcastLocationUpdate(message.userId, message.location);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      // Remove client from map
      for (const [clientId, client] of Array.from(clients.entries())) {
        if (client.ws === ws) {
          clients.delete(clientId);
          break;
        }
      }
    });
  });

  // Broadcast functions
  function broadcastToRole(role: string, message: any) {
    for (const client of Array.from(clients.values())) {
      if (client.role === role && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    }
  }

  function broadcastOrderUpdate(order: any) {
    const message = {
      type: 'order_update',
      data: order
    };
    
    // Send to customer
    const customerClient = clients.get(order.customerId);
    if (customerClient && customerClient.ws.readyState === WebSocket.OPEN) {
      customerClient.ws.send(JSON.stringify(message));
    }
    
    // Send to delivery partner if assigned
    if (order.deliveryPartnerId) {
      const deliveryClient = clients.get(order.deliveryPartnerId);
      if (deliveryClient && deliveryClient.ws.readyState === WebSocket.OPEN) {
        deliveryClient.ws.send(JSON.stringify(message));
      }
    }
  }

  function broadcastLocationUpdate(deliveryPartnerId: string, location: any) {
    const message = {
      type: 'location_update',
      data: { deliveryPartnerId, location }
    };
    
    // Broadcast to customers with active orders from this delivery partner
    for (const client of Array.from(clients.values())) {
      if (client.role === 'customer' && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify(message));
      }
    }
  }

  return httpServer;
}
