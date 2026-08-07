"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

function LoginForm({ callbackUrl }) {
  const { LoginUser } = UserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handlelogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await LoginUser(email, password);
      toast({
        title: "Login successful",
        description: "Redirecting you to the requested page.",
        variant: "success",
      });
      router.push(callbackUrl);
    } catch (error) {
      const message = error?.message || "Login failed. Please check your credentials.";
      console.log("Error Encountered: ", error);
      setError(message);
      toast({
        title: "Login failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-black">
      <Image src="/bannerimage.jpg" fill alt="banner-img" className="object-cover" />
      <div className="absolute inset-0 bg-black/75" />

      <div className="relative z-20 flex min-h-screen items-center justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[#090909]/95 p-8 shadow-[0_30px_120px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:p-10 lg:px-12 lg:py-12"
        >
          <div className="mb-8 space-y-3">
            <div>
              <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-red-500">Welcome back</p>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Sign in to your account
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-400">
              Enter your email and password to continue to your saved shows.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handlelogin}>
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-sm text-gray-300">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="login-password" className="text-sm text-gray-300">
                Password
              </label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-500/70 sm:text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
            <p>New here? <Link href="/signup" className="text-white underline hover:text-red-400">Create account</Link></p>
            <Link href="/login" className="text-white underline hover:text-red-400">Need help?</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginForm;
