import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { getCurrentLocation, reverseGeocode } from '@/lib/location';
import { Store, MapPin } from 'lucide-react';

interface StoreCreationModalProps {
  children: React.ReactNode;
}

export function StoreCreationModal({ children }: StoreCreationModalProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [storeData, setStoreData] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    address: {
      street: '',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '',
    },
    deliveryRadius: 5,
    minOrderAmount: 100,
    deliveryFee: 30,
  });

  const handleGetLocation = async () => {
    setIsLoading(true);
    try {
      const location = await getCurrentLocation();
      const address = await reverseGeocode(location.lat, location.lng);
      
      // Parse address (simplified)
      const parts = address.split(', ');
      setStoreData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          street: parts[0] || '',
          city: parts[1] || 'Delhi',
        }
      }));
      
      toast({
        title: "Location detected",
        description: `Address set to: ${address}`,
      });
    } catch (error) {
      toast({
        title: "Location error",
        description: "Could not get your location. Please enter manually.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!storeData.name || !storeData.address.street || !storeData.address.pincode) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Simulate store creation
    toast({
      title: "Store created successfully!",
      description: `${storeData.name} has been created and is pending verification.`,
    });
    
    setIsOpen(false);
    // Reset form
    setStoreData({
      name: '',
      description: '',
      phone: '',
      email: '',
      address: {
        street: '',
        city: 'Delhi',
        state: 'Delhi',
        pincode: '',
      },
      deliveryRadius: 5,
      minOrderAmount: 100,
      deliveryFee: 30,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Store className="w-5 h-5 mr-2" />
            Create Your Store
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="storeName">Store Name *</Label>
              <Input
                id="storeName"
                placeholder="Fresh Mart"
                value={storeData.name}
                onChange={(e) => setStoreData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Your neighborhood grocery store"
                value={storeData.description}
                onChange={(e) => setStoreData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  placeholder="+91 9876543210"
                  value={storeData.phone}
                  onChange={(e) => setStoreData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="store@example.com"
                  value={storeData.email}
                  onChange={(e) => setStoreData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Store Address *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGetLocation}
                disabled={isLoading}
              >
                <MapPin className="w-4 h-4 mr-2" />
                {isLoading ? 'Getting...' : 'Use Current Location'}
              </Button>
            </div>

            <div>
              <Label htmlFor="street">Street Address *</Label>
              <Input
                id="street"
                placeholder="123 Main Street"
                value={storeData.address.street}
                onChange={(e) => setStoreData(prev => ({
                  ...prev,
                  address: { ...prev.address, street: e.target.value }
                }))}
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={storeData.address.city}
                  onChange={(e) => setStoreData(prev => ({
                    ...prev,
                    address: { ...prev.address, city: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={storeData.address.state}
                  onChange={(e) => setStoreData(prev => ({
                    ...prev,
                    address: { ...prev.address, state: e.target.value }
                  }))}
                />
              </div>
              <div>
                <Label htmlFor="pincode">Pincode *</Label>
                <Input
                  id="pincode"
                  placeholder="110001"
                  value={storeData.address.pincode}
                  onChange={(e) => setStoreData(prev => ({
                    ...prev,
                    address: { ...prev.address, pincode: e.target.value }
                  }))}
                  required
                />
              </div>
            </div>
          </div>

          {/* Delivery Settings */}
          <div className="space-y-4">
            <Label>Delivery Settings</Label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="radius">Delivery Radius (km)</Label>
                <Input
                  id="radius"
                  type="number"
                  min="1"
                  max="50"
                  value={storeData.deliveryRadius}
                  onChange={(e) => setStoreData(prev => ({ ...prev, deliveryRadius: parseInt(e.target.value) || 5 }))}
                />
              </div>
              <div>
                <Label htmlFor="minOrder">Min Order (₹)</Label>
                <Input
                  id="minOrder"
                  type="number"
                  min="0"
                  value={storeData.minOrderAmount}
                  onChange={(e) => setStoreData(prev => ({ ...prev, minOrderAmount: parseInt(e.target.value) || 0 }))}
                />
              </div>
              <div>
                <Label htmlFor="deliveryFee">Delivery Fee (₹)</Label>
                <Input
                  id="deliveryFee"
                  type="number"
                  min="0"
                  value={storeData.deliveryFee}
                  onChange={(e) => setStoreData(prev => ({ ...prev, deliveryFee: parseInt(e.target.value) || 0 }))}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Create Store
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}