import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Film, Star } from "lucide-react";

const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.97 },
    show: {
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] },
    },
};

const TMDB_BASE = "https://image.tmdb.org/t/p";


export default function MovieCard({ movie }) {
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