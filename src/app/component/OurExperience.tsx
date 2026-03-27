"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const experiences = [
  {
    src: "/rain1.jpg",
    label: "Residential",
    description:
      "Our residential portfolio spans high-end condominiums, luxury villas, and premium townhouses — each selected for its exceptional location and craftsmanship.",
  },
  { src: "/rain2.jpg", label: "Commercial" },
  { src: "/rain3.jpg", label: "Investment" },
  { src: "/rain4.jpg", label: "Consultation" },
];

function ParallaxImage({
  src,
  label,
  speed = 0.12,
}: {
  src: string;
  label: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}%`, `${speed * 100}%`]);

  return (
    <div ref={ref} className="relative overflow-hidden w-full h-full">
      <motion.div style={{ y }} className="absolute inset-[-15%] w-[130%] h-[130%]">
        <Image src={src} alt={label} fill className="object-cover" sizes="(max-width:768px) 100vw, 60vw" />
      </motion.div>
      {/* Label overlay */}
      <div className="absolute inset-0 bg-black/10" />
      <span
        className="absolute bottom-6 left-7 text-white font-light leading-none"
        style={{ fontSize: "clamp(1.5rem, 3vw, 2.6rem)", letterSpacing: "-0.03em" }}
      >
        {label}
      </span>
    </div>
  );
}

export default function OurExperience() {
  return (
    <section
      id="experience"
      className="relative bg-white pb-16 md:pb-24 mx-5 md:mx-10 border-t border-[#d4cdc6]"
      style={{ zIndex: 10 }}
    >
      <div className="mx-auto max-w-[1520px] px-5 md:px-10">

        {/* Section label */}
        <div className="pt-14 mb-16 flex items-center gap-2">
          <span className="text-[#5a5a5a]" style={{ fontSize: "0.7rem" }}>✦</span>
          <span className="text-[11px] uppercase tracking-[0.3em] text-[#5a5a5a]">
            Our Experience
          </span>
        </div>

        {/* ── Row 1: small portrait image left + text right ── */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16 items-start mb-20">

          {/* Image — small portrait */}
          <div className="relative aspect-4/5 w-full max-w-xs lg:max-w-none lg:col-span-3">
            <ParallaxImage src={experiences[0].src} label={experiences[0].label} speed={0.1} />
          </div>

          {/* Text */}
          <div className="flex flex-col gap-8 lg:col-span-4 lg:col-start-5 lg:pt-4">
            <p
              className="font-light leading-relaxed text-[#1a1a1a]"
              style={{ fontSize: "clamp(0.95rem, 1.6vw, 1.15rem)" }}
            >
              Our <strong className="font-semibold">experience portfolio</strong> is defined by
              exceptional craftsmanship, curated selection, and enduring market knowledge. Built
              for discerning buyers and investors with uncompromising vision.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-3 self-start bg-[#0f1214] px-7 py-4 text-[12px] font-semibold uppercase tracking-[0.22em] text-white transition hover:bg-[#20262b]"
            >
              <span style={{ fontFamily: "monospace" }}>↳</span>
              OUR STORY
            </Link>
          </div>
        </div>

        {/* ── Row 2: fluid.glass-style staggered portrait layout ── */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-12 md:pb-40">

          {/* Image 1 — center, top anchor */}
          <div className="relative aspect-[4/5] md:col-start-4 md:col-span-3 md:row-start-1">
            <ParallaxImage src={experiences[1].src} label={experiences[1].label} speed={0.14} />
          </div>

          {/* Image 2 — far right, drops way down */}
          <div className="relative aspect-[4/5] md:col-start-10 md:col-span-3 md:row-start-1 md:mt-[19rem]">
            <ParallaxImage src={experiences[2].src} label={experiences[2].label} speed={0.08} />
          </div>

          {/* Image 3 — far left, moderate drop */}
          <div className="relative aspect-[4/5] md:col-start-1 md:col-span-3 md:row-start-1 md:mt-[8rem]">
            <ParallaxImage src={experiences[3].src} label={experiences[3].label} speed={0.12} />
          </div>

        </div>

      </div>
    </section>
  );
}
