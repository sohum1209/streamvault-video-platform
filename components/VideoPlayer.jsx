"use client";

import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Public domain HLS stream — swap with your own later
const DEMO_STREAM = "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8";

export default function VideoPlayer({ movie }) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const hideTimer = useRef(null);

  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  // Attach HLS
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(DEMO_STREAM);
      hls.attachMedia(video);
      return () => hls.destroy();
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = DEMO_STREAM;
    }
  }, []);

  // Progress tracking
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onTimeUpdate = () => setProgress(video.currentTime);
    const onLoadedMetadata = () => setDuration(video.duration);

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
    };
  }, []);

  // Auto-hide controls
  const resetHideTimer = () => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (playing) setShowControls(false);
    }, 3000);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) { video.play(); setPlaying(true); }
    else { video.pause(); setPlaying(false); }
  };

  const toggleMute = () => {
    videoRef.current.muted = !muted;
    setMuted((v) => !v);
  };

  const seek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = ratio * duration;
  };

  const fullscreen = () => containerRef.current?.requestFullscreen();

  const fmt = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={resetHideTimer}
      onClick={togglePlay}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden cursor-pointer select-none"
    >
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        playsInline
      />

      {/* Big play/pause flash */}
      <AnimatePresence>
        {!playing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="w-20 h-20 rounded-full bg-black/60 flex items-center justify-center backdrop-blur-sm">
              <Play className="w-8 h-8 fill-white text-white ml-1" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-16"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }}
          >
            {/* Movie title */}
            <p className="text-white text-sm font-semibold mb-3 tracking-wide">
              {movie.title}
            </p>

            {/* Seek bar */}
            <div
              onClick={seek}
              className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer relative group/seek"
            >
              <div
                className="h-full bg-red-500 rounded-full relative"
                style={{ width: `${duration ? (progress / duration) * 100 : 0}%` }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full scale-0 group-hover/seek:scale-100 transition-transform duration-150" />
              </div>
            </div>

            {/* Bottom row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={togglePlay} className="text-white hover:text-red-400 transition-colors">
                  {playing
                    ? <Pause className="w-5 h-5 fill-white" />
                    : <Play className="w-5 h-5 fill-white" />
                  }
                </button>

                <button onClick={toggleMute} className="text-white hover:text-red-400 transition-colors">
                  {muted
                    ? <VolumeX className="w-5 h-5" />
                    : <Volume2 className="w-5 h-5" />
                  }
                </button>

                <span className="text-white/60 text-xs tabular-nums">
                  {fmt(progress)} / {fmt(duration)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => { videoRef.current.currentTime = 0; }}
                  className="text-white hover:text-red-400 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button onClick={fullscreen} className="text-white hover:text-red-400 transition-colors">
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}