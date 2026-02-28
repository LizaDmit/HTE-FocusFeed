"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Account created but sign-in failed. Please sign in manually.");
        setLoading(false);
        return;
      }

      router.push("/feed");
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-moonDust-lavender via-moonDust-purple to-moonDust-blue bg-clip-text text-transparent">
            FocusFeed
          </h1>
          <p className="text-gray-400 text-sm mt-2">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Username"
            placeholder="Choose a username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <Input
            label="Password"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            error={confirm && password !== confirm ? "Passwords do not match" : undefined}
          />

          {error && <p className="text-sm text-red-400 text-center">{error}</p>}

          <Button
            type="submit"
            disabled={loading || !username || !password || !confirm}
            className="w-full"
            size="lg"
          >
            {loading ? "Creating account..." : "Create Account"}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link href="/login" className="text-moonDust-blue hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
