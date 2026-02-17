import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/hooks/use-cart";
import { getCurrentLocation, reverseGeocode } from "@/lib/location";
import { CartModal } from "@/components/cart-modal";
import { queryClient } from "@/lib/queryClient";
import { dummyStores } from "@/lib/dummy-data";
import { Search, ShoppingCart, Filter, Clock, MapPin, Package } from "lucide-react";
import { Store, Product } from "@shared/schema";

export default function CustomerInterface() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<string>('Getting location...');
  const { toast } = useToast();
  const { addItem, getTotalItems } = useCart();

  const { data: stores = [], isLoading: storesLoading } = useQuery({
    queryKey: ["/api/stores"],
    staleTime: 0,
    refetchOnMount: true,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Force dummy stores if API fails
  const typedStores = (stores && stores.length > 0) ? stores as Store[] : dummyStores;

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ["/api/stores", selectedStore, "products"],
    enabled: !!selectedStore,
  });

  // Type assertions for API responses  
  const typedProducts = products as Product[];

  // Get user location on component mount
  useEffect(() => {
    getCurrentLocation()
      .then(async (location) => {
        const address = await reverseGeocode(location.lat, location.lng);
        setUserLocation(address);
      })
      .catch(() => {
        setUserLocation('Delhi, India');
      });
  }, []);

  // Filter products based on search and category
  const filteredProducts = typedProducts.filter(product => {
    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || 
      product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddToCart = (product: Product) => {
    addItem(product);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  const handleCategoryFilter = (category: string) => {
    setSelectedCategory(selectedCategory === category ? null : category);
    toast({
      title: selectedCategory === category ? "Filter cleared" : `Filtering by ${category}`,
      description: selectedCategory === category ? "Showing all products" : `Showing ${category.toLowerCase()} products`,
    });
  };

  const handleExpandSearch = () => {
    // Force refetch stores data
    queryClient.invalidateQueries({ queryKey: ["/api/stores"] });
    
    toast({
      title: `Found ${typedStores.length} stores in expanded area`,
      description: "All available stores are now shown in the list.",
    });
    
    // Log detailed store info to console
    console.log('🏪 Available Stores:', typedStores.map(store => ({
      name: store.name,
      description: store.description,
      rating: `${store.rating}⭐ (${store.totalReviews} reviews)`,
      minOrder: `₹${store.minOrderAmount}`,
      deliveryFee: `₹${store.deliveryFee}`,
      deliveryRadius: `${store.deliveryRadius}km`,
      address: `${store.address.street}, ${store.address.city}`,
      phone: store.phone
    })));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Location and Search Bar */}
      <div className="mb-8">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center text-sm text-muted-foreground mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{userLocation}</span>
          </div>
        </div>
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="Search products, stores..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 text-lg"
            data-testid="input-search"
          />
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center">
        <Button 
          variant={selectedCategory === 'Fruits' ? 'default' : 'outline'} 
          size="sm" 
          onClick={() => handleCategoryFilter('Fruits')}
          data-testid="filter-groceries"
        >
          <Filter className="w-4 h-4 mr-2" />
          Fruits
        </Button>
        <Button 
          variant={selectedCategory === 'Electronics' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => handleCategoryFilter('Electronics')}
          data-testid="filter-electronics"
        >
          Electronics
        </Button>
        <Button 
          variant={selectedCategory === 'Medicine' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => handleCategoryFilter('Medicine')}
          data-testid="filter-pharmacy"
        >
          Medicine
        </Button>
        <Button 
          variant={selectedCategory === 'Bakery' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => handleCategoryFilter('Bakery')}
          data-testid="filter-bakery"
        >
          Bakery
        </Button>
        <Button 
          variant={selectedCategory === 'Dairy' ? 'default' : 'outline'} 
          size="sm"
          onClick={() => handleCategoryFilter('Dairy')}
          data-testid="filter-dairy"
        >
          Dairy
        </Button>
      </div>

      {/* Stores Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6 text-center">Available Stores</h2>
        {storesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {typedStores.map((store: Store) => (
              <Card
                key={store.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedStore === store.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "hover:border-primary/50"
                }`}
                onClick={() => setSelectedStore(store.id)}
                data-testid={`store-card-${store.id}`}
              >
                <CardContent className="p-4">
                  <h4 className="font-medium text-sm mb-2">{store.name}</h4>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{store.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      <span>25-35 min</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-600">★ {store.rating}</span>
                    </div>
                  </div>
                  <div className="mt-2 text-xs">
                    <span className="text-muted-foreground">Min: ₹{store.minOrderAmount} • Fee: ₹{store.deliveryFee}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Products Section */}
      <div>
          {selectedStore ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Products</h2>
                <CartModal>
                  <Button size="sm" variant="outline" data-testid="button-cart">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Cart ({getTotalItems()})
                  </Button>
                </CartModal>
              </div>

              {productsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-64 bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No products available</h3>
                  <p className="text-muted-foreground">
                    This store hasn't added any products yet.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredProducts.map((product: Product) => (
                    <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              e.currentTarget.nextElementSibling?.classList.remove('hidden');
                            }}
                          />
                        ) : null}
                        <Package className={`w-12 h-12 text-muted-foreground ${product.images && product.images.length > 0 ? 'hidden' : ''}`} />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium mb-1" data-testid={`product-name-${product.id}`}>
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {product.unit}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-primary">
                            ₹{product.price}
                          </span>
                          <Button 
                            size="sm"
                            onClick={() => handleAddToCart(product)}
                            data-testid={`button-add-to-cart-${product.id}`}
                          >
                            Add
                          </Button>
                        </div>
                        {product.stockQuantity !== undefined && product.stockQuantity !== null && product.stockQuantity < 10 && (
                          <Badge variant="destructive" className="mt-2">
                            Low Stock
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16">
              <MapPin className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Select a Store</h3>
              <p className="text-muted-foreground">
                Choose a store above to browse their products and start shopping.
              </p>
            </div>
          )}
        </div>
    </div>
  );
}
