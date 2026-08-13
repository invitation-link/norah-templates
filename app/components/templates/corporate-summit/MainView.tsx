"use client";

import { InviteData } from "../types";
import { Calendar, Clock, MapPin, User, Download } from "lucide-react";

export default function MainView({ data }: { data: InviteData, onOpenSheet: () => void }) {
    // Mock Agenda
    const agenda = [
        { time: "09:00 AM", event: "Registration & Breakfast" },
        { time: "10:00 AM", event: "Keynote: The Future of Tech" },
        { time: "01:00 PM", event: "Networking Lunch" },
    ];

    return (
        <div className="w-full h-full bg-slate-50 overflow-y-auto pb-20 font-sans">

            {/* Header */}
            <div className="bg-slate-900 text-white p-8 rounded-b-[2.5rem] shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <span className="bg-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Conference</span>
                    <h1 className="text-3xl font-bold mt-4 mb-2">{data.eventTitle}</h1>
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                        <Calendar size={14} />
                        <span>{new Date(data.eventDate).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>

            <div className="px-6 -mt-8 relative z-20">
                <div className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex items-center gap-4">
                    <div className="bg-slate-100 p-3 rounded-lg text-slate-600">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900">{data.venueName}</h3>
                        <p className="text-xs text-slate-500">{data.venueAddress}</p>
                    </div>
                </div>
            </div>

            <div className="px-6 mt-8">
                <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <Clock size={18} className="text-blue-600" /> Agenda
                </h2>

                <div className="space-y-6 relative border-l-2 border-slate-200 ml-3 pl-8">
                    {agenda.map((item, i) => (
                        <div key={i} className="relative">
                            <div className="absolute -left-[39px] top-1 w-5 h-5 bg-white border-2 border-blue-600 rounded-full z-10"></div>
                            <span className="text-xs font-bold text-blue-600 block mb-1">{item.time}</span>
                            <h3 className="font-medium text-slate-800">{item.event}</h3>
                        </div>
                    ))}
                </div>
            </div>

            <div className="px-6 mt-10 space-y-3">
                <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2">
                    Register Now
                </button>
                <button className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-2">
                    <Download size={18} /> Add to Calendar
                </button>
            </div>

        </div>
    );
}
