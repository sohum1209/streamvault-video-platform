"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import {
    Play,
    PlayCircle,
    Star,
    Clock,
    Calendar,
    Globe,
    Heart,
    ChevronRight,
    Award,
    Film,
    LoaderIcon,
    ChevronLeft,
    ArrowBigRight
} from "lucide-react";
import { useParams, usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import Link from "next/link";
import { UserAuth } from "@/context/AuthContext";
import { useSaveMovie } from "@/components/hook/useSavedMovie"
import { useGetMovieDetailsQuery, useGetMovieVideosQuery, useGetSimilarMoviesQuery } from "@/services/movieApi";
import MovieCard from "@/components/MovieCard";
import { FaSearchPlus } from "react-icons/fa";

const TMDB_BASE = "https://image.tmdb.org/t/p";
const staggerContainer = {
    hidden: {},
    show: {
        transition: {
            staggerChildren: 0.08,
            delayChildren: 0.05,
        },
    },
};

const staggerItem = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } },
};


export default function MovieDetail() {
    const [loaded, setLoaded] = useState(false);
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [scoreVisible, setScoreVisible] = useState(false);
    const { movieid } = useParams();
    const [trailerOpen, setTrailerOpen] = useState(false);
    const { user } = UserAuth();
    const router = useRouter();
    const pathname = usePathname();
    const scrollRef = useRef();

    const { isSaved, toggleSaveMovie } = useSaveMovie(user);

    //Fetchng using rtk query
    const { data: movie, error: movieError, isLoading: movieLoading } = useGetMovieDetailsQuery(movieid)

    //fetching all the videos available
    const { data, error, isLoading } = useGetMovieVideosQuery(movieid)

    //fetching similar movies
    const { data: similarMovies, isLoading: similarMovieLoading } = useGetSimilarMoviesQuery({ movieId: movieid });

    //Select the trailer from youtube from api response
    const trailerUrl = useMemo(() => {
        if (!data?.results) return null;

        const ytVideos = data.results.filter(
            (video) => video.site === "YouTube"
        );

        const priority = [
            { type: "Trailer", official: true },
            { type: "Trailer" },
            { type: "Teaser" },
            { type: "Featurette" },
            { type: "Clip" },
        ];

        for (let rule of priority) {
            const found = ytVideos.find((video) => {
                if (rule.official !== undefined) {
                    return (
                        video.type === rule.type &&
                        video.official === rule.official
                    );
                }
                return video.type === rule.type;
            });

            if (found) {
                return `https://www.youtube.com/embed/${found.key}`;
            }
        }

        return ytVideos[0]
            ? `https://www.youtube.com/embed/${ytVideos[0].key}`
            : null;
    }, [data]);

    useEffect(() => {
        const t = setTimeout(() => setLoaded(true), 80);
        return () => clearTimeout(t);
    }, []);

    console.log(similarMovies)

    if (movieLoading || similarMovieLoading) return <div className="flex flex-col items-center justify-center h-screen gap-2">
        <LoaderIcon className="animate-spin w-18 h-18 text-blue-500" />
        <p className="text-gray-500 text-sm">Loading movie details...</p>
    </div>

    const year = new Date(movie.release_date).getFullYear();
    const hrs = Math.floor(movie.runtime / 60);
    const mins = movie.runtime % 60;
    const scorePercent = Math.round(movie.vote_average * 10);

    const metaRows = [
        {
            icon: <ChevronRight className="w-3.5 h-3.5 text-red-500" />,
            label: "Status",
            value: movie.status,
        },
        {
            icon: <Calendar className="w-3.5 h-3.5 text-gray-500" />,
            label: "Release",
            value: new Date(movie.release_date).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
            }),
        },
        {
            icon: <Clock className="w-3.5 h-3.5 text-gray-500" />,
            label: "Runtime",
            value: `${hrs}h ${mins}m`,
        },
        {
            icon: <Globe className="w-3.5 h-3.5 text-gray-500" />,
            label: "Language",
            value: movie.spoken_languages.map((l) => l.english_name).join(", "),
        },
        {
            icon: <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />,
            label: "Rating",
            value: `${movie.vote_average.toFixed(1)} / 10`,
        },
        {
            icon: <Film className="w-3.5 h-3.5 text-gray-500" />,
            label: "IMDB",
            value: movie.imdb_id,
        },
    ];



    const handlePlay = () => {
        if (!user) {
            router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
            return;
        }
        router.push(`/movie/watch/${movie.id}`);
    }

    return (
        <>
            <div
                className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden"
                style={{ fontFamily: "'Barlow', 'Helvetica Neue', sans-serif" }}
            >
                {/* ── Hero ── */}
                <div className="relative w-full" style={{ minHeight: "92vh" }}>
                    {movie?.backdrop_path ? (<motion.img
                        src={`${TMDB_BASE}/original${movie.backdrop_path}`}
                        alt=""
                        initial={{ opacity: 0, scale: 1.04 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        className="absolute inset-0 w-full h-full object-cover object-top brightness-[0.45]"
                    />) : (
                        <div className="w-full h-full absolute inset-0 bg-linear-to-bl from-gray-800 via-gray-600 to-gray-400"></div>
                    )}
                    {/* Backdrop */}


                    {/* Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/95 via-[#0a0a0a]/55 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/15 to-transparent" />

                    {/* Content */}
                    <div className="relative z-10 flex items-end h-full min-h-screen pb-16 px-8 md:px-16 max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-10 md:gap-14 items-start md:items-end w-full">

                            {/* Poster */}
                            <motion.div
                                initial={{ opacity: 0, y: 32, scale: 0.96 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                                className="hidden md:block flex-shrink-0"
                            >
                                <div className="relative w-48 lg:w-58 aspect-[2/3]">
                                    {movie?.poster_path ? (<Image
                                        src={`${TMDB_BASE}/w500${movie.poster_path}`}
                                        alt={movie.title}
                                        fill
                                        className="object-cover rounded-2xl shadow-[0_12px_60px_rgba(0,0,0,0.85),0_0_80px_rgba(229,9,20,0.1)]"
                                    />) : (
                                        <div className="w-full h-full flex justify-center items-center bg-white/5 rounded-2xl">
                                            <Film className="w-10 h-10 text-white/10" />
                                        </div>
                                    )}

                                </div>
                            </motion.div>

                            {/* Info stack */}
                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                animate="show"
                                className="flex flex-col gap-4 flex-1 pt-20 pb-2"
                            >
                                {/* Tagline */}
                                <motion.p
                                    variants={staggerItem}
                                    className="text-xs font-semibold uppercase tracking-[0.3em] text-red-500"
                                >
                                    {movie.tagline}
                                </motion.p>

                                {/* Title */}
                                <motion.h1
                                    variants={staggerItem}
                                    className="text-6xl md:text-7xl lg:text-7xl font-black uppercase leading-none tracking-tight"
                                    style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
                                >
                                    {movie.title}
                                </motion.h1>

                                {/* Meta row */}
                                <motion.div
                                    variants={staggerItem}
                                    className="flex flex-wrap items-center gap-3 text-sm"
                                >
                                    <span className="border border-gray-600 text-gray-400 text-xs px-2 py-0.5 rounded font-semibold tracking-wider">
                                        {year}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-gray-300">
                                        <Clock className="w-3.5 h-3.5 text-gray-500" />
                                        {hrs}h {mins}m
                                    </span>
                                    <span className="text-gray-600">·</span>
                                    <span className="flex items-center gap-1.5 text-yellow-400 font-semibold">
                                        <Star className="w-4 h-4 fill-yellow-400" />
                                        {movie.vote_average.toFixed(1)}
                                        <span className="text-gray-500 font-normal text-xs">
                                            / 10 ({movie.vote_count.toLocaleString()})
                                        </span>
                                    </span>
                                    <span className="text-gray-600">·</span>
                                    <span className="flex items-center gap-1.5 text-gray-400 text-xs uppercase tracking-widest">
                                        <Globe className="w-3.5 h-3.5" />
                                        {movie.spoken_languages.map((l) => l.english_name).join(", ")}
                                    </span>
                                </motion.div>

                                {/* Genres */}
                                <motion.div variants={staggerItem} className="flex flex-wrap gap-2">
                                    {movie.genres.map((g) => (
                                        <motion.span
                                            key={g.id}
                                            whileHover={{ scale: 1.06 }}
                                            whileTap={{ scale: 0.95 }}
                                            className="text-xs font-semibold px-3 py-1 rounded-full text-red-300 tracking-wide cursor-default border border-red-500/35 bg-red-500/10 hover:bg-red-500/20 hover:border-red-500/60 transition-colors duration-200"
                                        >
                                            {g.name}
                                        </motion.span>
                                    ))}
                                </motion.div>

                                {/* Overview */}
                                <motion.p
                                    variants={staggerItem}
                                    className="text-gray-300 text-base leading-relaxed max-w-xl font-light italic"
                                >
                                    {movie.overview}
                                </motion.p>

                                {/* Buttons */}
                                <motion.div
                                    variants={staggerItem}
                                    className="flex items-center gap-2 sm:gap-3 mt-1"
                                >
                                    {/* Play Now */}

                                    <motion.button
                                        whileHover={{
                                            scale: 1.04,
                                            boxShadow: "0 0 28px 4px rgba(229,9,20,0.4)",
                                        }}
                                        whileTap={{ scale: 0.97 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        onClick={handlePlay}
                                        className="flex items-center gap-1 sm:gap-2.5 px-3 sm:px-8 py-3.5 rounded-xl font-bold text-white text-sm tracking-wide bg-red-600 hover:bg-red-500 transition-colors duration-200"
                                    >
                                        <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                                        <span className="whitespace-nowrap">Play Now</span>
                                    </motion.button>


                                    {/* Watch Trailer */}
                                    <motion.button
                                        whileHover={{ scale: 1.04 }}
                                        onClick={() => setTrailerOpen(true)}
                                        whileTap={{ scale: 0.97 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                        className="flex items-center gap-1 sm:gap-2.5 px-2.5 sm:px-7 py-3.5 rounded-xl font-semibold text-white text-sm tracking-wide bg-white/10 border border-white/20 hover:bg-white/[0.18] hover:border-white/45 backdrop-blur-sm transition-colors duration-200"
                                    >
                                        <PlayCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                                        <span className="whitespace-nowrap">Watch Trailer</span>
                                    </motion.button>

                                    {/* Wishlist */}
                                    <motion.button
                                        onClick={() => toggleSaveMovie(movie)}
                                        whileHover={{ scale: 1.08 }}
                                        whileTap={{ scale: 0.93 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 18 }}
                                        className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-colors duration-200 ${isSaved(movie.id)
                                            ? "border-red-500/50 bg-red-500/[0.12]"
                                            : "border-white/15 bg-white/[0.06] hover:bg-white/[0.12]"
                                            }`}
                                    >
                                        <motion.div
                                            animate={{ scale: liked ? [1, 1.35, 1] : 1 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <Heart
                                                className="w-4 h-4 sm:w-5 sm:h-5"
                                                fill={isSaved(movie.id) ? "#e50914" : "none"}
                                                stroke={isSaved(movie.id) ? "#e50914" : "white"}
                                                strokeWidth={2}
                                            />
                                        </motion.div>
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {/* ── Details Section ── */}
                <div className="max-w-7xl mx-auto px-8 md:px-16 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                        {/* Left col */}
                        <motion.div
                            initial={{ opacity: 0, y: 24 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="md:col-span-2 flex flex-col gap-10"
                        >
                            {/* About */}
                            <div>
                                <h2 className="flex items-center gap-2 text-xs font-bold tracking-[0.22em] uppercase text-red-500 mb-4">
                                    <Film className="w-3.5 h-3.5" /> About the Film
                                </h2>
                                <p className="text-gray-300 leading-relaxed text-base">{movie.overview}</p>
                            </div>

                            {/* Production Companies */}
                            <div>
                                <h2 className="flex items-center gap-2 text-xs font-bold tracking-[0.22em] uppercase text-red-500 mb-4">
                                    <Award className="w-3.5 h-3.5" /> Production
                                </h2>
                                <div className="flex flex-wrap gap-2.5">
                                    {movie.production_companies.map((c, i) => (
                                        <motion.span
                                            key={c.id}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.55 + i * 0.07, duration: 0.4 }}
                                            whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                                            className="px-4 py-2 rounded-lg text-sm text-gray-300 font-medium flex items-center gap-2 bg-white/5 border border-white/[0.09] transition-colors duration-200"
                                        >
                                            {c.name}
                                            <span className="text-xs text-gray-600 font-normal">{c.origin_country}</span>
                                        </motion.span>
                                    ))}
                                </div>
                            </div>

                            {/* Countries */}
                            <div>
                                <h2 className="flex items-center gap-2 text-xs font-bold tracking-[0.22em] uppercase text-red-500 mb-4">
                                    <Globe className="w-3.5 h-3.5" /> Countries
                                </h2>
                                <div className="flex gap-2.5">
                                    {movie.production_countries.map((c, i) => (
                                        <motion.span
                                            key={c.iso_3166_1}
                                            initial={{ opacity: 0, y: 12 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 + i * 0.07, duration: 0.4 }}
                                            className="px-4 py-2 rounded-lg text-sm text-gray-300 bg-white/5 border border-white/[0.09]"
                                        >
                                            {c.name}
                                        </motion.span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Right: meta card */}
                        <motion.div
                            initial={{ opacity: 0, x: 24 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="rounded-2xl overflow-hidden self-start border border-white/[0.07] bg-white/[0.03]"
                        >
                            {metaRows.map(({ icon, label, value }, i) => (
                                <motion.div
                                    key={label}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.45 + i * 0.06 }}
                                    className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.06] last:border-0"
                                >
                                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-500">
                                        {icon}{label}
                                    </span>
                                    <span className="text-sm text-gray-200 font-medium">{value}</span>
                                </motion.div>
                            ))}

                            {/* Score bar */}
                            <div className="px-5 py-4 border-t border-white/[0.06]">
                                <div className="flex justify-between items-center mb-2.5">
                                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                                        Audience Score
                                    </span>
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.8 }}
                                        className="text-sm font-black text-red-400"
                                    >
                                        {scorePercent}%
                                    </motion.span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-white/[0.08] overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: scoreVisible ? `${scorePercent}%` : "0%" }}
                                        transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1], delay: 0.7 }}
                                        className="h-full rounded-full bg-gradient-to-r from-red-600 to-orange-400"
                                    />
                                </div>
                            </div>
                        </motion.div>

                    </div>
                </div>

                {/* -- Similar Movies -- */}
                <div className="max-w-7xl mx-auto px-8 md:px-16">
                    <h2 className="flex items-center gap-2 text-xs font-bold tracking-[0.22em] uppercase text-red-500 mb-4">
                        <Film className="w-3.5 h-3.5" /> Similar Movies
                    </h2>

                    <div className="relative py-4 md:py-8">
                        {/* Left Arrow */}
                        <button
                            onClick={() => scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" })}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 -translate-x-1/2"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        {/* Scrollable Row */}
                        <div
                            ref={scrollRef}
                            className="flex flex-row gap-4 overflow-x-auto px-4"
                            style={{ scrollbarWidth: "none" }}
                        >
                            {similarMovies.results.map((movie) => (
                                <div key={movie?.id} className="flex-shrink-0 w-60">
                                    <MovieCard movie={movie} />
                                </div>
                            ))}

                            <Link
                                href={`/movie/${movie?.id}/similar?q=${movie?.title}`}
                                className="group relative flex-shrink-0 w-60 h-full min-h-[136px] rounded-xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer"
                            >
                                {/* Animated circle */}
                                <div className="w-14 h-14 rounded-full border border-white/20 bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:border-red-500/50 group-hover:bg-red-500/10 transition-all duration-300">
                                    <FaSearchPlus />
                                </div>

                                {/* Text */}
                                <div className="text-center px-4">
                                    <p className="text-white/80 text-sm font-semibold tracking-wide group-hover:text-white transition-colors duration-300">
                                        See More
                                    </p>
                                </div>

                                {/* Bottom accent line */}
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                            </Link>
                        </div>

                        {/* Right Arrow */}
                        <button
                            onClick={() => scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" })}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full p-1.5 translate-x-1/2"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
            <Dialog open={trailerOpen} onOpenChange={setTrailerOpen}>
                <DialogContent className="max-w-6xl w-full bg-[#111] border border-white/10 p-0 overflow-hidden rounded-2xl">
                    <DialogTitle className="sr-only">{movie.title} — Trailer</DialogTitle>
                    {trailerUrl ? (<div className="aspect-video w-full">
                        <iframe
                            src={trailerUrl}
                            title={`${movie.title} Trailer`}
                            allow="autoplay; encrypted-media"
                            allowFullScreen
                            className="w-full h-full"
                        />
                    </div>) : (<div className="aspect-video w-full flex items-center justify-center text-gray-500 text-sm">
                        No trailer available
                    </div>)}

                </DialogContent>
            </Dialog>
        </>
    );
}
