import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface WebSocketMessage {
  type: string;
  data?: any;
  userId?: string;
  role?: string;
  location?: { lat: number; lng: number };
  [key: string]: any;
}

interface WebSocketContextType {
  isConnected: boolean;
  sendMessage: ((message: WebSocketMessage) => void) | null;
  lastMessage: WebSocketMessage | null;
}

const WebSocketContext = createContext<WebSocketContextType>({
  isConnected: false,
  sendMessage: null,
  lastMessage: null,
});

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const connect = () => {
    try {
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        console.log("WebSocket connected");
        setIsConnected(true);
        reconnectAttempts.current = 0;
      };

      wsRef.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);
          
          // Handle different message types
          switch (message.type) {
            case 'new_order':
              toast({
                title: "New Order Received!",
                description: `Order #${message.data?.orderNumber || 'Unknown'} has been placed`,
              });
              break;
            
            case 'order_update':
              toast({
                title: "Order Status Updated",
                description: `Order #${message.data?.orderNumber || 'Unknown'} is now ${message.data?.status || 'updated'}`,
              });
              break;
            
            case 'location_update':
              // Handle real-time location updates for delivery tracking
              console.log("Delivery partner location update:", message.data);
              break;
            
            case 'notification':
              toast({
                title: message.data?.title || "Notification",
                description: message.data?.message || "You have a new notification",
                variant: message.data?.type === 'error' ? 'destructive' : 'default',
              });
              break;
          }
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      wsRef.current.onclose = (event) => {
        console.log("WebSocket disconnected:", event.code, event.reason);
        setIsConnected(false);
        
        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 10000);
          reconnectAttempts.current++;
          
          console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current})`);
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, delay);
        } else if (reconnectAttempts.current >= maxReconnectAttempts) {
          toast({
            title: "Connection Lost",
            description: "Unable to connect to real-time updates. Please refresh the page.",
            variant: "destructive",
          });
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

    } catch (error) {
      console.error("Failed to create WebSocket connection:", error);
    }
  };

  const sendMessage = (message: WebSocketMessage) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      try {
        wsRef.current.send(JSON.stringify(message));
      } catch (error) {
        console.error("Error sending WebSocket message:", error);
      }
    } else {
      console.warn("WebSocket is not connected. Message not sent:", message);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounting");
      }
    };
  }, []);

  return (
    <WebSocketContext.Provider
      value={{
        isConnected,
        sendMessage: isConnected ? sendMessage : null,
        lastMessage,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}

// Higher-order component to wrap the app with WebSocket provider
export function withWebSocket<P extends object>(Component: React.ComponentType<P>) {
  return function WebSocketWrappedComponent(props: P) {
    return (
      <WebSocketProvider>
        <Component {...props} />
      </WebSocketProvider>
    );
  };
}
