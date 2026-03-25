"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// ─── Replace with your own YouTube video ID ───────────────────────────────────
// To find the ID: youtube.com/watch?v=VIDEO_ID_HERE
const YOUTUBE_VIDEO_ID = "dqZVFKpRfXA";
// ──────────────────────────────────────────────────────────────────────────────

export default function VideoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Video frame: starts boxed in center, expands to full bleed
  const frameWidth  = useTransform(scrollYProgress, [0, 0.65], ["70%", "100%"]);
  const frameHeight = useTransform(scrollYProgress, [0, 0.65], ["56vh",  "100vh"]);

  // Text fades out as video fills screen
  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const textY       = useTransform(scrollYProgress, [0, 0.4],  [0, -40]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "220vh", background: "#111111" }}
    >
      {/* Sticky viewport */}
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ background: "#111111" }}
      >
        {/* Top-left label — fluid.glass style */}
        <motion.p
          style={{ opacity: textOpacity }}
          className="absolute top-8 left-8 z-20 text-[10px] tracking-[0.45em] uppercase text-white/30"
        >
          ✦ SHOWROOM
        </motion.p>

        {/* Expanding video frame — sharp corners */}
        <motion.div
          style={{ width: frameWidth, height: frameHeight }}
          className="absolute overflow-hidden"
        >
          <iframe
            src={`https://www.youtube.com/embed/${YOUTUBE_VIDEO_ID}?autoplay=1&mute=1&loop=1&playlist=${YOUTUBE_VIDEO_ID}&controls=0&rel=0&playsinline=1&disablekb=1&modestbranding=1`}
            title="SKNAT Luxury Property"
            allow="autoplay; fullscreen"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{
              width: "calc(100% + 4px)",
              height: "calc(100% + 4px)",
              top: "-2px",
              left: "-2px",
              border: "none",
              transform: "scale(1.04)",
            }}
          />
          {/* Fallback image shown before YouTube loads */}
          <div
            className="absolute inset-0 -z-10"
            style={{
              backgroundImage: "url('/hero_2.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Subtle overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(17,17,17,0.2) 0%, transparent 30%, rgba(17,17,17,0.4) 100%)",
            }}
          />
        </motion.div>

        {/* Bottom-left headline — fluid.glass style */}
        <motion.div
          style={{ y: textY, opacity: textOpacity }}
          className="absolute bottom-14 left-12 z-20 max-w-lg"
        >
          <p className="mb-3 text-[9px] tracking-[0.45em] uppercase text-white/35">
            SKNAT LUXURY VILLAS
          </p>
          <h2 className="text-4xl font-extralight leading-[1.15] text-white md:text-5xl">
            สถานที่ที่ความหรูหรา<br />
            <span className="font-semibold">พบกับความสมบูรณ์แบบ</span>
          </h2>
        </motion.div>

        {/* Bottom-right info — fluid.glass style */}
        <motion.div
          style={{ opacity: textOpacity }}
          className="absolute bottom-14 right-12 z-20 text-right"
        >
          <p className="text-[9px] tracking-[0.4em] uppercase text-white/30 mb-2">CONTACT</p>
          <p className="text-sm text-white/55 font-light leading-relaxed">
            089-999-9999<br />
            hello@sknat.co.th
          </p>
          <a
            href="https://line.me/R/ti/p/@sknat"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 border border-white/20 px-5 py-2 text-[11px] tracking-[0.2em] uppercase text-white/55 transition hover:text-white hover:border-white/40"
          >
            <span style={{ fontFamily: "monospace" }}>↳</span>
            CONSULT NOW
          </a>
        </motion.div>
      </div>
    </section>
  );
}
