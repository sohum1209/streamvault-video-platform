const requests = {
  requestPopular: "/api/tmdb/movie/popular?language=en-US&page=1",
  requestTopRated: "/api/tmdb/movie/top_rated?language=en-US&page=1",
  requestTrending: "/api/tmdb/movie/popular?language=en-US&page=2",
  requestHorror: "/api/tmdb/search/movie?language=en-US&query=horror&page=1&include_adult=false",
  requestUpcoming: "/api/tmdb/movie/upcoming?language=en-US&page=1",
};

export default requests;
