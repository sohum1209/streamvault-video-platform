'use client';
import React, { useState } from "react";
import Image from "next/image";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { UserAuth } from "@/context/AuthContext";
import { updateDoc, doc, arrayUnion } from "firebase/firestore"
import { db } from "../firebase"
import Link from "next/link";
import { CiImageOn } from "react-icons/ci";

function Movie({ movie }) {
  const [like, setLike] = useState(false);
  const { user } = UserAuth();

  const movieRef = doc(db, "users", `${user?.email}`);

  const saveMovie = async () => {
    if (user?.email) {
      setLike((prev) => !prev);
      await updateDoc(movieRef, {
        savedShows: arrayUnion({
          id: movie.id,
          title: movie.title || movie.name,
          backdrop_path: movie.backdrop_path,
        }),
      });
    }
  };

  return (
    <Link
      href={`/movie/${movie.id}`}
      className="group relative inline-block min-w-[9rem] w-36 sm:w-44 md:w-52 lg:w-60 cursor-pointer px-1.5 sm:p-2"
    >
      {movie.backdrop_path ? (
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
          alt={movie.title || movie.name}
          width={280}
          height={160}
          className="w-full hidden lg:block aspect-video rounded-3xl object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full hidden lg:block aspect-video rounded-3xl bg-gray-800 flex items-center justify-center">
          <CiImageOn className="text-3xl text-gray-400" />
        </div>
      )}

      <div className="hidden lg:block pointer-events-none absolute inset-0 rounded-3xl bg-black/0 transition duration-300 group-hover:bg-black/50" />
      <div className="hidden lg:block pointer-events-none absolute inset-x-0 bottom-0 rounded-b-3xl bg-linear-to-t from-black/90 to-transparent px-3 pb-3 pt-16 opacity-0 transition duration-300 group-hover:opacity-100">
        <p className="text-xs sm:text-sm font-semibold text-white line-clamp-2">
          {movie.title || movie.name}
        </p>
        {movie.vote_average && (
          <p className="mt-2 text-xs text-yellow-400">★ {movie.vote_average.toFixed(1)}</p>
        )}
      </div>

      {movie.poster_path ? (
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title || movie.name}
          width={280}
          height={160}
          className="w-full lg:hidden aspect-3/4 rounded-3xl object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="w-full lg:hidden aspect-3/4 rounded-3xl bg-gray-800 flex items-center justify-center">
          <CiImageOn className="text-3xl text-gray-400" />
        </div>
      )}

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          saveMovie();
        }}
        className="absolute right-3 top-3 z-10 rounded-full bg-black/60 p-2 text-white transition duration-200 hover:bg-black/80"
      >
        {like ? <FaHeart className="text-red-500" /> : <FaRegHeart className="text-white" />}
      </button>
    </Link>
  );
}

export default Movie;
