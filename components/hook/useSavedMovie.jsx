import { useState, useEffect } from "react";
import { updateDoc, arrayUnion, arrayRemove, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";

export const useSaveMovie = (user) => {
    const [savedMovies, setSavedMovies] = useState([]);
    const [displayName, setDisplayName] = useState("");

    // Fetch saved movies
    useEffect(() => {
        onSnapshot(doc(db, 'users', `${user?.email}`), (doc) => {
            setSavedMovies(doc.data()?.savedShows);
            setDisplayName(doc.data()?.name);
        })
    }, [user?.email])

    // Check if movie is saved
    const isSaved = (movieId) => {
        return savedMovies?.some((m) => m.id === movieId);
    };

    // Toggle save/unsave
    const toggleSaveMovie = async (movie) => {
        if (!user?.uid) {
            alert("Please login first");
            return;
        }

        const docRef = doc(db, "users", `${user?.email}`);

        try {
            if (isSaved(movie.id)) {
                // 🔥 UNSAVE
                await updateDoc(docRef, {
                    savedShows: arrayRemove({
                        id: movie.id,
                        title: movie.title,
                        backdrop_path: movie.backdrop_path,
                    }),
                });

                setSavedMovies((prev) => prev.filter((m) => m.id !== movie.id));
            } else {
                // 🔥 SAVE
                await updateDoc(docRef, {
                    savedShows: arrayUnion({
                        id: movie.id,
                        title: movie.title,
                        backdrop_path: movie.backdrop_path,
                    }),
                });

                setSavedMovies((prev) => [...prev, movie]);
            }
        } catch (err) {
            console.error(err);
        }
    };


    return { savedMovies, isSaved, toggleSaveMovie, displayName };
};