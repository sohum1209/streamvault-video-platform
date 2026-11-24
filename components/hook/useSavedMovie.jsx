import { useState, useEffect } from "react";
import { updateDoc, arrayUnion, arrayRemove, doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";

export const useSaveMovie = (user) => {
    const uid = user?.uid ?? null;

    // Store the uid with the data so we never show a previous user's list
    const [data, setData] = useState({ uid: null, savedShows: [], name: "" });

    useEffect(() => {
        // Signed out: nothing to subscribe to (no setState here)
        if (!uid) return;

        const unsubscribe = onSnapshot(
            doc(db, "users", uid),
            (snap) => {
                const d = snap.data();
                setData({
                    uid,
                    savedShows: d?.savedShows ?? [],
                    name: d?.name ?? "",
                });
            },
            (error) => {
                console.error("Saved movies listener error:", error.code);
            }
        );

        // Detach on logout, account switch, or unmount
        return () => unsubscribe();
    }, [uid]);

    // Derived values: empty unless the data belongs to the current user
    const isCurrent = !!uid && data.uid === uid;
    const savedMovies = isCurrent ? data.savedShows : [];
    const displayName = isCurrent ? data.name : "";

    // Check if a movie is saved
    const isSaved = (movieId) =>
        savedMovies.some((m) => String(m.id) === String(movieId));

    // Toggle save/unsave
    const toggleSaveMovie = async (movie) => {
        if (!uid) {
            alert("Please login first");
            return;
        }

        const docRef = doc(db, "users", uid);

        try {
            // arrayRemove only works with an object identical to the stored one,
            // so use the entry that is actually saved.
            const existing = savedMovies.find(
                (m) => String(m.id) === String(movie.id)
            );

            if (existing) {
                // UNSAVE
                await updateDoc(docRef, {
                    savedShows: arrayRemove(existing),
                });
            } else {
                // SAVE (Firestore rejects `undefined`, so fall back to null)
                await updateDoc(docRef, {
                    savedShows: arrayUnion({
                        id: movie.id,
                        title: movie.title ?? "",
                        backdrop_path: movie.backdrop_path ?? null,
                    }),
                });
            }
            // No manual setState needed: onSnapshot fires immediately
            // for local writes and updates the UI.
        } catch (err) {
            console.error("Toggle save failed:", err.code, err.message);
        }
    };

    return { savedMovies, isSaved, toggleSaveMovie, displayName };
};