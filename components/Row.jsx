'use client';
import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Link from "next/link";

import Movie from "./Movie";

function Row({ title, data, rowId, category }) {

  // console.log("Logging: ", data)
  const movies = data?.results;

  if (!movies?.length) {
    return null;
  }

  const slideleft = () => {
    let slider = document.getElementById("slider" + rowId);
    slider.scrollLeft = slider.scrollLeft - 500;
  }

  const slideright = () => {
    let slider = document.getElementById("slider" + rowId);
    slider.scrollLeft = slider.scrollLeft + 500;
  }

  return (
    <div className="py-1.5 sm:py-3 px-2 ">

      {/* Title */}
      <div className="flex items-center justify-between px-2 py-1 sm:p-4">
        <h2 className="font-bold md:text-xl text-white tracking-wide">{title}</h2>
        {category && (
          <Link
            href={`/category/${category}`}
            className="text-xs sm:text-sm font-semibold text-gray-400 hover:text-white transition-colors duration-150"
          >
            See more
          </Link>
        )}
      </div>

      {/* Slider */}
      <div className="relative flex items-center group">

        {/* Right gradient overlay + arrow */}
        <div
          className="absolute left top-0 h-full w-24 z-10
    flex items-center justify-center
    bg-gradient-to-l from-transparent to-black/60
    opacity-0 group-hover:opacity-100
    transition-all duration-300
    pointer-events-none"
        >
          <FaChevronLeft
            onClick={slideleft}
            size={28}
            className="text-white drop-shadow-lg cursor-pointer
      pointer-events-auto  hover:scale-110 transition-transform duration-200"
          />
        </div>

        {/* Movie strip */}
        <div
          id={"slider" + rowId}
          className="w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth px-1"
          style={{ scrollbarWidth: "none" }}
        >
          {movies.map((movie, index) => (
            <Movie key={movie.id ?? index} movie={movie} />
          ))}
        </div>

        {/* Right gradient overlay + arrow */}
        <div
          className="absolute right-0 top-0 h-full w-24 z-10
    flex items-center justify-center
    bg-gradient-to-r from-transparent to-black/60
    opacity-0 group-hover:opacity-100
    transition-all duration-300
    pointer-events-none"
        >
          <FaChevronRight
            onClick={slideright}
            size={28}
            className="text-white drop-shadow-lg cursor-pointer
      pointer-events-auto  hover:scale-110 transition-transform duration-200"
          />
        </div>
      </div>
    </div>
  );
}

export default Row;
