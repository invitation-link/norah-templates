"use client";

import { motion } from "framer-motion";
import { InviteData } from "../types";
import { Calendar, MapPin, Navigation, Send } from "lucide-react";

export default function DetailsSheet({ isOpen, onClose, data }: { isOpen: boolean, onClose: () => void, data: InviteData }) {

    return (
        <motion.div
            initial={{ y: "100%" }}
            animate={{ y: isOpen ? "30%" : "100%" }} // 30% from top = 70% height sheet
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            onDragEnd={(_, info) => {
                if (info.offset.y > 100) onClose();
            }}
            className="absolute inset-0 z-40 bg-white/80 backdrop-blur-xl rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col"
        >
            {/* Handle */}
            <div
                onClick={onClose}
                className="w-full pt-4 pb-2 flex justify-center cursor-pointer"
            >
                <div className="w-12 h-1.5 bg-gray-300 rounded-full"></div>
            </div>

            <div className="px-8 pt-4 pb-12 overflow-y-auto flex-1">
                <h2 className="text-2xl font-bold text-gray-800 mb-1 text-center">Celebration Details</h2>
                <p className="text-gray-500 text-center text-sm mb-8">We can't wait to see you there!</p>

                {/* Date Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center text-pink-500">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <div className="font-bold text-gray-800 text-lg">
                            {new Date(data.eventDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                        </div>
                        <div className="text-pink-500 font-bold text-sm">
                            {new Date(data.eventDate).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} Onwards
                        </div>
                    </div>
                </div>

                {/* Venue Card */}
                <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-8 flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-500">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <div className="font-bold text-gray-800">
                            {data.venueName}
                        </div>
                        <div className="text-gray-400 text-xs">
                            {data.venueAddress}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <a
                    href={data.rsvpLink}
                    target="_blank"
                    className="w-full py-4 bg-[#25D366] text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl active:scale-95 transition-all mb-3"
                >
                    <Send size={20} /> Send Wishes on WhatsApp
                </a>

                <div className="grid grid-cols-2 gap-3 pb-8">
                    <a
                        href={data.venueMapUrl}
                        target="_blank"
                        className="py-3 bg-white text-blue-600 border border-blue-100 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm"
                    >
                        <Navigation size={18} /> Directions
                    </a>
                    <button className="py-3 bg-white text-pink-500 border border-pink-100 rounded-xl font-bold flex items-center justify-center gap-2 shadow-sm">
                        <Calendar size={18} /> Add to Cal
                    </button>
                </div>

            </div>
        </motion.div>
    );
}
