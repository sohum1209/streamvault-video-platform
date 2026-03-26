"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Film, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { useLazyGetSimilarMoviesQuery } from "@/services/movieApi";
import MovieCard from "@/components/MovieCard";

function getPageNumbers(current, total) {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
    if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
    return [1, "...", current - 1, current, current + 1, "...", total];
}

const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
};

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

function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = getPageNumbers(currentPage, totalPages);
    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center justify-center gap-2 mt-12"
        >
            <motion.button
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                whileHover={{ scale: currentPage === 1 ? 1 : 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors duration-150"
            >
                <ChevronLeft className="w-4 h-4" />
            </motion.button>

            {pages.map((page, i) =>
                page === "..." ? (
                    <span key={`ellipsis-${i}`} className="w-9 h-9 flex items-center justify-center text-gray-600 text-sm">
                        ...
                    </span>
                ) : (
                    <motion.button
                        key={page}
                        onClick={() => onPageChange(page)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors duration-150 ${currentPage === page
                                ? "bg-red-600 text-white border border-red-500/50"
                                : "border border-white/10 bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                            }`}
                    >
                        {page}
                    </motion.button>
                )
            )}

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

export default function SimilarMovies() {
    const { movieid } = useParams();
    const searchParams = useSearchParams();
    const title = searchParams.get('q' || ' ');
    
    // FIX 1: Removed unused `router` import and variable
    const [currentPage, setCurrentPage] = useState(1);

    const [triggerSearch, { data, error, isLoading }] = useLazyGetSimilarMoviesQuery();

    const results = data?.results ?? [];
    const totalPages = data?.total_pages ?? 1;
    const totalResults = data?.total_results ?? 0;

    

    useEffect(() => {
        if (!movieid) return; // ← guard against undefined
        triggerSearch({ movieId: movieid, page: currentPage });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movieid, currentPage]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    const handlePageChange = (page) => {
        if (page === currentPage) return;
        setCurrentPage(page);
    };

    return (
        <div
            className="min-h-screen bg-[#0a0a0a] text-white pt-24 px-6 md:px-14 lg:px-20 pb-20"
            style={{ fontFamily: "'Barlow', 'Helvetica Neue', sans-serif" }}
        >
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-10"
            >
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-500 mb-2">
                    Similar to
                </p>
                <h1
                    className="text-5xl md:text-6xl font-black uppercase leading-none tracking-tight"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                    {title}
                </h1>
            </motion.div>

            <AnimatePresence mode="wait">
                {isLoading && <LoadingSkeleton />}

                {!isLoading && error && (
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
                        <p className="text-gray-400 text-base font-medium">Something went wrong</p>
                        <p className="text-gray-600 text-sm">Please try again in a moment</p>
                        {/* FIX 2: retry now calls the correct args — no more phantom `initialQuery` */}
                        <motion.button
                            onClick={() => triggerSearch({ movieid, page: currentPage })}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.97 }}
                            className="mt-2 px-5 py-2.5 rounded-xl bg-white/[0.08] border border-white/[0.12] text-white text-sm font-medium hover:bg-white/[0.12] transition-colors duration-150"
                        >
                            Try again
                        </motion.button>
                    </motion.div>
                )}

                {!isLoading && !error && results.length > 0 && (
                    <motion.div
                        key="results"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* FIX 3: removed `initialQuery` reference from results count text */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-gray-500 text-xs uppercase tracking-widest mb-5"
                        >
                            {totalResults.toLocaleString()} similar movies found
                            {totalPages > 1 && (
                                <span className="ml-2 text-gray-600">
                                    — page {currentPage} of {totalPages}
                                </span>
                            )}
                        </motion.p>

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

                        {totalPages > 1 && (
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </motion.div>
                )}

                {!isLoading && !error && results.length === 0 && (
                    <motion.div
                        key="empty"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center py-28 gap-4 text-center"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/[0.08] flex items-center justify-center mb-2">
                            <Film className="w-7 h-7 text-white/[0.15]" />
                        </div>
                        <p className="text-gray-400 text-base font-medium">No results</p>
                        <p className="text-gray-600 text-sm max-w-xs">
                            No similar movies found for this title
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}