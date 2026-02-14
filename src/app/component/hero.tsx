"use client";

import { useEffect, useState } from "react";


const images = [
  "/hero_1.jpg",
  "/hero_2.jpg",
  "/hero_3.jpg",
];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[100vh] w-full overflow-hidden">

      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt="Nike Hero"
          className={`
            absolute inset-0 w-full h-full object-cover
            transition-opacity duration-[2000ms] ease-in-out
            ${i === index ? "opacity-100" : "opacity-0"}
          `}
        />
      ))}

      {/* soft overlay (optional แต่ช่วยให้ดูแพง) */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/20" />

      {/* Slide Indicator */}
        <div
        className="
            absolute
            right-12
            bottom-16
            z-50
            flex flex-col items-center
            text-white/80
            text-xs
            tracking-widest
        "
        >
        {/* Current / Total */}
        <span>
            {(index + 1).toString().padStart(2, "0")}
        </span>

        {/* Line */}
        <div className="h-10 w-px bg-white/40 my-2" />

        <span>
            {images.length.toString().padStart(2, "0")}
        </span>
        </div>

    </section>
  );
}
