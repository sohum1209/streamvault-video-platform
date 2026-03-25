'use client'

import VideoPlayer from "@/components/VideoPlayer";
import { LoaderIcon } from "lucide-react";
import { useGetMovieDetailsQuery } from "@/services/movieApi";
import { useParams } from "next/navigation";
export default function WatchPage() {
    const { movieid } = useParams();

    const { data:movie, isLoading } = useGetMovieDetailsQuery(movieid);

    if (isLoading) return <div className="flex flex-col items-center justify-center h-screen gap-2">
        <LoaderIcon className="animate-spin w-18 h-18 text-blue-500" />
        <p className="text-gray-500 text-sm">Loading movie details...</p>
    </div>

    if (!movie) {
        return <div className="text-white">Movie not found 😢</div>;
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 py-20">
            <div className="w-full max-w-7xl">
                <VideoPlayer movie={movie} />

                <div className="mt-6 flex items-start gap-4">
                    <div>
                        <h1 className="text-white text-xl font-bold">{movie.title}</h1>
                        <p className="text-gray-400 text-sm mt-1">{movie.overview}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}