import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Clock, Package, Truck, CheckCircle, Phone } from 'lucide-react';

interface OrderTrackingModalProps {
  children: React.ReactNode;
}

export function OrderTrackingModal({ children }: OrderTrackingModalProps) {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [orderData, setOrderData] = useState<any>(null);

  // Dummy order data
  const dummyOrder = {
    id: 'o1',
    orderNumber: 'DN1234567890',
    status: 'in_transit',
    items: [
      { name: 'Organic Bananas', quantity: 2, price: 85 },
      { name: 'Whole Wheat Bread', quantity: 1, price: 45 }
    ],
    total: 245,
    deliveryAddress: {
      street: '123 Customer Street',
      city: 'Delhi',
      state: 'Delhi',
      pincode: '110001'
    },
    estimatedDeliveryTime: new Date(Date.now() + 15 * 60 * 1000),
    deliveryPartner: {
      name: 'Raj Kumar',
      phone: '+91 9876543210',
      vehicleNumber: 'DL 01 AB 1234'
    },
    statusHistory: [
      { status: 'placed', time: new Date(Date.now() - 60 * 60 * 1000), description: 'Order placed successfully' },
      { status: 'accepted', time: new Date(Date.now() - 45 * 60 * 1000), description: 'Order accepted by store' },
      { status: 'packed', time: new Date(Date.now() - 30 * 60 * 1000), description: 'Order packed and ready for pickup' },
      { status: 'picked_up', time: new Date(Date.now() - 15 * 60 * 1000), description: 'Order picked up by delivery partner' },
      { status: 'in_transit', time: new Date(Date.now() - 5 * 60 * 1000), description: 'Order is on the way to you' }
    ]
  };

  const handleTrackOrder = () => {
    if (!trackingId.trim()) {
      toast({
        title: "Enter tracking ID",
        description: "Please enter a valid order number or tracking ID.",
        variant: "destructive"
      });
      return;
    }

    // Simulate API call
    setTimeout(() => {
      setOrderData(dummyOrder);
      toast({
        title: "Order found",
        description: `Tracking order #${dummyOrder.orderNumber}`,
      });
    }, 1000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'placed':
        return <Package className="w-4 h-4" />;
      case 'accepted':
      case 'packed':
        return <CheckCircle className="w-4 h-4" />;
      case 'picked_up':
      case 'in_transit':
        return <Truck className="w-4 h-4" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      case 'in_transit':
        return 'text-blue-600';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Package className="w-5 h-5 mr-2" />
            Track Your Order
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tracking Input */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="trackingId">Order Number or Tracking ID</Label>
              <div className="flex space-x-2">
                <Input
                  id="trackingId"
                  placeholder="DN1234567890"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
                />
                <Button onClick={handleTrackOrder}>
                  Track
                </Button>
              </div>
            </div>
          </div>

          {/* Order Details */}
          {orderData && (
            <div className="space-y-6">
              {/* Order Summary */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">Order #{orderData.orderNumber}</h3>
                      <p className="text-sm text-muted-foreground">
                        {orderData.items.length} items • ₹{orderData.total}
                      </p>
                    </div>
                    <Badge variant={orderData.status === 'delivered' ? 'default' : 'secondary'}>
                      {orderData.status.replace('_', ' ')}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    {orderData.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name} x{item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Delivery Info */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Delivery Information</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Delivery Address</p>
                        <p className="text-sm text-muted-foreground">
                          {orderData.deliveryAddress.street}, {orderData.deliveryAddress.city}, {orderData.deliveryAddress.state} - {orderData.deliveryAddress.pincode}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Estimated Delivery</p>
                        <p className="text-sm text-muted-foreground">
                          {orderData.estimatedDeliveryTime.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>

                    {orderData.deliveryPartner && (
                      <div className="flex items-start space-x-3">
                        <Truck className="w-4 h-4 mt-0.5 text-muted-foreground" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Delivery Partner</p>
                          <p className="text-sm text-muted-foreground">
                            {orderData.deliveryPartner.name} • {orderData.deliveryPartner.vehicleNumber}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toast({ 
                            title: "Calling delivery partner", 
                            description: `Calling ${orderData.deliveryPartner.name}...` 
                          })}
                        >
                          <Phone className="w-3 h-3 mr-1" />
                          Call
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Order Timeline */}
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-4">Order Timeline</h4>
                  
                  <div className="space-y-4">
                    {orderData.statusHistory.map((status: any, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className={`mt-0.5 ${getStatusColor(status.status)}`}>
                          {getStatusIcon(status.status)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium capitalize">
                            {status.status.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {status.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {status.time.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Live Tracking */}
              {orderData.status === 'in_transit' && (
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-medium mb-3">Live Tracking</h4>
                    <div className="h-32 bg-muted/20 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <MapPin className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Live map tracking will be displayed here
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}