'use client'

// import {fetchHorror, fetchPopular, fetchTrending, fetchUpcoming} from "@/app/api/movies/route"
import { useGetTrendingMoviesQuery, useGetPopularMoviesQuery, useGetTopRatedMoviesQuery, useGetUpcomingMoviesQuery } from "@/services/movieApi";
import Main from "@/components/Main";
import Row from "@/components/Row";
import { LoaderIcon } from "lucide-react";
import { useMemo } from "react";

export default function Home() {

  // const popularmovies = await fetchPopular();
  // const horrormovies = await fetchHorror();
  // const upcomingmovies = await fetchUpcoming();
  // const trendingmovies = await fetchTrending();

  const { data: popularmovies, isLoading: popularLoading } = useGetPopularMoviesQuery();

  const heroMovie = useMemo(() => {
    if (!popularmovies?.results?.length) return null;

    return popularmovies.results[
      // eslint-disable-next-line react-hooks/purity
      Math.floor(Math.random() * popularmovies.results.length)
    ];
  }, [popularmovies]);

  const { data: topratedmovies, isLoading: topRatedLoading } = useGetTopRatedMoviesQuery();

  const { data: trendingmovies, isLoading: trendingLoading } = useGetTrendingMoviesQuery();

  const { data: upcomingmovies, isLoading: upcomingLoading } = useGetUpcomingMoviesQuery();
  // console.log(popularmovies)

  if (popularLoading || topRatedLoading || trendingLoading || upcomingLoading) {
    return <div className="flex flex-col items-center justify-center h-screen gap-2">
      <LoaderIcon className="animate-spin w-18 h-18 text-blue-500" />
      <p className="text-gray-500 text-sm">Loading movie details...</p>
    </div>;
  }

  return (
    <>
      <Main movie={heroMovie}></Main>
      <Row rowId="popular" title="Popular on Netflix" data={popularmovies} category="popular"></Row>
      <Row rowId="upcoming" title="Upcoming Movies" data={upcomingmovies} category="upcoming"></Row>
      <Row rowId="trending" title="Trending Now" data={trendingmovies} category="trending"></Row>
      <Row rowId="top-rated" title="Top Rated Movies" data={topratedmovies} category="top-rated"></Row>
      {/* <Row rowId="horror" title="Horror Movies" data={horrormovies}></Row> */}
    </>
  );
}
