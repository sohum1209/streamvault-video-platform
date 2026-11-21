import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const movieApi = createApi({
  reducerPath: 'movieApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/tmdb/',
  }),

  endpoints: (build) => ({

    // 🎬 Popular Movies
    getPopularMovies: build.query({
      query: (page = 1) => ({
        url: 'movie/popular',
        params: {
          page,
        },
      }),
    }),

    // 🔥 Trending Movies
    getTrendingMovies: build.query({
      query: () => ({
        url: 'trending/movie/week',
      }),
    }),

    // ⭐ Top Rated Movies
    getTopRatedMovies: build.query({
      query: (page = 1) => ({
        url: 'movie/top_rated',
        params: {
          page,
        },
      }),
    }),

    getUpcomingMovies: build.query({
      query: (page = 1) => ({
        url: 'movie/upcoming',
        params: {
          page,
        },
      }),
    }),

    getCategoryMovies: build.query({
      query: ({ category, page = 1 }) => {
        const endpoints = {
          popular: 'movie/popular',
          'top-rated': 'movie/top_rated',
          trending: 'trending/movie/week',
          upcoming: 'movie/upcoming',
          'now-playing': 'movie/now_playing',
        };

        return {
          url: endpoints[category] || endpoints.popular,
          params: {
            page,
          },
        };
      },
    }),

    // 🎥 Now Playing Movies
    getNowPlayingMovies: build.query({
      query: (page = 1) => ({
        url: 'movie/now_playing',
        params: {
          page,
        },
      }),
    }),

    // 🔍 Search Movies
    searchMovies: build.query({
      query: ({ query, page = 1 }) => ({
        url: 'search/movie',
        params: {
          query,
          page,
        },
      }),
    }),

    // 🎞 Movie Details
    getMovieDetails: build.query({
      query: (movieId) => ({
        url: `movie/${movieId}`,
      }),
    }),

    // 🎭 Similar Movies
    getSimilarMovies: build.query({
      query: ({movieId, page=1}) => ({
        url: `movie/${movieId}/similar`,
        params: {
          page
        },
      }),
    }),

    // 🎬 Movie Videos (Trailers)
    getMovieVideos: build.query({
      query: (movieId) => ({
        url: `movie/${movieId}/videos`,
      }),
    }),

    // 🎭 Movies by Genre
    getMoviesByGenre: build.query({
      query: ({ genreId, page = 1 }) => ({
        url: 'discover/movie',
        params: {
          with_genres: genreId,
          page,
        },
      }),
    }),

    // 📂 Genres List
    getGenres: build.query({
      query: () => ({
        url: 'genre/movie/list',
      }),
    }),

  }),
});

export const {
  useGetPopularMoviesQuery,
  useGetTrendingMoviesQuery,
  useGetTopRatedMoviesQuery,
  useGetUpcomingMoviesQuery,
  useLazyGetCategoryMoviesQuery,
  useGetNowPlayingMoviesQuery,
  useLazySearchMoviesQuery,
  useGetMovieDetailsQuery,
  useGetSimilarMoviesQuery,
  useLazyGetSimilarMoviesQuery,
  useGetMovieVideosQuery,
  useGetMoviesByGenreQuery,
  useGetGenresQuery,
} = movieApi;
