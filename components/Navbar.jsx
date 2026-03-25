"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UserAuth } from "@/context/AuthContext";
import { LogOut, User, List, Home, Search, X, Menu } from "lucide-react";
import { useSaveMovie } from "./hook/useSavedMovie";

const NAV_LINKS = [
  { label: "Home", href: "/", icon: Home },
  { label: "My List", href: "/my-list", icon: List },
];

export default function Navbar() {
  const { user, logOutuser } = UserAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { displayName } = useSaveMovie(user);

  // Scroll background
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await logOutuser();
      setUserMenuOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const initials = user?.displayName
    ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.[0]?.toUpperCase() ?? "U";

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-md  border-white/6 shadow-xl"
            : "bg-gradient-to-b from-black/80 to-transparent"
        }`}
        style={{ fontFamily: "'Barlow', 'Helvetica Neue', sans-serif" }}
      >
        <div className="w-full mx-auto px-6 md:px-10 h-16 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <motion.h1
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="text-red-600 font-black text-2xl tracking-widest cursor-pointer select-none"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", letterSpacing: "0.12em" }}
            >
              STREAMVAULT
            </motion.h1>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 flex-1">
            {NAV_LINKS.map(({ label, href, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}>
                  <motion.span
                    whileHover={{ color: "#ffffff" }}
                    className={`flex relative items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
                      active
                        ? "text-white bg-white/10"
                        : "text-gray-400 hover:text-white hover:bg-white/6"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {label}
                    {active && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute bottom-0 left-0 right-0 h-px bg-red-500 rounded-full"
                      />
                    )}
                  </motion.span>
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">

            {/* Search icon */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.93 }}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/8 transition-colors duration-150"
            >
              <Search className="w-4 h-4" />
            </motion.button>

            {user?.email ? (
              /* User menu */
              <div className="relative">
                <motion.button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-xl bg-red-700 hover:bg-red-600 flex items-center justify-center text-white text-xs font-black transition-colors duration-150 border border-red-500/40"
                >
                  {initials}
                </motion.button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <>
                      {/* Backdrop */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />

                      {/* Dropdown */}
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
                        className="absolute right-0 top-12 z-20 w-52 rounded-2xl border border-white/10 bg-[#161616]/95 backdrop-blur-xl shadow-2xl overflow-hidden"
                      >
                        {/* User info */}
                        <div className="px-4 py-3.5 border-b border-white/8">
                          <p className="text-white text-sm font-semibold truncate">
                            {displayName || "User"}
                          </p>
                          <p className="text-gray-500 text-xs truncate mt-0.5">
                            {user.email}
                          </p>
                        </div>

                        {/* Menu items */}
                        <div className="p-1.5">
                          <Link href="/account">
                            <motion.div
                              whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-150"
                            >
                              <User className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-300">Account</span>
                            </motion.div>
                          </Link>

                          <Link href="/my-list">
                            <motion.div
                              whileHover={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                              className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg cursor-pointer transition-colors duration-150"
                            >
                              <List className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-300">My List</span>
                            </motion.div>
                          </Link>
                        </div>

                        {/* Logout */}
                        <div className="p-1.5 border-t border-white/8">
                          <motion.button
                            onClick={handleLogout}
                            whileHover={{ backgroundColor: "rgba(229,9,20,0.12)" }}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg transition-colors duration-150 group"
                          >
                            <LogOut className="w-4 h-4 text-gray-500 group-hover:text-red-400 transition-colors" />
                            <span className="text-sm text-gray-400 group-hover:text-red-400 transition-colors">
                              Log Out
                            </span>
                          </motion.button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Auth buttons */
              <div className="hidden md:flex items-center gap-2">
                <Link href="/login">
                  <motion.span
                    whileHover={{ color: "#ffffff" }}
                    className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors duration-150 cursor-pointer"
                  >
                    Sign In
                  </motion.span>
                </Link>
                <Link href="/signup">
                  <motion.span
                    whileHover={{ scale: 1.04, backgroundColor: "#dc2626" }}
                    whileTap={{ scale: 0.97 }}
                    className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold cursor-pointer transition-colors duration-150 block"
                  >
                    Sign Up
                  </motion.span>
                </Link>
              </div>
            )}

            {/* Mobile hamburger */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/8 transition-colors duration-150"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#0f0f0f]/97 backdrop-blur-xl border-b border-white/8 shadow-2xl"
            style={{ fontFamily: "'Barlow', 'Helvetica Neue', sans-serif" }}
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, href, icon: Icon }) => {
                const active = pathname === href;
                return (
                  <Link key={href} href={href}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors duration-150 ${
                        active
                          ? "text-white bg-white/8"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {label}
                    </motion.div>
                  </Link>
                );
              })}

              {!user?.email && (
                <div className="flex gap-2 mt-2 pt-3 border-t border-white/8">
                  <Link href="/login" className="flex-1">
                    <span className="block text-center px-4 py-2.5 rounded-xl border border-white/15 text-gray-300 text-sm font-medium hover:bg-white/6 transition-colors duration-150">
                      Sign In
                    </span>
                  </Link>
                  <Link href="/signup" className="flex-1">
                    <span className="block text-center px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors duration-150">
                      Sign Up
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}