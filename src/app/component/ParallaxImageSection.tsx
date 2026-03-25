"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ParallaxImageSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Frame expands to full-bleed by 50% of scroll — holds full-screen for remaining 50%
  const frameWidth  = useTransform(scrollYProgress, [0, 0.50], ["64%", "100%"]);
  const frameHeight = useTransform(scrollYProgress, [0, 0.50], ["62vh",  "100vh"]);

  // Inner video subtle parallax
  const videoY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  // Line draws in from left as user scrolls — fully drawn by the time frame fills screen
  const lineScaleX = useTransform(scrollYProgress, [0.03, 0.48], [0, 1]);

  // Text stays fully visible until very end (video has been full-screen for a while already)
  const textOpacity = useTransform(scrollYProgress, [0.83, 0.97], [1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative"
      style={{ height: "480vh", background: "#0d0d0d" }}
    >
      {/* Sticky viewport */}
      <div
        className="sticky top-0 h-screen overflow-hidden flex items-center justify-center"
        style={{ background: "#0d0d0d" }}
      >

        {/* Expanding video frame */}
        <motion.div
          style={{ width: frameWidth, height: frameHeight }}
          className="absolute overflow-hidden"
        >
          <motion.div
            style={{ y: videoY, scale: 1.1 }}
            className="absolute inset-0"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            >
              <source src="/video.mp4" type="video/mp4" />
            </video>
          </motion.div>

          {/* Soft vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.08) 0%, transparent 45%, rgba(0,0,0,0.38) 100%)",
            }}
          />
        </motion.div>

        {/* Horizontal rule — draws in from left as user scrolls */}
        <motion.div
          className="absolute left-0 right-0 z-20 h-px origin-left"
          style={{
            top: "40%",
            background: "rgba(255,255,255,0.20)",
            scaleX: lineScaleX,
            transformOrigin: "0% 50%",
          }}
        />

        {/* Top-left label */}
        <motion.p
          className="absolute top-8 left-10 z-20 text-[10px] tracking-[0.5em] uppercase"
          style={{
            color: "rgba(255,255,255,0.28)",
            opacity: textOpacity,
          }}
        >
          ✦ LUXURY LIFESTYLE
        </motion.p>

        {/* Bottom-left headline — stays visible through entire scroll */}
        <motion.div
          className="absolute bottom-16 left-10 z-20 max-w-xl"
          style={{ opacity: textOpacity }}
        >
          <p
            className="mb-4 text-[9px] tracking-[0.5em] uppercase"
            style={{ color: "rgba(255,255,255,0.30)" }}
          >
            SKNAT LUXURY PROPERTIES
          </p>
          <h2
            className="text-4xl font-extralight leading-[1.18] md:text-5xl lg:text-6xl"
            style={{ color: "rgba(255,255,255,0.90)" }}
          >
            พื้นที่ที่บ่งบอก
            <br />
            <span className="font-semibold">ตัวตนของคุณ</span>
          </h2>
        </motion.div>

        {/* Right: address + CTA — below the rule line */}
        <motion.div
          className="absolute right-10 z-20 text-right"
          style={{
            top: "calc(40% + 2.5rem)",
            opacity: textOpacity,
          }}
        >
          <p
            className="mb-2 text-[9px] font-semibold uppercase tracking-[0.4em]"
            style={{ color: "rgba(255,255,255,0.28)" }}
          >
            ที่อยู่ &amp; ติดต่อ
          </p>
          <p
            className="text-sm font-light leading-relaxed"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
            กรุงเทพมหานคร ประเทศไทย
            <br />
            จ–ส · 09:00–18:00
          </p>
          <a
            href="https://line.me/R/ti/p/@sknat"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2.5 text-[10px] font-semibold tracking-[0.28em] uppercase transition-all"
            style={{
              border: "1px solid rgba(255,255,255,0.30)",
              padding: "10px 20px",
              color: "rgba(255,255,255,0.70)",
              background: "rgba(255,255,255,0.06)",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = "#fff";
              (e.currentTarget as HTMLElement).style.color = "#000";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.70)";
            }}
          >
            <span style={{ fontFamily: "monospace" }}>↳</span>
            LINE @SKNAT
          </a>
        </motion.div>

      </div>
    </section>
  );
}
