"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";

export default function CoverView({ title, onOpen }: { title: string, onOpen: () => void }) {
    const [isOpening, setIsOpening] = useState(false);

    const handleOpen = () => {
        if (isOpening) return;
        setIsOpening(true);

        // Rose Petals Confetti
        const scalar = 2;
        const heart = confetti.shapeFromPath({ path: 'M167 72c19,-38 37,-56 75,-56 42,0 76,33 76,75 0,76 -76,151 -151,227 -76,-76 -151,-151 -151,-227 0,-42 33,-75 75,-75 38,0 57,18 76,56z' });

        confetti({
            shapes: [heart],
            colors: ['#D4AF37', '#FF0000', '#800000'],
            scalar,
            particleCount: 50,
            spread: 100,
            origin: { y: 0.4 }
        });

        setTimeout(() => {
            onOpen();
        }, 1200); // Wait for door animation
    };

    return (
        <div className="relative w-full h-full overflow-hidden bg-gray-900 cursor-pointer" onClick={handleOpen}>

            {/* Left Door */}
            <motion.div
                animate={isOpening ? { x: "-100%" } : { x: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute left-0 top-0 w-1/2 h-full bg-[#3e1c25] border-r-4 border-[#D4AF37] flex items-center justify-end z-20 shadow-[10px_0_50px_rgba(0,0,0,0.8)]"
            >
                <div className="mr-4 w-4 h-64 bg-[#D4AF37] opacity-20 rounded-full"></div>
                {/* Door Knob */}
                <div className="absolute top-1/2 right-4 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-600 shadow-lg border border-yellow-100"></div>
            </motion.div>

            {/* Right Door */}
            <motion.div
                animate={isOpening ? { x: "100%" } : { x: 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
                className="absolute right-0 top-0 w-1/2 h-full bg-[#3e1c25] border-l-4 border-[#D4AF37] flex items-center justify-start z-20 shadow-[-10px_0_50px_rgba(0,0,0,0.8)]"
            >
                <div className="ml-4 w-4 h-64 bg-[#D4AF37] opacity-20 rounded-full"></div>
                {/* Door Knob */}
                <div className="absolute top-1/2 left-4 w-6 h-6 rounded-full bg-gradient-to-br from-yellow-200 to-yellow-600 shadow-lg border border-yellow-100"></div>
            </motion.div>

            {/* Content Behind Doors (Briefly visible during open) */}
            <div className="absolute inset-0 bg-[#fff5f5] flex items-center justify-center">
                <h1 className="text-4xl font-serif text-[#D4AF37]">Welcome</h1>
            </div>

            {/* Tap Hint */}
            {!isOpening && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 text-[#D4AF37] text-xs tracking-[0.3em] font-serif uppercase bg-black/40 px-4 py-2 rounded border border-[#D4AF37]/30 backdrop-blur-sm"
                >
                    Tap to Open
                </motion.div>
            )}

        </div>
    );
}
