"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export default function CoverView({ title, onOpen }: { title: string, onOpen: () => void }) {
    return (
        <div className="w-full h-full bg-slate-900 text-white flex flex-col justify-between p-8 relative overflow-hidden">

            {/* Background Abstract Shapes */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-600 rounded-full blur-[100px] opacity-20 translate-y-1/2 -translate-x-1/2"></div>

            <div className="mt-20 z-10">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="w-12 h-1 bg-blue-500 mb-6"
                ></motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="text-5xl font-bold tracking-tight leading-tight"
                >
                    {title}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    className="mt-4 text-lg font-light"
                >
                    You are invited.
                </motion.p>
            </div>

            <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpen}
                className="w-full py-4 bg-white text-slate-900 font-bold rounded-xl flex items-center justify-between px-6 z-10 shadow-lg"
            >
                <span>Enter Event Hub</span>
                <ChevronRight size={20} />
            </motion.button>
        </div>
    );
}
