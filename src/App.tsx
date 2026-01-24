import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";
import { useVisitTracker } from "@/hooks/useVisitTracker";
import Index from "./pages/Index";
import Shop from "./pages/Shop";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Auth from "./pages/Auth";
import Admin from "./pages/Admin";
import AdminSetup from "./pages/AdminSetup";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Separate component to use hooks inside Router context
function AppRoutes() {
  useVisitTracker();
  
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/order-success" element={<OrderSuccess />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/admin/setup" element={<AdminSetup />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
