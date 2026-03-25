import VideoPlayer from "@/components/VideoPlayer";
import { fetchMovieDetails } from "@/app/api/movies/route";
export default async function WatchPage({ params }) {
    const { movieid } = await params;

    const movie = await fetchMovieDetails(movieid);

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