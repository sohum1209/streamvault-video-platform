'use client'

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast";

function SignUp() {
  const { SignUpUser } = UserAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const validateForm = () => {
    const errors = {};
    const nameRegex = /^[A-Za-z\s]{2,50}$/;
    const phoneRegex = /^(\+91[\-\s]?)?[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!name.trim()) {
      errors.name = "Name is required";
    } else if (!nameRegex.test(name)) {
      errors.name = "Invalid name";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      errors.email = "Invalid email";
    }

    if (!phone.trim()) {
      errors.phone = "Phone is required";
    } else if (!phoneRegex.test(phone)) {
      errors.phone = "Invalid phone number";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (!passwordRegex.test(password)) {
      errors.password = "Password must contain upper and lower case letters, a number, and a special character.";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please retype your password";
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    return errors;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length !== 0) {
      return;
    }

    setLoading(true);

    try {
      await SignUpUser(email, password, name, phone);
      toast({
        title: "Account created",
        description: "Verification email sent. Please confirm your email before logging in.",
        variant: "success",
      });
      router.push('/login');
    } catch (error) {
      console.log("Error Encountered: ", error);
      toast({
        title: "Sign-up failed",
        description: error?.message || "Unable to create account.",
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
              <p className="text-xs sm:text-sm uppercase tracking-[0.28em] text-red-500">Create account</p>
              <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                Sign up for StreamVault
              </h1>
            </div>
            <p className="text-sm sm:text-base text-gray-400">
              Enter your details below to create an account and start saving movies.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSignUp}>
            <div className="space-y-2">
              <label htmlFor="signup-name" className="text-sm text-gray-300">Full name</label>
              <input
                id="signup-name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
              {errors.name && <p className="text-sm text-red-400">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-phone" className="text-sm text-gray-300">Phone</label>
              <input
                id="signup-phone"
                type="text"
                placeholder="+919876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
              {errors.phone && <p className="text-sm text-red-400">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-email" className="text-sm text-gray-300">Email</label>
              <input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
              {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-password" className="text-sm text-gray-300">Password</label>
              <input
                id="signup-password"
                type="password"
                placeholder="Create a strong password"
                value={password}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
              {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-confirm-password" className="text-sm text-gray-300">Confirm Password</label>
              <input
                id="signup-confirm-password"
                type="password"
                placeholder="Retype your password"
                value={confirmPassword}
                autoComplete="new-password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
              />
              {errors.confirmPassword && <p className="text-sm text-red-400">{errors.confirmPassword}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-500/70 sm:text-base"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/25 border-t-white" />
                  Creating account...
                </div>
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-gray-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              Already have an account? <Link href="/login" className="text-white underline hover:text-red-400">Sign in</Link>
            </p>
            <p className="max-w-sm">You’ll receive a verification email so you can log in securely.</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default SignUp;
