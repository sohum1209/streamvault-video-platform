"use client";

import FailureScene from "@/components/FailureScene";

export default function Error({ reset }) {
    return (
        <FailureScene
            title="Something went wrong"
            message="An unexpected error stopped this page from loading. You can try again or return to the home page."
            onRetry={reset}
        />
    );
}
