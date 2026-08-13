"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TemplateProps } from "../types";
import CoverView from "./CoverView";
import MainView from "./MainView";
import DetailsSheet from "../ganishka-original/DetailsSheet"; // Reusing for now

export default function RoyalWeddingTemplate({ data, onInteraction }: TemplateProps) {
    const [viewState, setViewState] = useState<"COVER" | "MAIN">("COVER");
    const [showSheet, setShowSheet] = useState(false);

    const handleOpen = () => {
        setViewState("MAIN");
        onInteraction?.("OPENED");
    };

    return (
        <div className="relative w-full h-full bg-[#fff0f3] overflow-hidden font-serif">
            <AnimatePresence mode="wait">
                {viewState === "COVER" ? (
                    <motion.div
                        key="cover"
                        exit={{ opacity: 0, transition: { duration: 1 } }}
                        className="absolute inset-0 z-20"
                    >
                        <CoverView title={data.eventTitle} onOpen={handleOpen} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="main"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
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
