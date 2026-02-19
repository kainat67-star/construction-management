import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    if (isAuthenticated === "true") {
      navigate("/accounts", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simulate login process (UI only - no backend)
    setTimeout(() => {
      // Store login state in localStorage
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userEmail", email);
      
      setIsLoading(false);
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Redirect to accounts page
      navigate("/accounts");
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-3 sm:p-4 md:p-6">
      <Card className="w-full max-w-md border border-gray-300 bg-white shadow-sm">
        <CardHeader className="space-y-4 sm:space-y-6 text-center pb-6 sm:pb-8 px-4 sm:px-6 pt-6 sm:pt-8">
          <div className="flex justify-center">
            <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-lg border border-gray-300 bg-gray-50">
              <Building2 className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">Ibrahim Real Estate and Construction Services</CardTitle>
            <CardDescription className="text-sm sm:text-base text-gray-600">
              Sign in to access your accounts and properties
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6 pb-6 sm:pb-8">
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm sm:text-base font-semibold text-gray-900">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 sm:pl-12 h-12 sm:h-14 text-sm sm:text-base border border-gray-300"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base font-semibold text-gray-900">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 sm:pl-12 h-12 sm:h-14 text-sm sm:text-base border border-gray-300"
                  required
                />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full h-12 sm:h-14 text-sm sm:text-base font-semibold bg-primary hover:bg-primary/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
          <div className="pt-4 border-t border-gray-300">
            <p className="text-xs sm:text-sm text-center text-gray-600 font-medium">
              Demo: Use any email and password to continue
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
