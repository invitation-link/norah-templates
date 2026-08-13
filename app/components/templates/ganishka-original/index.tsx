"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TemplateProps } from "../types";
import CoverView from "./CoverView";
import MainView from "./MainView";
import DetailsSheet from "./DetailsSheet";

export default function GanishkaTemplate({ data, onInteraction }: TemplateProps) {
    const [viewState, setViewState] = useState<"COVER" | "MAIN">("COVER");
    const [showSheet, setShowSheet] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Music State - Only initialize on client
    const [isPlaying, setIsPlaying] = useState(false);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    useEffect(() => {
        setMounted(true);
        // Create audio element on client only
        const audioEl = new Audio(data.musicUrl || "/music/birthday-music.mp3");
        audioEl.loop = true;
        audioEl.volume = 0.5;
        setAudio(audioEl);

        return () => {
            audioEl.pause();
            audioEl.src = "";
        };
    }, [data.musicUrl]);

    const handleOpen = () => {
        setViewState("MAIN");
        if (audio) {
            audio.play().catch(() => { }); // Ignore autoplay errors
            setIsPlaying(true);
        }
        onInteraction?.("OPENED");
    };

    const toggleMusic = () => {
        if (!audio) return;
        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play().catch(() => { });
            setIsPlaying(true);
        }
    };

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted) {
        return (
            <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-200 flex items-center justify-center">
                <div className="animate-pulse text-pink-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full bg-[#fae8f5] overflow-hidden font-sans">

            {/* Background Music Toggle */}
            {viewState === "MAIN" && (
                <button
                    onClick={toggleMusic}
                    className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg text-pink-500"
                >
                    {isPlaying ? "🔊" : "🔇"}
                </button>
            )}

            <AnimatePresence mode="wait">
                {viewState === "COVER" ? (
                    <motion.div
                        key="cover"
                        exit={{ y: "-100%", transition: { duration: 0.8, ease: "easeInOut" } }}
                        className="absolute inset-0 z-20"
                    >
                        <CoverView title={data.eventTitle} onOpen={handleOpen} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="main"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="absolute inset-0 z-10"
                    >
                        <MainView
                            data={data}
                            onOpenSheet={() => setShowSheet(true)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <DetailsSheet
                isOpen={showSheet}
                onClose={() => setShowSheet(false)}
                data={data}
            />
        </div>
    );
}
