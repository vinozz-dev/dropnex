import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useWebSocket } from "@/hooks/use-websocket";
import { getCurrentLocation } from "@/lib/location";
import { MapPin, Clock, DollarSign, Package, Phone, Navigation } from "lucide-react";
import { Order, DeliveryPartner } from "@shared/schema";

export default function DeliveryInterface() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { sendMessage } = useWebSocket();
  const [isOnline, setIsOnline] = useState(false);

  const { data: deliveryPartner } = useQuery({
    queryKey: ["/api/delivery-partner/profile"],
  });

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
  });

  // Type assertions for API responses
  const typedDeliveryPartner = deliveryPartner as DeliveryPartner | undefined;
  const typedOrders = orders as Order[];

  const updateStatusMutation = useMutation({
    mutationFn: async ({ isOnline, isAvailable }: { isOnline: boolean; isAvailable: boolean }) => {
      // Simulate API call
      return new Promise(resolve => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      toast({
        title: "Status Updated",
        description: `You are now ${isOnline ? "online" : "offline"}`,
      });
    },
  });

  const updateLocationMutation = useMutation({
    mutationFn: async ({ lat, lng }: { lat: number; lng: number }) => {
      // Simulate API call
      return new Promise(resolve => setTimeout(resolve, 200));
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      // Simulate API call
      return new Promise(resolve => setTimeout(resolve, 1000));
    },
    onSuccess: (_, { status }) => {
      const statusMessages = {
        'picked_up': 'Order accepted and picked up!',
        'delivered': 'Order delivered successfully!'
      };
      
      toast({
        title: "Order Updated",
        description: statusMessages[status as keyof typeof statusMessages] || "Status updated",
      });
    },
  });

  useEffect(() => {
    if (typedDeliveryPartner) {
      setIsOnline(typedDeliveryPartner.isOnline || false);
    }
  }, [typedDeliveryPartner]);

  useEffect(() => {
    // Update location every 30 seconds when online
    if (isOnline) {
      const updateLocation = async () => {
        try {
          const location = await getCurrentLocation();
          updateLocationMutation.mutate({ lat: location.lat, lng: location.lng });
          
          // Send location update via WebSocket
          if (sendMessage) {
            sendMessage({
              type: 'location_update',
              userId: user?.id,
              role: 'delivery_partner',
              location: { lat: location.lat, lng: location.lng }
            });
          }
        } catch (error) {
          console.error("Location error:", error);
        }
      };

      updateLocation();
      const interval = setInterval(updateLocation, 30000);
      
      return () => clearInterval(interval);
    }
  }, [isOnline, sendMessage, user?.id, updateLocationMutation]);

  const handleStatusToggle = (online: boolean) => {
    setIsOnline(online);
    updateStatusMutation.mutate({ isOnline: online, isAvailable: online });
  };

  const availableOrders = orders.filter((order: Order) => 
    order.status === "packed" && !order.deliveryPartnerId
  );
  
  const activeOrders = orders.filter((order: Order) => 
    order.deliveryPartnerId === user?.id && 
    !["delivered", "cancelled"].includes(order.status)
  );

  const todaysDeliveries = orders.filter((order: Order) => {
    const orderDate = new Date(order.createdAt).toDateString();
    const today = new Date().toDateString();
    return order.deliveryPartnerId === user?.id && 
           order.status === "delivered" && 
           orderDate === today;
  });

  const todaysEarnings = todaysDeliveries.reduce((sum, order: Order) => {
    return sum + parseFloat(order.deliveryFee || "0");
  }, 0);

  if (!deliveryPartner) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Complete Your Delivery Partner Profile</h2>
        <p className="text-muted-foreground mb-6">
          Please complete your delivery partner registration to start accepting orders.
        </p>
        <Button 
          onClick={() => toast({ 
            title: "Profile Setup", 
            description: "Redirecting to delivery partner registration form..." 
          })}
          data-testid="button-complete-profile"
        >
          Complete Profile
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Panel */}
      <aside className="w-80 bg-card border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-semibold">Delivery Dashboard</h2>
          <p className="text-sm text-muted-foreground">
            {user?.firstName && user?.lastName 
              ? `${user.firstName} ${user.lastName}` 
              : user?.username}
          </p>
          
          {/* Status Toggle */}
          <div className="mt-4 flex items-center justify-between">
            <Label htmlFor="online-status">Online Status</Label>
            <Switch
              id="online-status"
              checked={isOnline}
              onCheckedChange={handleStatusToggle}
              disabled={updateStatusMutation.isPending}
              data-testid="switch-online-status"
            />
          </div>
          
          <div className="mt-2">
            <Badge variant={isOnline ? "default" : "secondary"}>
              {isOnline ? "Online" : "Offline"}
            </Badge>
          </div>
        </div>
        
        {/* Available Orders */}
        <div className="flex-1 overflow-auto p-6">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
            Available Orders ({availableOrders.length})
          </h3>
          
          <div className="space-y-4">
            {availableOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  {isOnline ? "No orders available right now" : "Go online to see available orders"}
                </p>
              </div>
            ) : (
              availableOrders.map((order: Order) => (
                <Card key={order.id} className="border-2 border-dashed border-accent/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono text-sm font-medium">#{order.orderNumber}</span>
                      <Badge variant="secondary">
                        ₹{order.deliveryFee || "45"} Payout
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="truncate">Pickup → Delivery</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>Est. 15 min</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span>₹{order.total} order value</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => updateOrderStatusMutation.mutate({
                          orderId: order.id,
                          status: "picked_up"
                        })}
                        disabled={updateOrderStatusMutation.isPending}
                        data-testid={`button-accept-order-${order.id}`}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast({ title: "Order skipped", description: "Looking for other orders..." })}
                        data-testid={`button-skip-order-${order.id}`}
                      >
                        Skip
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="p-6 border-t border-border">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-lg font-bold">{todaysDeliveries.length}</p>
              <p className="text-xs text-muted-foreground">Today's Deliveries</p>
            </div>
            <div>
              <p className="text-lg font-bold">₹{todaysEarnings}</p>
              <p className="text-xs text-muted-foreground">Today's Earnings</p>
            </div>
          </div>
        </div>
      </aside>
      
      {/* Main Content - Map Area */}
      <main className="flex-1 relative">
        <div className="h-full w-full bg-gradient-to-br from-muted/20 via-background to-muted/20 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Real-time Map View</h3>
            <p className="text-muted-foreground text-sm">
              Live tracking, route optimization, and delivery locations will be displayed here.
            </p>
            {!isOnline && (
              <p className="text-accent text-sm mt-2 font-medium">
                Go online to start receiving delivery requests
              </p>
            )}
          </div>
        </div>
        
        {/* Active Delivery Panel */}
        {activeOrders.length > 0 && (
          <div className="absolute bottom-4 right-4 bg-card rounded-lg border border-border p-4 shadow-lg w-80">
            <h4 className="font-semibold mb-3">Current Delivery</h4>
            
            {activeOrders.map((order: Order) => (
              <div key={order.id} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm">#{order.orderNumber}</span>
                  <Badge>
                    {order.status === "picked_up" ? "In Transit" : order.status}
                  </Badge>
                </div>
                
                <div className="text-sm space-y-1">
                  <p><strong>Order Value:</strong> ₹{order.total}</p>
                  <p><strong>Delivery Fee:</strong> ₹{order.deliveryFee || "45"}</p>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => updateOrderStatusMutation.mutate({
                      orderId: order.id,
                      status: "delivered"
                    })}
                    disabled={updateOrderStatusMutation.isPending}
                    data-testid={`button-mark-delivered-${order.id}`}
                  >
                    <Package className="w-4 h-4 mr-1" />
                    Delivered
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast({ title: "Calling customer", description: "Initiating call..." })}
                    data-testid={`button-call-customer-${order.id}`}
                  >
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const url = `https://www.google.com/maps/dir/?api=1&destination=${order.deliveryAddress.lat},${order.deliveryAddress.lng}`;
                      window.open(url, '_blank');
                      toast({ title: "Navigation opened", description: "Google Maps opened for navigation" });
                    }}
                    data-testid={`button-navigate-${order.id}`}
                  >
                    <Navigation className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
