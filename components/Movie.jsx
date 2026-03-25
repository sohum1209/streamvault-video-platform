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
  const [saved, setSaved] = useState(false);
  const { user } = UserAuth();

  const movieId = doc(db, "users", `${user?.email}`);

  const saveMovie = async () => {
    if (user?.email) {
      setLike(!like);
      setSaved(true);
      await updateDoc(movieId, {
        savedShows: arrayUnion({
          id: movie.id,
          title: movie.title,
          backdrop_path: movie.backdrop_path,
        })
      })
    } else {
      alert("Please Login to save the movies.")
    }
  }

  return (
    <Link
      href={`/movie/${movie.id}`}
      key={movie.id ?? index}
      className="w-40 sm:w-[200px] md:w-60 lg:w-[280px] inline-block cursor-pointer p-2 relative"
    >
      {movie.backdrop_path ? (
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
          alt={movie.title || movie.name}
          width={280}
          height={160}
          className="w-full aspect-video object-cover"
        />
      ) : (
        <div className="w-full aspect-video bg-gray-800 m-auto">
          <CiImageOn className="text-3xl text-gray-400" />
        </div>
      )}

      {/* Overlay — uses hover: on itself, not group-hover */}
      <div className="absolute inset-0 bg-black/75 opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <p className="text-white text-xs md:text-sm font-semibold line-clamp-2 leading-snug">
          {movie.title || movie.name}
        </p>
        {movie.vote_average && (
          <p className="text-yellow-400 text-xs mt-1">
            ★ {movie.vote_average.toFixed(1)}
          </p>
        )}

        {/* Wishlist button inside overlay so it appears together */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            saveMovie();
          }}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/50 hover:bg-black/80 transition-colors duration-200"
        >
          {like ? (
            <FaHeart className="text-red-500 text-sm" />
          ) : (
            <FaRegHeart className="text-white text-sm" />
          )}
        </button>
      </div>
    </Link>
  );
}

export default Movie;
