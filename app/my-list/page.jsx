"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Film } from "lucide-react";
import { UserAuth } from "@/context/AuthContext";
import { db } from "@/firebase";
import { updateDoc, doc, onSnapshot } from "firebase/firestore"
import { useEffect, useState } from "react";

const TMDB_BASE = "https://image.tmdb.org/t/p";

// ─── Replace this with your Firestore data ───────────────────────────────────
const PLACEHOLDER_MOVIES = [
  { id: 1, title: "Movie Title One", backdrop_path: null },
  { id: 2, title: "Movie Title Two", backdrop_path: null },
  { id: 3, title: "Movie Title Three", backdrop_path: null },
  { id: 4, title: "Movie Title Four", backdrop_path: null },
  { id: 5, title: "Movie Title Five", backdrop_path: null },
  { id: 6, title: "Movie Title Six", backdrop_path: null },
];
// ─────────────────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

function MovieCard({ movie, onRemove }) {
  return (
    <motion.div variants={cardVariants} className="group relative">
      <Link href={`/movie/${movie.id}`} className="block">

        {/* Backdrop image */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-white/5">
          {movie.backdrop_path ? (
            <Image
              src={`${TMDB_BASE}/w780${movie.backdrop_path}`}
              alt={movie.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Film className="w-8 h-8 text-white/10" />
            </div>
          )}

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play hint */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center">
              <svg className="w-5 h-5 fill-white ml-0.5" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>

          {/* Remove button */}
          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onRemove(movie.id);
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute top-2.5 right-2.5 w-8 h-8 rounded-lg bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-500/80 hover:border-red-500/50"
          >
            <Trash2 className="w-3.5 h-3.5 text-white" />
          </motion.button>
        </div>

        {/* Title */}
        <p className="mt-2.5 text-sm font-semibold text-gray-200 group-hover:text-white transition-colors duration-200 line-clamp-1 tracking-wide">
          {movie.title || movie.name}
        </p>
      </Link>
    </motion.div>
  );
}

export default function MyListPage() {
  // ── Swap PLACEHOLDER_MOVIES with your Firestore data here ──
  // const movies = PLACEHOLDER_MOVIES;

  const [movies, setMovies] = useState(null);
  const { user } = UserAuth()

  const handleRemove = async(id) => {
    // wire up your Firestore remove logic here
    const moviesRef = doc(db, 'users', `${user?.email}`);
    try {
      const result = movies.filter((mov) => mov.id !== id);
      await updateDoc(moviesRef, {
        savedShows: result,
      });
    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    onSnapshot(doc(db, 'users', `${user?.email}`), (doc) => {
      setMovies(doc.data()?.savedShows)
    })
  }, [user?.email])

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-white px-6 md:px-14 lg:px-20 py-24"
      style={{ fontFamily: "'Barlow', 'Helvetica Neue', sans-serif" }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 flex items-end justify-between"
      >
        <div>
          {/* <p className="text-xs font-semibold uppercase tracking-[0.28em] text-red-500 mb-2">
            Your Collection
          </p> */}
          <h1
            className="text-5xl md:text-6xl font-black uppercase leading-none tracking-tight"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            My List
          </h1>
        </div>

        {movies?.length > 0 && (
          <span className="text-gray-500 text-sm tabular-nums mb-1">
            {movies.length} {movies.length === 1 ? "title" : "titles"}
          </span>
        )}
      </motion.div>

      {/* Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        className="origin-left h-px bg-gradient-to-r from-red-500/60 via-white/10 to-transparent mb-10"
      />

      {/* Empty state */}
      {movies?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center py-32 gap-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2">
            <Film className="w-7 h-7 text-white/20" />
          </div>
          <p className="text-gray-400 text-base font-medium">Your list is empty</p>
          <p className="text-gray-600 text-sm">Movies you save will appear here</p>
          <Link
            href="/"
            className="mt-4 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors duration-200"
          >
            Browse Movies
          </Link>
        </motion.div>
      ) : (
        /* Grid */
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8"
        >
          {movies?.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onRemove={handleRemove} />
          ))}
        </motion.div>
      )}
    </div>
  );
}