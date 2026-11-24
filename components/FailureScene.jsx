"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleAlert, RotateCcw } from "lucide-react";

export default function FailureScene({
    compact = false,
    title = "We couldn't load this page",
    message = "Something went wrong while loading this page. Please try again.",
    onRetry,
}) {
    const pathname = usePathname();

    return (
        <section
            className={`relative isolate flex flex-col items-center justify-center overflow-hidden bg-[#080808] px-6 text-center text-white ${
                compact ? "min-h-[28rem] rounded-2xl py-16" : "min-h-screen py-24"
            }`}
        >
            <Image
                src="/banner_img.png"
                alt=""
                fill
                priority={!compact}
                sizes="100vw"
                className="object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/70 via-[#080808]/85 to-[#080808]" />

            <div className="relative z-10 flex max-w-lg flex-col items-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-red-500/25 bg-red-500/10">
                    <CircleAlert className="h-8 w-8 text-red-400" aria-hidden="true" />
                </div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-red-400">
                    Unable to load
                </p>
                <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>
                <p className="mt-4 max-w-md text-sm leading-6 text-gray-300 sm:text-base">
                    {message}
                </p>

                <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                    {onRetry && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-400"
                        >
                            <RotateCcw className="h-4 w-4" aria-hidden="true" />
                            Try again
                        </button>
                    )}
                    {pathname !== "/" && (
                        <Link
                            href="/"
                            className="rounded-lg border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Back to home
                        </Link>
                    )}
                </div>
            </div>
        </section>
    );
}
