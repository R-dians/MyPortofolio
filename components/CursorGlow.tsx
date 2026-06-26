"use client";

import { useEffect, useRef } from "react";

export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("CursorGlow component mounted successfully.");

    const handleMouseMove = (e: MouseEvent) => {
      if (glowRef.current) {
        // Update koordinat secara realtime menggunakan transform
        glowRef.current.style.transform = `translate3d(${e.clientX - 250}px, ${e.clientY - 250}px, 0)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed top-0 left-0 z-[-1] w-[500px] h-[500px] rounded-full blur-2xl opacity-100 transition-opacity duration-500 will-change-transform"
      style={{
        background: "var(--cursor-glow)",
        transform: "translate3d(-1000px, -1000px, 0)", // Mulai di luar layar agar tidak flash saat load
      }}
    />
  );
}
