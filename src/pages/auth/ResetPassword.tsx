import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const ResetPassword = () => {
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate("/login")}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="bg-card rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-medium mb-6 text-center">Reset Password</h2>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: 'hsl(var(--primary))',
                    brandAccent: 'hsl(var(--primary))',
                    brandButtonText: 'hsl(var(--primary-foreground))',
                  },
                  borderWidths: {
                    buttonBorderWidth: '1px',
                  },
                  radii: {
                    borderRadiusButton: 'var(--radius)',
                    buttonBorderRadius: 'var(--radius)',
                    inputBorderRadius: 'var(--radius)',
                  },
                },
              },
              className: {
                button: 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2',
                container: 'space-y-4',
                label: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
                input: 'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                message: 'text-sm text-muted-foreground',
                divider: 'my-4',
                anchor: 'text-sm font-medium text-primary hover:underline',
                loader: 'h-5 w-5 animate-spin border-2 border-current border-t-transparent text-primary rounded-full',
              },
            }}
            providers={[]}
            redirectTo={window.location.origin}
            view="forgotten_password"
          />
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link to="/login" className="hover:underline font-medium text-primary">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
