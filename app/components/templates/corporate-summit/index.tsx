"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TemplateProps } from "../types";
import CoverView from "./CoverView";
import MainView from "./MainView";

export default function CorporateTemplate({ data, onInteraction }: TemplateProps) {
    const [viewState, setViewState] = useState<"COVER" | "MAIN">("COVER");

    const handleOpen = () => {
        setViewState("MAIN");
        onInteraction?.("OPENED");
    }

    return (
        <div className="relative w-full h-full bg-slate-50 overflow-hidden font-sans">
            <AnimatePresence mode="wait">
                {viewState === "COVER" ? (
                    <motion.div
                        key="cover"
                        exit={{ x: "-100%", transition: { duration: 0.5 } }}
                        className="absolute inset-0 z-20"
                    >
                        <CoverView title={data.eventTitle} onOpen={handleOpen} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="main"
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        className="absolute inset-0 z-10"
                    >
                        <MainView
                            data={data}
                            onOpenSheet={() => { }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
