import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Check, ArrowRight } from "lucide-react";

const AdminSetup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasAdmin, setHasAdmin] = useState<boolean | null>(null);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  
  const { signUp, signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if any admin exists
  useEffect(() => {
    const checkExistingAdmin = async () => {
      const { count, error } = await supabase
        .from("user_roles")
        .select("*", { count: "exact", head: true })
        .eq("role", "admin");

      if (!error) {
        setHasAdmin((count ?? 0) > 0);
      }
      setCheckingAdmin(false);
    };

    checkExistingAdmin();
  }, []);

  // Redirect if already admin
  useEffect(() => {
    if (user && hasAdmin === false) {
      // User just signed up and no admin exists - make them admin
      makeAdmin(user.id);
    }
  }, [user, hasAdmin]);

  const makeAdmin = async (userId: string) => {
    const { error } = await supabase
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });

    if (error) {
      toast({
        title: "Failed to set admin role",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Admin account created!",
        description: "You now have full admin access.",
      });
      // Refresh auth state and redirect
      window.location.href = "/admin";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // First, try to sign up
      const { error: signUpError } = await signUp(email, password);
      
      if (signUpError) {
        // If email exists, try to sign in instead
        if (signUpError.message.includes("already registered")) {
          const { error: signInError } = await signIn(email, password);
          if (signInError) {
            toast({
              title: "Authentication failed",
              description: signInError.message,
              variant: "destructive",
            });
            setLoading(false);
            return;
          }
        } else {
          toast({
            title: "Sign up failed",
            description: signUpError.message,
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      // User should now be logged in via useEffect trigger
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (checkingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Checking setup status...</div>
      </div>
    );
  }

  if (hasAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="liquid-glass p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Check className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Admin Already Exists</h1>
          <p className="text-muted-foreground mb-6">
            An admin account has already been set up. Please sign in with your admin credentials.
          </p>
          <Button variant="hero" onClick={() => navigate("/auth")} className="w-full">
            Go to Sign In
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="liquid-glass p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <a href="/" className="inline-block">
            <span className="text-3xl font-black tracking-tight text-primary">SOL</span>
          </a>
          <h1 className="text-2xl font-bold mt-4">Admin Setup</h1>
          <p className="text-muted-foreground mt-2">
            Create the first admin account for your store
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Admin Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="bg-secondary/50"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-secondary/50"
              minLength={6}
              required
            />
            <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
          </div>

          <Button
            type="submit"
            variant="hero"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Admin Account"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          This page is only available when no admin exists.
        </p>
      </div>
    </div>
  );
};

export default AdminSetup;
