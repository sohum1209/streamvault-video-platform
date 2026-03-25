'use client'

import Image from "next/image";
// import {fetchHorror, fetchPopular, fetchTrending, fetchUpcoming} from "@/app/api/movies/route"
import { useGetTrendingMoviesQuery, useGetPopularMoviesQuery, useGetTopRatedMoviesQuery } from "@/services/movieApi";
import Main from "@/components/Main";
import Row from "@/components/Row";
import { LoaderIcon } from "lucide-react";

export default function Home() {

  // const popularmovies = await fetchPopular();
  // const horrormovies = await fetchHorror();
  // const upcomingmovies = await fetchUpcoming();
  // const trendingmovies = await fetchTrending();

  const { data: popularmovies, error: popularmoviesError, isLoading: popularLoading } = useGetPopularMoviesQuery();

  const { data: topratedmovies, error: topratedmoviesError, isLoading: topRatedLoading } = useGetTopRatedMoviesQuery();

  const { data: trendingmovies, error: trendingmoviesError, isLoading: trendingLoading } = useGetTrendingMoviesQuery();
  // console.log(popularmovies)

  if (popularLoading || topRatedLoading || trendingLoading) {
    return <div className="flex flex-col items-center justify-center h-screen gap-2">
      <LoaderIcon className="animate-spin w-18 h-18 text-blue-500" />
      <p className="text-gray-500 text-sm">Loading movie details...</p>
    </div>;
  }

  return (
    <>
      <Main></Main>
      <Row rowId="popular" title="Popular on Netflix" data={popularmovies}></Row>
      <Row rowId="upcoming" title="Upcoming Movies" data={topratedmovies}></Row>
      <Row rowId="trending" title="Trending Now" data={trendingmovies}></Row>
      {/* <Row rowId="horror" title="Horror Movies" data={horrormovies}></Row> */}
    </>
  );
}
