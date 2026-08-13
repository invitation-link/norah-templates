"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import confetti from "canvas-confetti";

export default function CoverView({ title, onOpen }: { title: string, onOpen: () => void }) {
    const [isOpening, setIsOpening] = useState(false);

    const handleTap = () => {
        if (isOpening) return;
        setIsOpening(true);

        // 1. Confetti Explosion
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
        });

        // 2. Delay actual view switch closer to animation end
        setTimeout(() => {
            onOpen();
        }, 800);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-purple-200">

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-pink-600 font-bold tracking-widest uppercase mb-12"
            >
                A Surprise For You
            </motion.div>

            {/* Gift Box Container */}
            <motion.div
                whileTap={{ scale: 0.9 }}
                animate={isOpening ? {
                    scale: [1, 1.1, 0],
                    rotate: [0, -10, 10, -10, 0],
                    opacity: [1, 1, 0]
                } : { y: [0, -10, 0] }}
                transition={isOpening
                    ? { duration: 0.6, ease: "backIn" }
                    : { repeat: Infinity, duration: 2, ease: "easeInOut" }
                }
                onClick={handleTap}
                className="cursor-pointer text-[8rem] filter drop-shadow-xl"
            >
                🎁
            </motion.div>

            <motion.button
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="mt-16 px-8 py-3 bg-pink-500 text-white rounded-full font-bold tracking-wider shadow-lg hover:bg-pink-600 transition-colors"
                onClick={handleTap}
            >
                TAP TO OPEN
            </motion.button>
        </div>
    );
}
