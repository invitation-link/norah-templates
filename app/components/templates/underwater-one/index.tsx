"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import { useState } from "react";
import type { TemplateProps } from "../types";
import styles from "./Underwater.module.css";

export default function UnderwaterOne({ data, onInteraction }: TemplateProps) {
  const [dived, setDived] = useState(false);
  return <div className={styles.ocean}>
    <Image src={data.coverImage || "/images/templates/live/underwater-one.png"} alt="" fill priority className={styles.backdrop} />
    <div className={styles.blue} />
    {[0,1,2,3,4,5].map((bubble) => <i key={bubble} className={styles.bubble} style={{ left: `${12 + bubble * 15}%`, animationDelay: `${bubble * .6}s` }} />)}
    {!dived ? <motion.section className={styles.intro} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <small>A little wonder is turning one</small><h1>{data.eventTitle}</h1><p>{data.openingLine || "Dive into a day filled with tiny waves and enormous joy."}</p>
      <button type="button" onClick={() => { setDived(true); onInteraction?.("OPENED"); }}>Dive into the celebration</button>
    </motion.section> : <motion.section className={styles.card} initial={{ opacity: 0, y: 35 }} animate={{ opacity: 1, y: 0 }}>
      <small>Under the sea</small><h1>{data.eventTitle}</h1><p>{data.message}</p>
      <div><CalendarDays /><span>{new Date(data.eventDate).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}</span></div>
      <div><MapPin /><span>{data.venueName}<em>{data.venueAddress}</em></span></div>
      <strong>{data.closingMessage}</strong>
    </motion.section>}
  </div>;
}
