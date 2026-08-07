'use client';
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";

import Movie from "./Movie";

function Row({ title, data, rowId, category }) {
  const movies = data?.results;

  if (!movies?.length) {
    return null;
  }

  const slideleft = () => {
    const slider = document.getElementById("slider" + rowId);
    slider?.scrollBy({ left: -520, behavior: "smooth" });
  };

  const slideright = () => {
    const slider = document.getElementById("slider" + rowId);
    slider?.scrollBy({ left: 520, behavior: "smooth" });
  };

  return (
    <section className="py-3 sm:py-5 px-3 sm:px-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between px-2 sm:px-0">
        <h2 className="font-bold text-lg sm:text-xl md:text-2xl text-white tracking-wide">{title}</h2>
        {category && (
          <Link
            href={`/category/${category}`}
            className="text-xs sm:text-sm font-semibold text-gray-400 hover:text-white transition-colors duration-150"
          >
            See more
          </Link>
        )}
      </div>

      <div className="relative mt-3 flex items-center">
        <div
          className="absolute left-0 top-0 z-10 hidden h-full w-16 items-center justify-center bg-linear-to-r from-black/90 to-transparent opacity-0 transition-all duration-300 md:flex"
        >
          <FaChevronLeft
            onClick={slideleft}
            size={26}
            className="text-white drop-shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200"
          />
        </div>

        <div
          id={"slider" + rowId}
          className="w-full overflow-x-auto scroll-smooth whitespace-nowrap px-1 pb-2 pt-1 snap-x snap-mandatory touch-pan-x overflow-y-hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {movies.map((movie) => (
            <div key={movie.id} className="inline-block snap-center px-1">
              <Movie movie={movie} />
            </div>
          ))}
        </div>

        <div
          className="absolute right-0 top-0 z-10 hidden h-full w-16 items-center justify-center bg-linear-to-l from-black/90 to-transparent opacity-0 transition-all duration-300 md:flex"
        >
          <FaChevronRight
            onClick={slideright}
            size={26}
            className="text-white drop-shadow-lg cursor-pointer hover:scale-110 transition-transform duration-200"
          />
        </div>
      </div>
    </section>
  );
}

export default Row;
