"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Gavel } from "lucide-react";
import Button from "@/components/ui/Button";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: isSignUp ? "signup" : "login",
          email,
          password,
          displayName,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed");
        setLoading(false);
        return;
      }

      if (isSignUp) {
        // Also sign in after signup
        const supabase = createClient();
        await supabase.auth.signInWithPassword({ email, password });
      }

      router.push("/browse");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Gavel className="text-[#D4A843]" size={32} />
            <span className="text-3xl font-serif font-bold text-[#D4A843]">
              BidIQ
            </span>
          </div>
          <p className="text-[#8888A0]">
            {isSignUp
              ? "Create your account and start predicting"
              : "Sign in to your account"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-[#141420] border border-[#2A2A40] rounded-2xl p-6 space-y-5"
        >
          {isSignUp && (
            <div>
              <label className="text-sm text-[#8888A0] block mb-1.5">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your appraiser alias"
                className="w-full bg-[#0A0A0F] border border-[#2A2A40] rounded-lg px-4 py-3 text-[#F1F1F5] placeholder:text-[#555570] focus:outline-none focus:border-[#D4A843] transition-colors"
                required
              />
            </div>
          )}

          <div>
            <label className="text-sm text-[#8888A0] block mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full bg-[#0A0A0F] border border-[#2A2A40] rounded-lg px-4 py-3 text-[#F1F1F5] placeholder:text-[#555570] focus:outline-none focus:border-[#D4A843] transition-colors"
              required
            />
          </div>

          <div>
            <label className="text-sm text-[#8888A0] block mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0A0A0F] border border-[#2A2A40] rounded-lg px-4 py-3 text-[#F1F1F5] placeholder:text-[#555570] focus:outline-none focus:border-[#D4A843] transition-colors"
              required
              minLength={6}
            />
          </div>

          {error && (
            <p className="text-sm text-[#F87171] bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading
              ? "Loading..."
              : isSignUp
              ? "Create Account"
              : "Sign In"}
          </Button>

          <p className="text-center text-sm text-[#8888A0]">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-[#D4A843] hover:text-[#F0D78C] transition-colors"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
