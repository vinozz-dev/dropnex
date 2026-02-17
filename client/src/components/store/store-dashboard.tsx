import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { StoreCreationModal } from "@/components/store-creation-modal";
import { Plus, Package, ShoppingBag, TrendingUp, Users } from "lucide-react";
import { Store, Product, Order } from "@shared/schema";
import { useForm } from "react-hook-form";

export default function StoreDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);

  const { data: stores = [] } = useQuery({
    queryKey: ["/api/stores", user?.id, "owned"],
  });

  // Type assertions for API responses
  const typedStores = stores as Store[];
  const currentStore = typedStores[0]; // For simplicity, assume one store per owner

  const { data: products = [] } = useQuery({
    queryKey: ["/api/stores", currentStore?.id, "products"],
    enabled: !!currentStore?.id,
  });
  const typedProducts = products as Product[];

  const { data: orders = [] } = useQuery({
    queryKey: ["/api/orders"],
  });
  const typedOrders = orders as Order[];

  const productForm = useForm({
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      unit: "piece",
      stockQuantity: "",
    },
  });

  const createProductMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", `/api/stores/${currentStore.id}/products`, {
        ...data,
        price: parseFloat(data.price),
        stockQuantity: parseInt(data.stockQuantity),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stores", currentStore.id, "products"] });
      setIsProductDialogOpen(false);
      productForm.reset();
      toast({
        title: "Success",
        description: "Product added successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      const response = await apiRequest("PUT", `/api/orders/${orderId}/status`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Success",
        description: "Order status updated!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!currentStore) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Set Up Your Store</h2>
        <p className="text-muted-foreground mb-6">
          You haven't created a store yet. Set up your store to start selling products.
        </p>
        <StoreCreationModal>
          <Button data-testid="button-create-store">Create Store</Button>
        </StoreCreationModal>
      </div>
    );
  }

  const todaysOrders = orders.filter((order: Order) => {
    const orderDate = new Date(order.createdAt).toDateString();
    const today = new Date().toDateString();
    return orderDate === today;
  });

  const pendingOrders = orders.filter((order: Order) => order.status === "placed");

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Store Dashboard</h1>
          <p className="text-muted-foreground">{currentStore.name}</p>
        </div>
        
        <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-product">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Product</DialogTitle>
              <DialogDescription>
                Add a new product to your store inventory.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={productForm.handleSubmit((data) => createProductMutation.mutate(data))} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  placeholder="Organic Bananas"
                  data-testid="input-product-name"
                  {...productForm.register("name", { required: true })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="Fruits"
                  data-testid="input-product-category"
                  {...productForm.register("category", { required: true })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="85.00"
                    data-testid="input-product-price"
                    {...productForm.register("price", { required: true })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    placeholder="kg"
                    data-testid="input-product-unit"
                    {...productForm.register("unit", { required: true })}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="stockQuantity">Stock Quantity</Label>
                <Input
                  id="stockQuantity"
                  type="number"
                  placeholder="50"
                  data-testid="input-product-stock"
                  {...productForm.register("stockQuantity", { required: true })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Fresh organic bananas from local farms"
                  data-testid="textarea-product-description"
                  {...productForm.register("description")}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsProductDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createProductMutation.isPending}
                  data-testid="button-submit-product"
                >
                  {createProductMutation.isPending ? "Adding..." : "Add Product"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todaysOrders.length}</div>
            <p className="text-xs text-muted-foreground">
              {pendingOrders.length} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₹{todaysOrders.reduce((sum: number, order: Order) => sum + parseFloat(order.total), 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Today's total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">
              {products.filter((p: Product) => p.stockQuantity < p.lowStockThreshold).length} low stock
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStore.rating || "N/A"}</div>
            <p className="text-xs text-muted-foreground">
              {currentStore.totalReviews || 0} reviews
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList>
          <TabsTrigger value="orders" data-testid="tab-orders">Orders</TabsTrigger>
          <TabsTrigger value="products" data-testid="tab-products">Products</TabsTrigger>
          <TabsTrigger value="analytics" data-testid="tab-analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.slice(0, 10).map((order: Order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                      data-testid={`order-card-${order.id}`}
                    >
                      <div>
                        <p className="font-medium">#{order.orderNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          {Array.isArray(order.items) ? order.items.length : 0} items • ₹{order.total}
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
                        {order.status === "placed" && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatusMutation.mutate({
                              orderId: order.id,
                              status: "accepted"
                            })}
                            data-testid={`button-accept-order-${order.id}`}
                          >
                            Accept
                          </Button>
                        )}
                        {order.status === "accepted" && (
                          <Button
                            size="sm"
                            onClick={() => updateOrderStatusMutation.mutate({
                              orderId: order.id,
                              status: "packed"
                            })}
                            data-testid={`button-pack-order-${order.id}`}
                          >
                            Mark Packed
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Product Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No products added yet</p>
                  <Button
                    className="mt-4"
                    onClick={() => setIsProductDialogOpen(true)}
                    data-testid="button-add-first-product"
                  >
                    Add Your First Product
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products.map((product: Product) => (
                    <Card key={product.id} className="relative">
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-2">{product.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold">₹{product.price}</span>
                          <Badge
                            variant={product.stockQuantity > product.lowStockThreshold ? "default" : "destructive"}
                          >
                            Stock: {product.stockQuantity}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Today's Sales</span>
                    <span className="font-bold">₹2,450</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Week</span>
                    <span className="font-bold">₹15,680</span>
                  </div>
                  <div className="flex justify-between">
                    <span>This Month</span>
                    <span className="font-bold">₹68,920</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Growth Rate</span>
                    <span className="font-bold text-green-600">+12.5%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Organic Bananas</span>
                    <span className="text-sm text-muted-foreground">45 sold</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Whole Wheat Bread</span>
                    <span className="text-sm text-muted-foreground">32 sold</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Farm Fresh Milk</span>
                    <span className="text-sm text-muted-foreground">28 sold</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Basmati Rice</span>
                    <span className="text-sm text-muted-foreground">21 sold</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
