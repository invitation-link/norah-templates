"use client";

import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";
import { InviteData } from "../types";
import { useState } from "react";
import confetti from "canvas-confetti";

export default function MainView({ data, onOpenSheet }: { data: InviteData, onOpenSheet: () => void }) {
    const [candleBlown, setCandleBlown] = useState(false);

    const handleBlowCandle = () => {
        if (candleBlown) return;
        setCandleBlown(true);

        // Confetti
        confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.7 },
            colors: ['#FFD700', '#ffffff']
        });
    };

    return (
        <div className="w-full h-full flex flex-col items-center pt-8 px-6 relative overflow-y-auto bg-gradient-to-b from-pink-50 to-purple-100">
            <div className="text-pink-400 text-xs font-bold tracking-[0.3em] uppercase mb-4">
                You Are Invited
            </div>

            {/* Photo Frame Ring */}
            <div className="relative w-64 h-64 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-white shadow-xl overflow-hidden z-10">
                    <Swiper
                        modules={[Autoplay, EffectFade]}
                        effect="fade"
                        autoplay={{ delay: 2500, disableOnInteraction: false }}
                        loop={true}
                        className="w-full h-full"
                    >
                        {data.galleryImages.map((img, i) => (
                            <SwiperSlide key={i}>
                                <div className="relative w-full h-full bg-gray-200">
                                    {/* Placeholder for actual Next.js Image optimization */}
                                    <img
                                        src={img}
                                        alt={`Slide ${i}`}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Animated Gradient Ring */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-pink-300 via-purple-300 to-yellow-200 animate-spin-slow opacity-70 blur-md -z-10"></div>
            </div>

            <motion.h1
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl font-script text-pink-500 mb-1 drop-shadow-sm font-bold"
            >
                {data.eventTitle.split(' ')[0]}
            </motion.h1>

            <p className="text-xl text-gray-600 font-serif italic mb-8">
                Is turning One!
            </p>

            {/* Interactive Candle */}
            <motion.div
                whileTap={{ scale: 0.95 }}
                onClick={handleBlowCandle}
                className="relative cursor-pointer mb-auto"
            >
                <div className="w-20 h-14 bg-pink-300 rounded-t-lg relative shadow-inner">
                    {/* Frosting */}
                    <div className="absolute top-0 left-0 w-full h-4 bg-white rounded-full translate-y-[-50%]"></div>
                </div>

                {/* Candle */}
                <div className="absolute bottom-14 left-1/2 -translate-x-1/2 w-2 h-8 bg-yellow-400">
                    {/* Flame */}
                    {!candleBlown && (
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                            transition={{ repeat: Infinity, duration: 0.2 }}
                            className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-6 bg-orange-500 rounded-full blur-[2px]"
                        ></motion.div>
                    )}
                    {/* Smoke */}
                    {candleBlown && (
                        <motion.div
                            initial={{ opacity: 0, y: 0 }}
                            animate={{ opacity: 0, y: -40 }}
                            transition={{ duration: 2 }}
                            className="absolute -top-4 left-1/2 -translate-x-1/2 text-gray-400 text-xl font-bold"
                        >
                            ~
                        </motion.div>
                    )}
                </div>

                <p className="text-[10px] text-center text-gray-400 mt-2 uppercase tracking-wide">
                    {candleBlown ? "Yay! Wish Made! ✨" : "Tap candle to make a wish 🕯️"}
                </p>
            </motion.div>

            {/* Swipe Hint */}
            <div
                onClick={onOpenSheet}
                className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-white/90 to-transparent flex flex-col justify-end items-center pb-8 cursor-pointer"
            >
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                >
                    <div className="text-pink-500 font-bold text-xs bg-white/80 backdrop-blur px-4 py-1 rounded-full shadow-sm mb-2">
                        SWIPE UP FOR DETAILS
                    </div>
                    <div className="w-1 h-8 bg-gradient-to-t from-pink-400 to-transparent mx-auto rounded-full"></div>
                </motion.div>
            </div>

        </div>
    );
}
