import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, LogIn } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { AuthError } from "@supabase/supabase-js";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleError = (error: AuthError) => {
    let message = "An error occurred during login";
    
    if (error.message.includes("refresh_token_not_found")) {
      message = "Your session has expired. Please log in again.";
    } else if (error.status === 400) {
      message = "Invalid login credentials";
    } else if (error.status === 422) {
      message = "Invalid email format";
    } else {
      message = error.message;
    }
    
    toast({
      title: "Error",
      description: message,
      variant: "destructive",
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.session) {
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      handleError(error);
    }
  };

  return (
    <div className="lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl tracking-tight">
            Login to your account
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and password below to login
          </p>
        </div>

        <div className="grid gap-4">
          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <Mail className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              required
            />
          </div>
          <Button className="w-full" type="submit" disabled={loading}>
            {loading ? "Logging in..." : (
              <>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </>
            )}
          </Button>
        </form>

        <div className="text-center text-sm">
          <Link
            to="/reset-password"
            className="text-blue-500 hover:text-blue-700"
          >
            Forgot password?
          </Link>
        </div>
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:text-blue-700">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};