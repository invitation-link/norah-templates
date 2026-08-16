"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LoginModal } from "@/app/components/ui/LoginModal";

export default function LoginPage() {
  const router = useRouter();
  const [next, setNext] = useState("/dashboard");
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("next") || "/dashboard";
    setNext(requested.startsWith("/") && !requested.startsWith("//") ? requested : "/dashboard");
  }, []);
  return <main style={{ minHeight: "100svh", background: "#071a38" }}><LoginModal isOpen onClose={() => router.replace("/")} redirectTo={next} /></main>;
}
