"use client";

import { motion } from "framer-motion";
import { InviteData } from "../types";
import { Calendar, MapPin } from "lucide-react";

export default function MainView({ data, onOpenSheet }: { data: InviteData, onOpenSheet: () => void }) {
    return (
        <div className="w-full h-full bg-[#fff0f3] overflow-y-auto pb-20">

            {/* Hero Header */}
            <div className="relative h-[60vh] w-full bg-gray-200 overflow-hidden rounded-b-[3rem] shadow-xl">
                <img
                    src={data.coverImage || "/images/royal-cover-placeholder.jpg"}
                    className="w-full h-full object-cover"
                    alt="Couple"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3e1c25]/80 via-transparent to-transparent"></div>

                <div className="absolute bottom-10 left-0 w-full text-center text-white">
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-serif italic text-lg opacity-90 mb-2"
                    >
                        The Wedding Of
                    </motion.p>
                    <motion.h1
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="font-serif text-5xl font-medium tracking-tight"
                    >
                        {data.eventTitle.split(" & ").map((n, i) => (
                            <span key={i} className="block">{n} {i === 0 && <span className="text-3xl text-[#D4AF37]">&</span>}</span>
                        ))}
                    </motion.h1>
                </div>
            </div>

            {/* Decorative Divider */}
            <div className="flex justify-center -mt-6 mb-8 relative z-10">
                <div className="w-12 h-12 bg-[#D4AF37] rounded-full ring-4 ring-white flex items-center justify-center text-white font-serif text-xl shadow-lg">
                    &
                </div>
            </div>

            {/* Details Section */}
            <div className="px-8 text-center space-y-10">

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="p-6 border border-[#D4AF37]/30 rounded-t-[100px] rounded-b-xl bg-white shadow-sm"
                >
                    <div className="flex flex-col items-center gap-2 mb-4">
                        <Calendar className="text-[#D4AF37]" />
                        <h3 className="uppercase tracking-widest text-xs font-bold text-gray-500">When</h3>
                    </div>
                    <p className="font-serif text-2xl text-gray-800">
                        {new Date(data.eventDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-gray-500 font-serif italic mt-1">at Six O'Clock in the evening</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="p-6 border border-[#D4AF37]/30 rounded-b-[100px] rounded-t-xl bg-white shadow-sm"
                >
                    <div className="flex flex-col items-center gap-2 mb-4">
                        <MapPin className="text-[#D4AF37]" />
                        <h3 className="uppercase tracking-widest text-xs font-bold text-gray-500">Where</h3>
                    </div>
                    <p className="font-serif text-xl text-gray-800 leading-relaxed px-4">
                        {data.venueName}
                    </p>
                    <p className="text-gray-400 text-sm mt-2">{data.venueAddress}</p>
                </motion.div>

                <button
                    onClick={onOpenSheet}
                    className="w-full py-4 bg-[#3e1c25] text-[#D4AF37] font-serif uppercase tracking-widest text-sm rounded-lg shadow-lg hover:bg-[#5a2a36] transition-colors"
                >
                    RSVP Now
                </button>

            </div>
        </div>
    );
}
