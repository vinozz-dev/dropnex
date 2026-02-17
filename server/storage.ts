import { 
  User, 
  Store, 
  Product, 
  Order,
  type IUser,
  type IStore,
  type IProduct,
  type IOrder,
  type InsertUser,
  type InsertStore,
  type InsertProduct
} from "@shared/schema";
import session from "express-session";
import MongoStore from "connect-mongo";
import mongoose from "mongoose";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<IUser | null>;
  getUserByUsername(username: string): Promise<IUser | null>;
  getUserByEmail(email: string): Promise<IUser | null>;
  createUser(user: InsertUser): Promise<IUser>;
  updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<IUser | null>;

  // Store methods
  getStore(id: string): Promise<IStore | null>;
  getStoresByOwner(ownerId: string): Promise<IStore[]>;
  createStore(store: InsertStore): Promise<IStore>;
  updateStore(id: string, updates: Partial<InsertStore>): Promise<IStore | null>;
  getStoresNearLocation(lat: number, lng: number, radius: number): Promise<IStore[]>;

  // Product methods
  getProduct(id: string): Promise<IProduct | null>;
  getProductsByStore(storeId: string): Promise<IProduct[]>;
  createProduct(product: InsertProduct): Promise<IProduct>;
  updateProduct(id: string, updates: Partial<InsertProduct>): Promise<IProduct | null>;
  deleteProduct(id: string): Promise<void>;
  updateProductStock(id: string, quantity: number): Promise<IProduct | null>;

  // Order methods
  getOrder(id: string): Promise<IOrder | null>;
  getOrdersByCustomer(customerId: string): Promise<IOrder[]>;
  getOrdersByStore(storeId: string): Promise<IOrder[]>;
  getOrdersByDeliveryPartner(deliveryPartnerId: string): Promise<IOrder[]>;
  createOrder(order: Omit<IOrder, '_id' | 'createdAt' | 'updatedAt' | 'orderNumber'>): Promise<IOrder>;
  updateOrderStatus(id: string, status: string): Promise<IOrder | null>;
  assignDeliveryPartner(orderId: string, deliveryPartnerId: string): Promise<IOrder | null>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = MongoStore.create({
      mongoUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/dropnex'
    });
  }

  // User methods
  async getUser(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  async getUserByUsername(username: string): Promise<IUser | null> {
    return await User.findOne({ username });
  }

  async getUserByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async createUser(insertUser: InsertUser): Promise<IUser> {
    const user = new User(insertUser);
    return await user.save();
  }

  async updateUserStripeInfo(userId: string, stripeCustomerId: string, stripeSubscriptionId?: string): Promise<IUser | null> {
    return await User.findByIdAndUpdate(
      userId,
      { stripeCustomerId, stripeSubscriptionId },
      { new: true }
    );
  }

  // Store methods
  async getStore(id: string): Promise<IStore | null> {
    return await Store.findById(id);
  }

  async getStoresByOwner(ownerId: string): Promise<IStore[]> {
    return await Store.find({ ownerId });
  }

  async createStore(insertStore: InsertStore): Promise<IStore> {
    const store = new Store(insertStore);
    return await store.save();
  }

  async updateStore(id: string, updates: Partial<InsertStore>): Promise<IStore | null> {
    return await Store.findByIdAndUpdate(id, updates, { new: true });
  }

  async getStoresNearLocation(lat: number, lng: number, radius: number): Promise<IStore[]> {
    return await Store.find({ isActive: true });
  }

  // Product methods
  async getProduct(id: string): Promise<IProduct | null> {
    return await Product.findById(id);
  }

  async getProductsByStore(storeId: string): Promise<IProduct[]> {
    return await Product.find({ storeId, isActive: true }).sort({ name: 1 });
  }

  async createProduct(insertProduct: InsertProduct): Promise<IProduct> {
    const product = new Product(insertProduct);
    return await product.save();
  }

  async updateProduct(id: string, updates: Partial<InsertProduct>): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(id, updates, { new: true });
  }

  async deleteProduct(id: string): Promise<void> {
    await Product.findByIdAndUpdate(id, { isActive: false });
  }

  async updateProductStock(id: string, quantity: number): Promise<IProduct | null> {
    return await Product.findByIdAndUpdate(id, { stockQuantity: quantity }, { new: true });
  }

  // Order methods
  async getOrder(id: string): Promise<IOrder | null> {
    return await Order.findById(id);
  }

  async getOrdersByCustomer(customerId: string): Promise<IOrder[]> {
    return await Order.find({ customerId }).sort({ createdAt: -1 });
  }

  async getOrdersByStore(storeId: string): Promise<IOrder[]> {
    return await Order.find({ storeId }).sort({ createdAt: -1 });
  }

  async getOrdersByDeliveryPartner(deliveryPartnerId: string): Promise<IOrder[]> {
    return await Order.find({ deliveryPartnerId }).sort({ createdAt: -1 });
  }

  async createOrder(orderData: Omit<IOrder, '_id' | 'createdAt' | 'updatedAt' | 'orderNumber'>): Promise<IOrder> {
    const orderNumber = `DN${Date.now()}`;
    const order = new Order({ ...orderData, orderNumber });
    return await order.save();
  }

  async updateOrderStatus(id: string, status: string): Promise<IOrder | null> {
    return await Order.findByIdAndUpdate(id, { status }, { new: true });
  }

  async assignDeliveryPartner(orderId: string, deliveryPartnerId: string): Promise<IOrder | null> {
    return await Order.findByIdAndUpdate(orderId, { deliveryPartnerId }, { new: true });
  }
}

export const storage = new DatabaseStorage();