import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "@/integrations/supabase/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await authService.signUpWithEmail(
      email,
      password,
      fullName
    );

    if (result.success) {
      // Show success toast
      toast({
        title: "Account created!",
        description: "Welcome to Childlike. Please verify your email when you get a chance.",
      });

      // Auto-login - try to sign in immediately
      const loginResult = await authService.signInWithEmail(email, password);

      if (loginResult.success) {
        // Redirect to homepage
        navigate("/");
      } else {
        // If auto-login fails, redirect to login page
        navigate("/auth/login");
      }
    } else {
      setError(result.error || "Registration failed");
    }

    setLoading(false);
  };

  // Registration form
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-brand-blue">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-white">Create Account</h1>
          <p className="text-brand-white/60 mt-2">Join us today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 text-red-400 p-3 rounded border border-red-500/20 text-sm">
              {error}
            </div>
          )}

          <Input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            disabled={loading}
            className="bg-brand-white/10 border-brand-white/20 text-brand-white placeholder:text-brand-white/40"
          />

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="bg-brand-white/10 border-brand-white/20 text-brand-white placeholder:text-brand-white/40"
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
            className="bg-brand-white/10 border-brand-white/20 text-brand-white placeholder:text-brand-white/40"
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </Button>

          <p className="text-center text-sm text-brand-white/60">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-brand-white underline hover:no-underline">
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
