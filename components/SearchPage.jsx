"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
    Search,
    X,
    Film,
    Star,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useLazySearchMoviesQuery } from "@/services/movieApi";

const TMDB_BASE = "https://image.tmdb.org/t/p";

// ─────────────────────────────────────────────────────────────────────────────
// HELPER — generates a smart page range with ellipsis
// e.g. for page 5 of 10: [1, "...", 4, 5, 6, "...", 10]
// ─────────────────────────────────────────────────────────────────────────────
function getPageNumbers(current, total) {
    if (total <= 7) {
        // show all pages if total is small
        return Array.from({ length: total }, (_, i) => i + 1);
    }
    if (current <= 4) {
        return [1, 2, 3, 4, 5, "...", total];
    }
    if (current >= total - 3) {
        return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    }
    return [1, "...", current - 1, current, current + 1, "...", total];
}

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS
// ─────────────────────────────────────────────────────────────────────────────
const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    show: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
};

// ─────────────────────────────────────────────────────────────────────────────
// MOVIE CARD — individual result card with backdrop, rating, hover overlay
// ─────────────────────────────────────────────────────────────────────────────
function MovieCard({ movie }) {
    const title = movie.title || movie.name;

    // handle both movies (release_date) and TV shows (first_air_date)
    const year = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : movie.first_air_date
            ? new Date(movie.first_air_date).getFullYear()
            : null;

    return (
        <motion.div variants={cardVariants}>
            <Link href={`/movie/${movie.id}`} className="group block">

                {/* ── Thumbnail ── */}
                <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/8 group-hover:border-white/20 transition-colors duration-200">
                    {movie.backdrop_path ? (
                        <Image
                            src={`${TMDB_BASE}/w500${movie.backdrop_path}`}
                            alt={title}
                            fill
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                    ) : (
                        // fallback when no backdrop available
                        <div className="w-full h-full flex items-center justify-center">
                            <Film className="w-8 h-8 text-white/10" />
                        </div>
                    )}

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Rating badge — only show if rating exists */}
                    {movie.vote_average > 0 && (
                        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-black/70 backdrop-blur-sm border border-white/10 rounded-lg px-2 py-1">
                            <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-white text-[10px] font-semibold tabular-nums">
                                {movie.vote_average.toFixed(1)}
                            </span>
                        </div>
                    )}

                    {/* Play icon on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center">
                            <svg className="w-4 h-4 fill-white ml-0.5" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* ── Card info ── */}
                <div className="mt-2.5 px-0.5">
                    <p className="text-white text-sm font-semibold line-clamp-1 group-hover:text-red-400 transition-colors duration-200">
                        {title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                        {year && (
                            <span className="text-gray-500 text-xs">{year}</span>
                        )}
                        {movie.media_type && (
                            <>
                                <span className="text-gray-700 text-xs">·</span>
                                <span className="text-gray-500 text-xs capitalize">
                                    {movie.media_type}
                                </span>
                            </>
                        )}
                    </div>
                </div>
            </Link>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING SKELETON — mimics the card grid while data is fetching
// ─────────────────────────────────────────────────────────────────────────────
function LoadingSkeleton() {
    return (
        <>
            <style>{`
                @keyframes shimmer {
                    0% { background-position: -800px 0 }
                    100% { background-position: 800px 0 }
                }
            `}</style>
            <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5"
            >
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-2.5">
                        <div
                            className="w-full aspect-video rounded-xl"
                            style={{
                                background: "linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.08) 200px, rgba(255,255,255,0.04) 400px)",
                                backgroundSize: "800px 100%",
                                animation: "shimmer 1.6s infinite linear",
                                animationDelay: `${i * 0.07}s`,
                            }}
                        />
                        <div className="h-3 w-3/4 rounded-md" style={{ background: "rgba(255,255,255,0.05)" }} />
                        <div className="h-2.5 w-1/3 rounded-md" style={{ background: "rgba(255,255,255,0.03)" }} />
                    </div>
                ))}
            </motion.div>
        </>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGINATION — prev / page numbers with ellipsis / next
// ─────────────────────────────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = getPageNumbers(currentPage, totalPages);

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 mt-12"
        >
            {/* Previous button */}
            <motion.button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
            >
                <ChevronLeft className="w-4 h-4" />
            </motion.button>

            {/* Page number buttons */}
            {pages.map((page, i) =>
                page === "..." ? (
                    // ellipsis separator
                    <span
                        key={`ellipsis-${i}`}
                        className="w-9 h-9 flex items-center justify-center text-gray-600 text-sm"
                    >
                        ...
                    </span>
                ) : (
                    <motion.button
                        key={page}
                        onClick={() => onPageChange(page)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors duration-150 ${
                            currentPage === page
                                ? "bg-red-600 text-white border border-red-500/50"
                                : "border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                        }`}
                    >
                        {page}
                    </motion.button>
                )
            )}

            {/* Next button */}
            <motion.button
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                whileHover={{ scale: currentPage === totalPages ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
            >
                <ChevronRight className="w-4 h-4" />
            </motion.button>
        </motion.div>
    );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function SearchPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    // Source of truth — read directly from URL params
    const initialQuery = searchParams.get("q") || "";

    // Local input state — tracks what user is typing before submitting
    const [inputValue, setInputValue] = useState(initialQuery);

    // Current page — resets to 1 on every new search query
    const [currentPage, setCurrentPage] = useState(1);

    const inputRef = useRef(null);

    // RTK Query lazy hook — only fires when triggerSearch() is called explicitly
    const [triggerSearch, { data, isLoading, isError }] =
        useLazySearchMoviesQuery();

    // ── Derived values from API response ──────────────────────────────────────
    const results = data?.results ?? [];
    const totalPages = data?.total_pages ?? 1;
    const totalResults = data?.total_results ?? 0;

    // True once a search query exists in the URL — used to decide which empty state to show
    const hasSearched = !!initialQuery.trim();

    // ── Fire search whenever URL query or page changes ────────────────────────
    useEffect(() => {
        if (!initialQuery.trim()) return;
        triggerSearch({ query: initialQuery, page: currentPage });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialQuery, currentPage]);

    // ── Sync input field with URL (handles browser back/forward) ─────────────
    useEffect(() => {
        setInputValue(initialQuery);
    }, [initialQuery]);

    // ── Scroll to top whenever page changes ───────────────────────────────────
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    // ── Submit — push new query to URL and reset page ─────────────────────────
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;
        setCurrentPage(1); // always start from page 1 on a new search
        router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    };

    // ── Clear — reset input, results and URL ──────────────────────────────────
    const handleClear = () => {
        setInputValue("");
        setCurrentPage(1);
        router.push("/search");
        inputRef.current?.focus();
    };

    // ── Page change from pagination component ─────────────────────────────────
    const handlePageChange = (page) => {
        if (page === currentPage) return;
        setCurrentPage(page);
    };

    return (
        <div
            className="min-h-screen bg-[#0a0a0a] text-white pt-24 px-6 md:px-14 lg:px-20 pb-20"
            style={{ fontFamily: "'Barlow', 'Helvetica Neue', sans-serif" }}
        >
            {/* ── Page header ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
            >
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-500 mb-2">
                    Discover
                </p>
                <h1
                    className="text-5xl md:text-6xl font-black uppercase leading-none tracking-tight"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                    Search
                </h1>
            </motion.div>

            {/* ── Search bar ── */}
            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
                className="flex items-center gap-3 mb-12 max-w-2xl"
            >
                <div className="flex-1 flex items-center gap-3 bg-white/6 border border-white/12 hover:border-white/22 focus-within:border-red-500/50 focus-within:bg-white/8 rounded-2xl px-4 py-3.5 transition-all duration-200">
                    <Search className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Search for a movie or TV show..."
                        autoFocus
                        className="flex-1 bg-transparent text-white text-sm placeholder-gray-600 outline-none"
                        style={{ fontFamily: "'Barlow', sans-serif" }}
                    />
                    {/* Clear input button */}
                    {inputValue && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="text-gray-600 hover:text-white transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="px-6 py-3.5 bg-red-600 hover:bg-red-500 text-white text-sm font-bold rounded-2xl tracking-wide transition-colors duration-150 flex-shrink-0"
                >
                    Search
                </motion.button>
            </motion.form>

            {/* ── Results area ── */}
            {/*
                State priority:
                1. isLoading  → skeleton
                2. isError    → error message + retry
                3. results    → grid + pagination
                4. hasSearched + no results → no results message
                5. !hasSearched → idle prompt
            */}
            <AnimatePresence mode="wait">

                {/* 1. Loading skeleton */}
                {isLoading && <LoadingSkeleton />}

                {/* 2. Error state */}
                {!isLoading && isError && (
                    <motion.div
                        key="error"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-28 gap-4 text-center"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-2">
                            <AlertCircle className="w-7 h-7 text-red-500/60" />
                        </div>
                        <p className="text-gray-400 text-base font-medium">
                            Something went wrong
                        </p>
                        <p className="text-gray-600 text-sm">
                            Please try again in a moment
                        </p>
                        {/* Retry button re-triggers the same search */}
                        <motion.button
                            onClick={() => triggerSearch({ query: initialQuery, page: currentPage })}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="mt-2 px-5 py-2.5 rounded-xl bg-white/8 border border-white/12 text-white text-sm font-medium hover:bg-white/12 transition-colors duration-150"
                        >
                            Try again
                        </motion.button>
                    </motion.div>
                )}

                {/* 3. Results grid */}
                {!isLoading && !isError && results.length > 0 && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Results count */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-gray-500 text-xs uppercase tracking-widest mb-5"
                        >
                            {totalResults.toLocaleString()} results for{" "}
                            <span className="text-gray-300 font-semibold">
                                &quot;{initialQuery}&quot;
                            </span>
                            {totalPages > 1 && (
                                <span className="ml-2 text-gray-600">
                                    — page {currentPage} of {totalPages}
                                </span>
                            )}
                        </motion.p>

                        {/* Movie grid */}
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5"
                        >
                            {results.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </motion.div>

                        {/* Pagination — only shown if more than 1 page */}
                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </motion.div>
                )}

                {/* 4. No results */}
                {!isLoading && !isError && hasSearched && results.length === 0 && (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-28 gap-4 text-center"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mb-2">
                            <Film className="w-7 h-7 text-white/15" />
                        </div>
                        <p className="text-gray-400 text-base font-medium">
                            No results for &quot;{initialQuery}&quot;
                        </p>
                        <p className="text-gray-600 text-sm max-w-xs">
                            Try a different title, actor, or keyword
                        </p>
                    </motion.div>
                )}

                {/* 5. Idle — no search query in URL yet */}
                {!isLoading && !isError && !hasSearched && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-28 gap-3 text-center"
                    >
                        <Search className="w-10 h-10 text-white/8 mb-2" />
                        <p className="text-gray-600 text-sm">
                            Type something to search
                        </p>
                    </motion.div>
                )}

            </AnimatePresence>
        </div>
    );
}