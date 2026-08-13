"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";
import { TemplateProps } from "../types";

export default function CasualTemplate({ data, onInteraction }: TemplateProps) {
    const [isRevealed, setIsRevealed] = useState(false);

    const handleReveal = () => {
        setIsRevealed(true);
        confetti({
            shapes: ['square'],
            scalar: 2,
        });
        onInteraction?.("REVEALED");
    };

    return (
        <div className="w-full h-full bg-yellow-400 p-6 flex flex-col items-center justify-center font-bold text-slate-900">
            {!isRevealed ? (
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleReveal}
                    className="w-full aspect-[3/4] bg-slate-900 rounded-3xl flex items-center justify-center relative overflow-hidden cursor-crosshair shadow-2xl"
                >
                    <div className="text-center text-yellow-400 p-8 border-4 border-dashed border-yellow-400/30 rounded-2xl m-4">
                        <span className="text-4xl">🫣</span>
                        <h2 className="text-2xl mt-4 uppercase tracking-black">Tap to Reveal</h2>
                        <p className="text-sm font-normal mt-2 opacity-70">The Secret Location</p>
                    </div>
                </motion.div>
            ) : (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full aspect-[3/4] bg-white rounded-3xl p-8 flex flex-col items-center text-center shadow-2xl border-4 border-slate-900"
                >
                    <div className="text-6xl mb-6">🍻</div>
                    <h1 className="text-3xl font-black uppercase mb-2">{data.eventTitle}</h1>
                    <p className="text-xl font-bold bg-yellow-300 px-4 py-1 -rotate-2 inline-block mb-8">
                        It's Party Time!
                    </p>

                    <div className="w-full bg-gray-100 p-4 rounded-xl mb-4">
                        <p className="text-xs text-gray-500 uppercase">When</p>
                        <p className="font-bold">{new Date(data.eventDate).toLocaleTimeString()}</p>
                    </div>

                    <div className="w-full bg-gray-100 p-4 rounded-xl">
                        <p className="text-xs text-gray-500 uppercase">Where</p>
                        <p className="font-bold">{data.venueName}</p>
                    </div>
                </motion.div>
            )}
        </div>
    );
}
