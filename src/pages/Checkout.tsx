import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Minus, Plus, Trash2 } from "lucide-react";
import { z } from "zod";

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: {
        createOrder: () => Promise<string>;
        onApprove: (data: { orderID: string }) => Promise<void>;
        onError: (err: unknown) => void;
      }) => { render: (selector: string) => void };
    };
  }
}

const shippingSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  name: z.string().min(2, "Name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  zip: z.string().min(3, "ZIP/Postal code is required"),
});

const Checkout = () => {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const paypalRef = useRef<HTMLDivElement>(null);
  const paypalButtonsRendered = useRef(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  
  // Use refs for shipping to avoid re-rendering PayPal on every keystroke
  const shippingRef = useRef({
    email: "",
    name: "",
    address: "",
    city: "",
    country: "",
    zip: "",
  });
  
  const [shipping, setShipping] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    country: "",
    zip: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [processing, setProcessing] = useState(false);

  // Keep ref in sync with state
  useEffect(() => {
    shippingRef.current = shipping;
  }, [shipping]);

  // Load PayPal SDK
  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null;
    
    const loadPayPalScript = async () => {
      // Fetch client ID from edge function
      const { data, error } = await supabase.functions.invoke("get-paypal-client-id");
      
      if (error || !data?.clientId) {
        console.error("Failed to get PayPal client ID:", error);
        return;
      }

      // Check if script already exists
      const existingScript = document.querySelector(`script[src*="paypal.com/sdk/js"]`);
      if (existingScript) {
        setPaypalLoaded(true);
        return;
      }

      scriptElement = document.createElement("script");
      scriptElement.src = `https://www.paypal.com/sdk/js?client-id=${data.clientId}&currency=USD`;
      scriptElement.async = true;
      scriptElement.onload = () => setPaypalLoaded(true);
      document.body.appendChild(scriptElement);
    };

    if (items.length > 0) {
      loadPayPalScript();
    }

    // Cleanup on unmount
    return () => {
      paypalButtonsRendered.current = false;
    };
  }, [items.length]);

  // Render PayPal buttons only once
  useEffect(() => {
    if (!paypalLoaded || !window.paypal || !paypalRef.current || items.length === 0) return;
    if (paypalButtonsRendered.current) return;

    paypalButtonsRendered.current = true;

    window.paypal.Buttons({
      createOrder: async () => {
        // Validate shipping info using ref for current values
        const currentShipping = shippingRef.current;
        const result = shippingSchema.safeParse(currentShipping);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            fieldErrors[err.path[0] as string] = err.message;
          });
          setErrors(fieldErrors);
          throw new Error("Please fill in all shipping details");
        }
        setErrors({});

        // Create order via edge function (only send id and quantity, server validates prices)
        const { data, error } = await supabase.functions.invoke("create-paypal-order", {
          body: {
            items: items.map((item) => ({
              id: item.id,
              quantity: item.quantity,
            })),
            shipping: currentShipping,
          },
        });

        if (error || !data?.orderId) {
          throw new Error("Failed to create order");
        }

        return data.orderId;
      },
      onApprove: async (data: { orderID: string }) => {
        setProcessing(true);
        try {
          const currentShipping = shippingRef.current;
          // Capture the order (only send id and quantity, server validates prices)
          const { data: captureData, error } = await supabase.functions.invoke(
            "capture-paypal-order",
            {
              body: {
                orderId: data.orderID,
                items: items.map((item) => ({
                  id: item.id,
                  quantity: item.quantity,
                })),
                shipping: currentShipping,
              },
            }
          );

          if (error) {
            throw new Error("Payment capture failed");
          }

          clearCart();
          toast({
            title: "Payment successful!",
            description: "Thank you for your order.",
          });
          navigate("/order-success");
        } catch (err) {
          toast({
            title: "Payment failed",
            description: "There was an error processing your payment.",
            variant: "destructive",
          });
        } finally {
          setProcessing(false);
        }
      },
      onError: (err: unknown) => {
        console.error("PayPal error:", err);
        toast({
          title: "Payment error",
          description: "There was an error with PayPal. Please try again.",
          variant: "destructive",
        });
      },
    }).render("#paypal-button-container");
  }, [paypalLoaded, items, clearCart, navigate, toast]);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-32 pb-20">
          <div className="container mx-auto px-6 text-center">
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Add some items to get started.
            </p>
            <Button variant="hero" onClick={() => navigate("/shop")}>
              Browse Shop
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <main className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-12">Checkout</h1>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Cart Items */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Your Cart</h2>
              {items.map((item) => (
                <div
                  key={item.id}
                  className="liquid-glass p-4 flex items-center gap-4"
                >
                  <div className="w-16 h-16 rounded-lg bg-secondary/30 flex items-center justify-center shrink-0">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      <span className="text-xl font-bold text-muted-foreground">
                        {item.name.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{item.name}</h3>
                    <p className="text-primary font-semibold">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-secondary rounded"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-secondary rounded"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {/* Total */}
              <div className="liquid-glass p-6">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping & Payment */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Shipping Details</h2>
              <div className="liquid-glass p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={shipping.email}
                    onChange={(e) =>
                      setShipping({ ...shipping, email: e.target.value })
                    }
                    className="bg-secondary/50"
                    placeholder="you@example.com"
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={shipping.name}
                    onChange={(e) =>
                      setShipping({ ...shipping, name: e.target.value })
                    }
                    className="bg-secondary/50"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={shipping.address}
                    onChange={(e) =>
                      setShipping({ ...shipping, address: e.target.value })
                    }
                    className="bg-secondary/50"
                    placeholder="123 Main St"
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={shipping.city}
                      onChange={(e) =>
                        setShipping({ ...shipping, city: e.target.value })
                      }
                      className="bg-secondary/50"
                      placeholder="New York"
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      value={shipping.zip}
                      onChange={(e) =>
                        setShipping({ ...shipping, zip: e.target.value })
                      }
                      className="bg-secondary/50"
                      placeholder="10001"
                    />
                    {errors.zip && (
                      <p className="text-sm text-destructive">{errors.zip}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={shipping.country}
                    onChange={(e) =>
                      setShipping({ ...shipping, country: e.target.value })
                    }
                    className="bg-secondary/50"
                    placeholder="United States"
                  />
                  {errors.country && (
                    <p className="text-sm text-destructive">{errors.country}</p>
                  )}
                </div>
              </div>

              {/* PayPal Button */}
              <div className="liquid-glass p-6">
                <h3 className="text-lg font-semibold mb-4">Payment</h3>
                {processing ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Processing payment...</p>
                  </div>
                ) : (
                  <div id="paypal-button-container" ref={paypalRef} className="min-h-[45px]" />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Checkout;
