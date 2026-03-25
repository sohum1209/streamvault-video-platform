"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import Image from "next/image";

function Filter() {
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    rating: null,
    sortByDate: null,
    language: null,
  });

  //   const [filteredData, setFilteredData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "https://api.themoviedb.org/3/movie/popular?api_key=70e445b31149fb360ccc480bcbdecd2d&language=en-US",
      );
      const result = await response.json();
      setData(result.results);
      //   setFilteredData(result); // Initialize filtered data
    }
    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    let result = [...data];

    if (filters.rating) {
      result = result.filter((m) => m.vote_average >= filters.rating);
    }

    if (filters.language) {
      result = result.filter((m) => m.original_language === filters.language);
    }

    if (filters.sortByDate === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.release_date).getTime() -
          new Date(a.release_date).getTime(),
      );
    }

    if (filters.sortByDate === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.release_date).getTime() -
          new Date(b.release_date).getTime(),
      );
    }

    if (result.length === 0) {
      return null;
    }

    return result;
  }, [data, filters]);

  const itemsPerPage = 3;
  const [currentPage, setCurrentPage] = useState(1);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredData?.slice(
    startIndex,
    startIndex + itemsPerPage,
  );
  const totalPages = Math.ceil(filteredData?.length / itemsPerPage);

  return (
    <div className="mt-20">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={"text-black"}>
            Filter
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>Filter Movies</DropdownMenuLabel>

          <DropdownMenuGroup>
            {/* Ratings */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Ratings</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  className={filters.rating === 10 && "bg-green-100"}
                  onClick={() => setFilters({ ...filters, rating: 10 })}
                >
                  ≥ 10 stars
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={filters.rating === 9 && "bg-green-100"}
                  onClick={() => setFilters({ ...filters, rating: 9 })}
                >
                  ≥ 9 stars
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={filters.rating === 8 && "bg-green-100"}
                  onClick={() => setFilters({ ...filters, rating: 8 })}
                >
                  ≥ 8 stars
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, rating: null })}
                >
                  Clear rating
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* Release Date (SORT) */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Release Date</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  className={filters.sortByDate === "newest" && "bg-green-100"}
                  onClick={() =>
                    setFilters({ ...filters, sortByDate: "newest" })
                  }
                >
                  Newest first
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={filters.sortByDate === "oldest" && "bg-green-100"}
                  onClick={() =>
                    setFilters({ ...filters, sortByDate: "oldest" })
                  }
                >
                  Oldest first
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, sortByDate: null })}
                >
                  Clear sorting
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            {/* Language */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Language</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, language: "en" })}
                >
                  English
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, language: "fr" })}
                >
                  French
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, language: "ja" })}
                >
                  Japanese
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setFilters({ ...filters, language: null })}
                >
                  All languages
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <div className="grid lg:grid-cols-6 md:grid-cols-4 gap-2.5">
        {currentItems
          ? currentItems.map((movie, idx) => (
              <div key={idx}>
                <div
                  key={movie.id ?? index}
                  className="w-40 sm:w-[200px] md:w-60 lg:w-[280px] inline-block cursor-pointer p-2 relative"
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                    alt={movie.title || movie.name}
                    width={280} // match max width in parent
                    height={160} // approximate aspect ratio
                    className="w-full h-auto object-cover"
                  />
                  <div className="absolute top-0 left-0 w-full h-full hover:bg-black/80 opacity-0 hover:opacity-100">
                    <p className=" whitespace-normal flex items-center justify-center text-xs md:text-sm h-full ">
                      {movie.title || movie.name}
                    </p>
                  </div>
                </div>
              </div>
            ))
          : "No data found"}
      </div>
    </div>
  );
}

export default Filter;
