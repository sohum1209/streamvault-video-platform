import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export const movieApi = createApi({
  reducerPath: 'movieApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.themoviedb.org/3/',
  }),

  endpoints: (build) => ({

    // 🎬 Popular Movies
    getPopularMovies: build.query({
      query: (page = 1) => ({
        url: 'movie/popular',
        params: {
          api_key: API_KEY,
          page,
        },
      }),
    }),

    // 🔥 Trending Movies
    getTrendingMovies: build.query({
      query: () => ({
        url: 'trending/movie/week',
        params: {
          api_key: API_KEY,
        },
      }),
    }),

    // ⭐ Top Rated Movies
    getTopRatedMovies: build.query({
      query: (page = 1) => ({
        url: 'movie/top_rated',
        params: {
          api_key: API_KEY,
          page,
        },
      }),
    }),

    // 🎥 Now Playing Movies
    getNowPlayingMovies: build.query({
      query: (page = 1) => ({
        url: 'movie/now_playing',
        params: {
          api_key: API_KEY,
          page,
        },
      }),
    }),

    // 🔍 Search Movies
    searchMovies: build.query({
      query: ({ query, page = 1 }) => ({
        url: 'search/movie',
        params: {
          api_key: API_KEY,
          query,
          page,
        },
      }),
    }),

    // 🎞 Movie Details
    getMovieDetails: build.query({
      query: (movieId) => ({
        url: `movie/${movieId}`,
        params: {
          api_key: API_KEY,
        },
      }),
    }),

    // 🎭 Similar Movies
    getSimilarMovies: build.query({
      query: (movieId) => ({
        url: `movie/${movieId}/similar`,
        params: {
          api_key: API_KEY,
        },
      }),
    }),

    // 🎬 Movie Videos (Trailers)
    getMovieVideos: build.query({
      query: (movieId) => ({
        url: `movie/${movieId}/videos`,
        params: {
          api_key: API_KEY,
        },
      }),
    }),

    // 🎭 Movies by Genre
    getMoviesByGenre: build.query({
      query: ({ genreId, page = 1 }) => ({
        url: 'discover/movie',
        params: {
          api_key: API_KEY,
          with_genres: genreId,
          page,
        },
      }),
    }),

    // 📂 Genres List
    getGenres: build.query({
      query: () => ({
        url: 'genre/movie/list',
        params: {
          api_key: API_KEY,
        },
      }),
    }),

  }),
});

export const {
  useGetPopularMoviesQuery,
  useGetTrendingMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetNowPlayingMoviesQuery,
  useSearchMoviesQuery,
  useGetMovieDetailsQuery,
  useGetSimilarMoviesQuery,
  useGetMovieVideosQuery,
  useGetMoviesByGenreQuery,
  useGetGenresQuery,
} = movieApi;