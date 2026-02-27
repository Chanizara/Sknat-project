"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

const features = [
  {
    title: "ทีมงานมืออาชีพ",
    description: "ที่ปรึกษาด้านอสังหาฯ ประสบการณ์กว่า 10 ปี",
  },
  {
    title: "บริการครบวงจร",
    description: "ดูแลตั้งแต่การหาทรัพย์จนถึงโอนกรรมสิทธิ์",
  },
  {
    title: "คำปรึกษาสินเชื่อ",
    description: "ให้คำแนะนำด้านสินเชื่อฟรี ไม่มีค่าใช้จ่าย",
  },
];

const stats = [
  { value: 10, suffix: "+", label: "ปีประสบการณ์" },
  { value: 500, suffix: "+", label: "ทรัพย์สินจัดการ" },
  { value: 98, suffix: "%", label: "ลูกค้าพึงพอใจ" },
];

// Stagger delay between each stat (in ms)
const STAGGER_DELAY = 150;

// Easing function for smooth animation (easeOutExpo)
const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

function useCountUp(
  target: number,
  duration: number = 1500,
  delay: number = 0,
  start: boolean = false
): number {
  const [count, setCount] = useState(0);
  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!start) {
      setCount(0);
      return;
    }

    // Delay before starting the animation
    const delayTimeout = setTimeout(() => {
      const animate = (timestamp: number) => {
        if (!startTimeRef.current) {
          startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutExpo(progress);
        const currentCount = Math.floor(easedProgress * target);

        setCount(currentCount);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setCount(target);
        }
      };

      animationRef.current = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(delayTimeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      startTimeRef.current = null;
    };
  }, [target, duration, delay, start]);

  return count;
}

function AnimatedStat({
  value,
  suffix,
  label,
  index,
  start,
}: {
  value: number;
  suffix: string;
  label: string;
  index: number;
  start: boolean;
}) {
  const count = useCountUp(value, 1200, index * STAGGER_DELAY, start);

  return (
    <div className="text-center">
      <p className="text-2xl font-bold text-slate-950 md:text-3xl tabular-nums">
        {count}
        {suffix}
      </p>
      <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </p>
    </div>
  );
}

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [startCounting, setStartCounting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Start counting animation after a small delay for better visual effect
          setTimeout(() => setStartCounting(true), 300);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#f8fafc_0%,#f1f5f9_100%)] py-24 md:py-32"
    >
      {/* Decorative Elements */}
      <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-cyan-100/40 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-20 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />

      <div className="container relative mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div
          className={`mb-16 transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
            About SKNAT
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            เราคือผู้เชี่ยวชาญ
            <br />
            <span className="text-slate-600">ด้านอสังหาริมทรัพย์หรู</span>
          </h2>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left: Image Gallery */}
          <div
            className={`relative transition-all duration-1000 delay-200 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="relative">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-[2.5rem] shadow-[0_32px_64px_-24px_rgba(15,23,42,0.35)]">
                <div className="aspect-[4/5] relative">
                  <Image
                    src="/hero_1.jpg"
                    alt="SKNAT Luxury Property"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent" />
                </div>
              </div>

              {/* Floating Stats Card */}
              <div className="absolute -right-6 -bottom-8 rounded-2xl bg-white/90 p-6 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.4)] backdrop-blur-xl md:-right-12 md:p-8">
                <div className="flex gap-8">
                  {stats.map((stat, index) => (
                    <AnimatedStat
                      key={index}
                      value={stat.value}
                      suffix={stat.suffix}
                      label={stat.label}
                      index={index}
                      start={startCounting}
                    />
                  ))}
                </div>
              </div>

              {/* Decorative Frame */}
              <div className="absolute -left-4 -top-4 -z-10 h-full w-full rounded-[2.5rem] border border-slate-200" />
            </div>
          </div>

          {/* Right: Content */}
          <div
            className={`flex flex-col justify-center transition-all duration-1000 delay-400 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="space-y-8">
              {/* Description */}
              <div className="space-y-4">
                <p className="text-lg leading-relaxed text-slate-600">
                  SKNAT (สแกนัท) คือบริษัทตัวแทนอสังหาริมทรัพย์ชั้นนำ 
                  ที่มุ่งมั่นให้บริการด้วยความซื่อสัตย์และเป็นมืออาชีพ
                </p>
                <p className="leading-relaxed text-slate-500">
                  เราเชี่ยวชาญในการคัดสรรบ้านหรู พูลวิลล่า และบ้านพักตากอากาศ 
                  ที่ตอบโจทย์ไลฟ์สไตล์ของคุณ ด้วยประสบการณ์กว่าทศวรรษ 
                  เราพร้อมดูแลทุกขั้นตอนตั้งแต่การหาทรัพย์ที่ใช่ ไปจนถึงขั้นตอนการโอนกรรมสิทธิ์
                </p>
              </div>

              {/* Features */}
              <div className="space-y-5">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="group flex items-start gap-4 rounded-2xl bg-white/60 p-4 transition-all hover:bg-white/80 hover:shadow-lg"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white transition-transform group-hover:scale-110">
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {feature.title}
                      </h4>
                      <p className="mt-1 text-sm text-slate-500">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => {
                  const element = document.getElementById("contact");
                  if (element) {
                    const navbarHeight = 80;
                    const elementPosition =
                      element.getBoundingClientRect().top + window.scrollY;
                    const offsetPosition = elementPosition - navbarHeight;
                    window.scrollTo({
                      top: offsetPosition,
                      behavior: "smooth",
                    });
                  }
                }}
                className="group mt-4 inline-flex items-center gap-3 rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-950/20"
              >
                ปรึกษาเจ้าหน้าที่
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
