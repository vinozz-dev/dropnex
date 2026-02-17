import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Package, Store, Truck, CheckCircle } from 'lucide-react';

interface NotificationCenterProps {
  children: React.ReactNode;
}

export function NotificationCenter({ children }: NotificationCenterProps) {
  const [isOpen, setIsOpen] = useState(false);

  const dummyNotifications = [
    {
      id: '1',
      type: 'order',
      title: 'Order Delivered',
      message: 'Your order #DN1234567890 has been delivered successfully',
      time: '2 minutes ago',
      read: false,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: '2',
      type: 'store',
      title: 'New Store Added',
      message: 'Coffee Corner is now available in your area',
      time: '1 hour ago',
      read: false,
      icon: Store,
      color: 'text-blue-600'
    },
    {
      id: '3',
      type: 'delivery',
      title: 'Delivery Partner Assigned',
      message: 'Raj Kumar is on the way to pick up your order',
      time: '3 hours ago',
      read: true,
      icon: Truck,
      color: 'text-orange-600'
    },
    {
      id: '4',
      type: 'order',
      title: 'Order Confirmed',
      message: 'Your order has been confirmed by Fresh Mart',
      time: '5 hours ago',
      read: true,
      icon: Package,
      color: 'text-purple-600'
    }
  ];

  const unreadCount = dummyNotifications.filter(n => !n.read).length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className="relative">
          {children}
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications ({unreadCount} unread)
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {dummyNotifications.map((notification) => (
            <Card key={notification.id} className={`${!notification.read ? 'border-primary/50 bg-primary/5' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className={`mt-0.5 ${notification.color}`}>
                    <notification.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" size="sm">
            Mark All Read
          </Button>
          <Button size="sm">
            Clear All
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}