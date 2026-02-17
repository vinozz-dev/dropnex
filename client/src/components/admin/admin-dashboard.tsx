import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  BarChart3, 
  Users, 
  Store, 
  Truck, 
  ShoppingBag, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign
} from "lucide-react";
import { Order, Store as StoreType, User } from "@shared/schema";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState('analytics');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  
  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
  });

  const { data: stores = [] } = useQuery({
    queryKey: ["/api/stores"],
  });

  // Type assertions for API responses
  const typedOrders = orders as Order[];
  const typedStores = stores as StoreType[];

  // Calculate metrics
  const totalOrders = typedOrders.length;
  const todaysOrders = typedOrders.filter((order: Order) => {
    const orderDate = new Date(order.createdAt).toDateString();
    const today = new Date().toDateString();
    return orderDate === today;
  });

  const totalRevenue = typedOrders.reduce((sum: number, order: Order) => {
    return sum + parseFloat(order.total || "0");
  }, 0);

  const activeStores = typedStores.filter((store: StoreType) => store.isActive).length;

  const dummyUsers = [
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'customer', status: 'active', orders: 15, joined: '2024-01-15' },
    { id: '2', name: 'Sarah Smith', email: 'sarah@example.com', role: 'store_owner', status: 'active', orders: 0, joined: '2024-02-10' },
    { id: '3', name: 'Mike Johnson', email: 'mike@example.com', role: 'delivery_partner', status: 'active', orders: 45, joined: '2024-01-20' },
    { id: '4', name: 'Lisa Brown', email: 'lisa@example.com', role: 'customer', status: 'inactive', orders: 3, joined: '2024-03-05' }
  ];

  const dummyDeliveryPartners = [
    { id: '1', name: 'Raj Kumar', phone: '+91 9876543210', vehicle: 'Bike', status: 'online', deliveries: 156, rating: 4.8 },
    { id: '2', name: 'Priya Sharma', phone: '+91 9876543211', vehicle: 'Scooter', status: 'offline', deliveries: 89, rating: 4.6 },
    { id: '3', name: 'Amit Singh', phone: '+91 9876543212', vehicle: 'Car', status: 'online', deliveries: 234, rating: 4.9 },
    { id: '4', name: 'Neha Gupta', phone: '+91 9876543213', vehicle: 'Bike', status: 'busy', deliveries: 67, rating: 4.5 }
  ];

  const recentActivities = [
    {
      id: 1,
      type: "new_store",
      icon: Store,
      title: "New store registered",
      description: "Green Valley Supermarket joined the platform",
      time: "2 min ago",
      color: "text-primary"
    },
    {
      id: 2,
      type: "delivery_verified",
      icon: Truck,
      title: "Delivery partner verified",
      description: "Priya Sharma completed identity verification",
      time: "15 min ago",
      color: "text-secondary"
    },
    {
      id: 3,
      type: "order_dispute",
      icon: AlertCircle,
      title: "Order dispute reported",
      description: "Order flagged for review",
      time: "1 hour ago",
      color: "text-accent"
    }
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-border">
        <div className="p-6">
          <div className="pl-2 border-l-4 border-purple-500">
            <h2 className="text-lg font-semibold">Admin Panel</h2>
            <p className="text-sm text-muted-foreground">Platform Management</p>
          </div>
        </div>
        
        <nav className="px-6 space-y-2">
          <Button 
            variant={activeView === 'analytics' ? 'secondary' : 'ghost'} 
            className="w-full justify-start" 
            onClick={() => setActiveView('analytics')}
            data-testid="nav-analytics"
          >
            <BarChart3 className="w-4 h-4 mr-3" />
            Analytics
          </Button>
          <Button 
            variant={activeView === 'users' ? 'secondary' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => setActiveView('users')}
            data-testid="nav-users"
          >
            <Users className="w-4 h-4 mr-3" />
            Users
          </Button>
          <Button 
            variant={activeView === 'stores' ? 'secondary' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => setActiveView('stores')}
            data-testid="nav-stores"
          >
            <Store className="w-4 h-4 mr-3" />
            Stores
          </Button>
          <Button 
            variant={activeView === 'delivery' ? 'secondary' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => setActiveView('delivery')}
            data-testid="nav-delivery-partners"
          >
            <Truck className="w-4 h-4 mr-3" />
            Delivery Partners
          </Button>
          <Button 
            variant={activeView === 'orders' ? 'secondary' : 'ghost'} 
            className="w-full justify-start"
            onClick={() => setActiveView('orders')}
            data-testid="nav-orders"
          >
            <ShoppingBag className="w-4 h-4 mr-3" />
            Orders
          </Button>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold">Platform Analytics</h1>
            <p className="text-muted-foreground">Overview of your marketplace performance</p>
          </div>
          
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="metric-total-orders">
                  {totalOrders}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-secondary font-medium">+{todaysOrders.length}</span>
                  {" "}today
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Stores</CardTitle>
                <Store className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="metric-active-stores">
                  {activeStores}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-secondary font-medium">+{stores.length - activeStores}</span>
                  {" "}pending verification
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivery Partners</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="metric-delivery-partners">
                  89
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-secondary font-medium">67</span>
                  {" "}currently online
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">GMV</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold" data-testid="metric-gmv">
                  ₹{totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-secondary font-medium">+22%</span>
                  {" "}from last month
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
              <TabsTrigger value="orders" data-testid="tab-orders-admin">Orders</TabsTrigger>
              <TabsTrigger value="activity" data-testid="tab-activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Orders Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Order Trends (Last 7 Days)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Monday</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-3/4 h-full bg-primary"></div>
                          </div>
                          <span className="text-sm font-medium">45</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tuesday</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-4/5 h-full bg-primary"></div>
                          </div>
                          <span className="text-sm font-medium">52</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Wednesday</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-2/3 h-full bg-primary"></div>
                          </div>
                          <span className="text-sm font-medium">38</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Today</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="w-full h-full bg-green-500"></div>
                          </div>
                          <span className="text-sm font-medium text-green-600">67</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Revenue Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Revenue Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm">Order Value</span>
                        <span className="font-medium">₹{totalRevenue.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Delivery Fees</span>
                        <span className="font-medium">₹8,450</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Platform Commission</span>
                        <span className="font-medium">₹12,340</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-medium">Total Revenue</span>
                        <span className="font-bold text-green-600">₹{(totalRevenue + 8450 + 12340).toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {orders.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No orders found</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {orders.slice(0, 10).map((order: Order) => (
                        <div
                          key={order.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                          data-testid={`admin-order-card-${order.id}`}
                        >
                          <div>
                            <p className="font-medium">#{order.orderNumber}</p>
                            <p className="text-sm text-muted-foreground">
                              ₹{order.total} • {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={
                                order.status === "delivered" ? "default" :
                                order.status === "cancelled" ? "destructive" :
                                "secondary"
                              }
                            >
                              {order.status}
                            </Badge>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toast({ 
                                title: "Order Details", 
                                description: `Viewing details for order #${order.orderNumber}` 
                              })}
                              data-testid={`button-view-order-${order.id}`}
                            >
                              View
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div 
                        key={activity.id} 
                        className="flex items-center space-x-4 py-3 border-b border-border last:border-b-0"
                        data-testid={`activity-item-${activity.id}`}
                      >
                        <div className={`w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center`}>
                          <activity.icon className={`w-5 h-5 ${activity.color}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">{activity.description}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
