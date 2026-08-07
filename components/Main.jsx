'use client'

// import { fetchPopular } from "@/app/api/movies/route";
import { useGetPopularMoviesQuery } from "@/services/movieApi";
import Image from "next/image";
import { UserAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import { useSaveMovie } from "./hook/useSavedMovie";
import Link from "next/link";

const truncateString = (str, num) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
};


function Main({ movie }) {
  const { user } = UserAuth();
  const router = useRouter();
  const { isSaved, toggleSaveMovie } = useSaveMovie(user);

  const releaseYear = movie?.release_date?.slice(0, 4) || "TBA";
  const score = movie?.vote_average ? movie.vote_average.toFixed(1) : "--";

  const handlePlay = () => {
    if (!user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/movie/watch/${movie.id}`)}`);
      return;
    }
    router.push(`/movie/watch/${movie.id}`);
  };

  if (!movie) return null;

  return (
    <section className="relative w-full min-h-[540px] md:min-h-[620px] overflow-hidden">
      <div className="absolute inset-0">
        {movie.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
            alt={movie.title || movie.name}
            fill
            className="object-cover object-top"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-slate-900" />
        )}
      </div>

      <div className="absolute inset-0 bg-linear-to-r from-black/95 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_rgba(255,255,255,0.08),_transparent_28%)]" />

      <div className="absolute bottom-0 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="w-full max-w-full sm:max-w-3xl space-y-5 rounded-[2rem] border border-white/10 bg-black/30 p-5 shadow-2xl sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-red-600/95 px-3 py-1 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.28em] text-white shadow-sm">
              Featured
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
              {releaseYear}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
              ⭐ {score}
            </span>
          </div>

          <Link href={`/movie/${movie?.id}`} className="block">
            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              {movie?.title || movie?.name}
            </h1>
          </Link>

          <p className="max-w-2xl text-sm leading-7 text-gray-300 sm:text-base lg:text-lg">
            {truncateString(movie?.overview || "No description available.", 190)}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
            <div className="flex gap-3 sm:contents">
              <button
                onClick={handlePlay}
                className="flex-1 sm:flex-none sm:w-auto inline-flex items-center justify-center rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-black transition duration-200 hover:bg-gray-200 sm:text-base"
              >
                Play
              </button>
              <Link
                href={`/movie/${movie?.id}`}
                className="flex-1 sm:flex-none sm:w-auto inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition duration-200 hover:border-red-500 hover:bg-white/10 sm:text-base"
              >
                More Info
              </Link>
            </div>
            <button
              onClick={() => toggleSaveMovie(movie)}
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white transition duration-200 hover:bg-white/10 sm:text-base"
            >
              {!isSaved(movie.id) ? "Watch Later" : "Saved"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Main;
