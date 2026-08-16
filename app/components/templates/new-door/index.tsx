"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { CalendarDays, MapPin } from "lucide-react";
import { useState } from "react";
import type { TemplateProps } from "../types";
import styles from "./NewDoor.module.css";

export default function NewDoor({ data, onInteraction }: TemplateProps) {
  const [open, setOpen] = useState(false);
  return <div className={styles.scene}>
    <Image src={data.coverImage || "/images/templates/live/norah-housewarming.png"} alt="" fill priority className={styles.backdrop} />
    <div className={styles.shade} />
    {!open ? <div className={styles.threshold}>
      <small>A new beginning</small><h1>{data.eventTitle}</h1><p>{data.openingLine || "A door opens. A story begins."}</p>
      <button type="button" onClick={() => { setOpen(true); onInteraction?.("OPENED"); }}><span>Open the door</span></button>
    </div> : <motion.section className={styles.details} initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }}>
      <small>With warmth and gratitude</small><h1>{data.eventTitle}</h1><p>{data.message}</p>
      <div><CalendarDays /><span>{new Date(data.eventDate).toLocaleString("en-IN", { dateStyle: "long", timeStyle: "short" })}</span></div>
      <div><MapPin /><span>{data.venueName}<em>{data.venueAddress}</em></span></div>
      <p className={styles.closing}>{data.closingMessage}</p>
    </motion.section>}
  </div>;
}
