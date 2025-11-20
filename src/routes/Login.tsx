import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "@/integrations/supabase/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await authService.signInWithEmail(email, password);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Sign in failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-brand-blue">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-brand-white">Sign In</h1>
          <p className="text-brand-white/60 mt-2">Welcome back</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 text-red-400 p-3 rounded border border-red-500/20 text-sm">
              {error}
            </div>
          )}

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
            disabled={loading}
            className="bg-brand-white/10 border-brand-white/20 text-brand-white placeholder:text-brand-white/40"
          />

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>

          <p className="text-center text-sm text-brand-white/60">
            Don't have an account?{" "}
            <Link to="/auth/register" className="text-brand-white underline hover:no-underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
