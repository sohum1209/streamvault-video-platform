import "server-only";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const allowedStaticPaths = new Set([
  "movie/popular",
  "movie/top_rated",
  "movie/upcoming",
  "movie/now_playing",
  "trending/movie/week",
  "search/movie",
  "discover/movie",
  "genre/movie/list",
]);

function isAllowedPath(segments) {
  const path = segments.join("/");
  if (allowedStaticPaths.has(path)) return true;

  return (
    segments.length >= 2 &&
    segments[0] === "movie" &&
    /^\d+$/.test(segments[1]) &&
    (segments.length === 2 ||
      (segments.length === 3 && ["similar", "videos"].includes(segments[2])))
  );
}

export async function GET(request, { params }) {
  const { path = [] } = await params;
  if (!isAllowedPath(path)) {
    return NextResponse.json({ error: "Unsupported movie-data endpoint." }, { status: 404 });
  }

  const apiKey = process.env.TMDB_API_KEY;
  if (!apiKey) {
    console.error("TMDB_API_KEY is not configured on the server.");
    return NextResponse.json({ error: "Movie data is not configured." }, { status: 500 });
  }

  const upstreamUrl = new URL(`https://api.themoviedb.org/3/${path.join("/")}`);
  upstreamUrl.searchParams.set("api_key", apiKey);

  const incomingUrl = new URL(request.url);
  for (const key of ["language", "page", "query", "with_genres", "include_adult"]) {
    const value = incomingUrl.searchParams.get(key);
    if (value) upstreamUrl.searchParams.set(key, value);
  }

  const page = upstreamUrl.searchParams.get("page");
  if (page && (!/^\d+$/.test(page) || Number(page) < 1 || Number(page) > 500)) {
    return NextResponse.json({ error: "Page must be between 1 and 500." }, { status: 400 });
  }

  // console.log(`Fetching TMDB data from: ${upstreamUrl.toString()}`);

  try {
    const upstream = await fetch(upstreamUrl, { cache: "no-store" });
    return new Response(await upstream.text(), {
      status: upstream.status,
      headers: {
        "Content-Type": upstream.headers.get("content-type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("TMDB request failed:", error);
    return NextResponse.json({ error: "Movie data is temporarily unavailable." }, { status: 502 });
  }
}
