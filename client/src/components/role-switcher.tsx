import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { User, Package, Truck, Shield, LogOut, ChevronDown } from "lucide-react";

export default function RoleSwitcher() {
  const { user, switchRoleMutation, logoutMutation } = useAuth();

  if (!user) return null;

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "customer":
        return <User className="w-4 h-4" />;
      case "store_owner":
        return <Package className="w-4 h-4" />;
      case "delivery_partner":
        return <Truck className="w-4 h-4" />;
      case "admin":
        return <Shield className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "customer":
        return "Customer";
      case "store_owner":
        return "Store Owner";
      case "delivery_partner":
        return "Delivery Partner";
      case "admin":
        return "Admin";
      default:
        return "Customer";
    }
  };

  const handleRoleSwitch = (newRole: string) => {
    if (newRole !== user.role) {
      switchRoleMutation.mutate({ role: newRole });
    }
  };

  const userInitials = `${user.firstName?.[0] || user.username?.[0] || 'U'}${user.lastName?.[0] || ''}`;

  return (
    <div className="flex items-center space-x-4">
      {/* Role Selector */}
      <Select value={user.role} onValueChange={handleRoleSwitch}>
        <SelectTrigger className="w-48" data-testid="select-role-switcher">
          <div className="flex items-center space-x-2">
            {getRoleIcon(user.role)}
            <SelectValue />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="customer" data-testid="role-option-customer">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Customer View</span>
            </div>
          </SelectItem>
          <SelectItem value="store_owner" data-testid="role-option-store">
            <div className="flex items-center space-x-2">
              <Package className="w-4 h-4" />
              <span>Store Owner</span>
            </div>
          </SelectItem>
          <SelectItem value="delivery_partner" data-testid="role-option-delivery">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4" />
              <span>Delivery Partner</span>
            </div>
          </SelectItem>
          <SelectItem value="admin" data-testid="role-option-admin">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Admin</span>
            </div>
          </SelectItem>
        </SelectContent>
      </Select>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center space-x-2 h-10"
            data-testid="button-user-menu"
          >
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium">
                {user.firstName && user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.username}
              </p>
              <p className="text-xs text-muted-foreground">
                {getRoleLabel(user.role)}
              </p>
            </div>
            <ChevronDown className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="px-2 py-1.5">
            <p className="text-sm font-medium">{user.email}</p>
            <p className="text-xs text-muted-foreground">
              Currently: {getRoleLabel(user.role)}
            </p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => logoutMutation.mutate()}
            className="text-destructive focus:text-destructive"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
