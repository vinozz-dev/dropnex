import { useAuth } from "@/hooks/use-auth";
import RoleSwitcher from "@/components/role-switcher";
import CustomerInterface from "@/components/customer/customer-interface";
import StoreDashboard from "@/components/store/store-dashboard";
import DeliveryInterface from "@/components/delivery/delivery-interface";
import AdminDashboard from "@/components/admin/admin-dashboard";
import { OrderTrackingModal } from "@/components/order-tracking-modal";
import { NotificationCenter } from "@/components/notification-center";
import { Button } from "@/components/ui/button";
import { Package, Bell } from "lucide-react";
import { useWebSocket } from "@/hooks/use-websocket";
import { useEffect } from "react";

export default function HomePage() {
  const { user } = useAuth();
  const { sendMessage, lastMessage } = useWebSocket();

  useEffect(() => {
    if (user && sendMessage) {
      // Authenticate WebSocket connection
      sendMessage({
        type: 'auth',
        userId: user.id,
        role: user.role
      });
    }
  }, [user, sendMessage]);

  if (!user) return null;

  const renderRoleInterface = () => {
    switch (user.role) {
      case "customer":
        return <CustomerInterface />;
      case "store_owner":
        return <StoreDashboard />;
      case "delivery_partner":
        return <DeliveryInterface />;
      case "admin":
        return <AdminDashboard />;
      default:
        return <CustomerInterface />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Global Header */}
      <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-primary">DropNex</h1>
              <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                BETA
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <OrderTrackingModal>
                <Button variant="outline" size="sm">
                  <Package className="w-4 h-4 mr-2" />
                  Track Order
                </Button>
              </OrderTrackingModal>
              
              <NotificationCenter>
                <Button variant="outline" size="sm">
                  <Bell className="w-4 h-4" />
                </Button>
              </NotificationCenter>
              
              <RoleSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {renderRoleInterface()}
      </main>


    </div>
  );
}
