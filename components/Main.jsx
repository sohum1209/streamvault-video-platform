'use client'

import { fetchPopular } from "@/app/api/movies/route";
import Image from "next/image";
import { UserAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSaveMovie } from "./hook/useSavedMovie";
import Link from "next/link";

const truncateString = (str, num) => {
  if (str.length <= num) {
    return str;
  }
  return str.slice(0, num) + "...";
};


function Main() {


  const { user } = UserAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { isSaved, toggleSaveMovie } = useSaveMovie(user);

  const [movie, setMovie] = useState(null);

  useEffect(() => {
    async function fetchMovie() {
      try {
        const movieData = await fetchPopular();
        const movies = movieData?.results || [];
        if (movies.length) {
          const randomMovie =
            movies[Math.floor(Math.random() * movies.length)];
          setMovie(randomMovie);
        }
      } catch (error) {
        console.log("Error in fetching movie: ", error);
      }
    }

    fetchMovie();
  }, []);

  const handlePlay = () => {
    if (!user) {
      router.push(`/login?callbackUrl=${encodeURIComponent(`/movie/watch/${movie.id}`)}`);
      return;
    }
    router.push(`/movie/watch/${movie.id}`);
  }
  //   console.log(movie);

  if (!movie) return null;

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[550px]">
      {/* Backdrop */}
      <Image
        src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
        alt={movie.title}
        fill
        className="object-cover object-top"
        priority
      />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Content */}
      <Link href={`/movie/${movie?.id}`} className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8 md:p-12 pb-8 md:pb-12">
        <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight max-w-lg">
          {movie?.title}
        </h1>

        <p className="text-xs sm:text-sm text-gray-400 mt-2">
          Released: {movie?.release_date}
        </p>

        <p className="text-sm text-gray-200 mt-2 max-w-sm sm:max-w-md md:max-w-lg leading-relaxed">
          {truncateString(movie?.overview, 150)}
        </p>

        <div className="flex items-center gap-3 mt-4">
          <button onClick={handlePlay} className="bg-white text-black text-sm font-semibold py-2 px-6 rounded hover:bg-gray-200 transition-colors duration-150">
            Play
          </button>
          <button onClick={() => toggleSaveMovie(movie)} className="border border-white/50 text-white text-sm font-medium py-2 px-6 rounded hover:bg-white/10 transition-colors duration-150">
            {!isSaved(movie.id) ? "Watch Later" : "Saved"}
          </button>
        </div>
      </Link>
    </div>
  );
}

export default Main;
