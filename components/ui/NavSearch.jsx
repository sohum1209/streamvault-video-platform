"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X } from "lucide-react";

export default function NavSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const hideTimer = useRef(null);
  const router = useRouter();

  // Auto-focus when opened
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Auto-hide after 4s of no typing
  const resetHideTimer = () => {
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!query.trim()) setOpen(false);
    }, 4000);
  };

  const handleOpen = () => {
    setOpen(true);
    resetHideTimer();
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    resetHideTimer(); // reset timer on every keystroke
  };

  const handleClose = () => {
    clearTimeout(hideTimer.current);
    setOpen(false);
    setQuery("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    clearTimeout(hideTimer.current);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    handleClose();
  };

  // Close on Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex items-center">
      <form onSubmit={handleSubmit} className="flex items-center">
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              className="overflow-hidden"
            >
              <div className="flex items-center gap-2 bg-white/8 border border-white/15 rounded-xl px-3 py-2 mr-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={handleChange}
                  placeholder="Search movies..."
                  className="bg-transparent text-white text-sm placeholder-gray-500 outline-none w-full"
                  style={{ fontFamily: "'Barlow', sans-serif" }}
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="text-gray-500 hover:text-white transition-colors flex-shrink-0"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Search icon button */}
        <motion.button
          type={open && query ? "submit" : "button"}
          onClick={!open ? handleOpen : undefined}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-150 ${
            open
              ? "text-white bg-red-600 hover:bg-red-500"
              : "text-gray-400 hover:text-white hover:bg-white/8"
          }`}
        >
          <Search className="w-4 h-4" />
        </motion.button>
      </form>
    </div>
  );
}