"use client";

import { useEffect, useRef, useState } from "react";

const services = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        />
      </svg>
    ),
    title: "ซื้อ-ขาย บ้านและคอนโด",
    description:
      "บริการรับฝากขายและค้นหาทรัพย์ที่ตรงตามความต้องการ ด้วยการประเมินราคาที่เป็นธรรม",
    features: ["ประเมินราคาฟรี", "การันตีความปลอดภัย", "ดูแลครบวงจร"],
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    title: "เช่าและบริหารทรัพย์",
    description:
      "บริหารจัดการอสังหาฯ ให้เช่า พร้อมดูแลทรัพย์สินแบบครบวงจร สร้างรายได้ต่อเนื่อง",
    features: ["หาผู้เช่าเอง", "บริหารทรัพย์", "รายงานประจำเดือน"],
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
    title: "ที่ปรึกษาสินเชื่อ",
    description:
      "ให้คำปรึกษาและแนะนำแหล่งสินเชื่อที่เหมาะสม ช่วยให้คุณได้รับอัตราดอกเบี้ยที่ดีที่สุด",
    features: ["เปรียบเทียบสินเชื่อ", "จัดเอกสาร", "เจรจาธนาคาร"],
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
        />
      </svg>
    ),
    title: "ลงทุนอสังหาฯ",
    description:
      "แนะนำโอกาสการลงทุนในอสังหาฯ ที่มีศักยภาพ วิเคราะห์ผลตอบแทนและความเสี่ยง",
    features: ["วิเคราะห์ตลาด", "จัดพอร์ตลงทุน", "ติดตามผล"],
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    title: "ถ่ายภาพและตกแต่ง",
    description:
      "บริการถ่ายภาพมืออาชีพและ staging เพื่อเพิ่มมูลค่าและโอกาสในการขายทรัพย์",
    features: ["ถ่ายภาพมืออาชีพ", "Home Staging", "Virtual Tour"],
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
        />
      </svg>
    ),
    title: "ตรวจสอบกฎหมาย",
    description:
      "ตรวจสอบเอกสารสิทธิ์และดำเนินการทางกฎหมายครบวงจร มั่นใจทุกขั้นตอนการซื้อขาย",
    features: ["ตรวจเอกสาร", "โอนกรรมสิทธิ์", "จดจำนอง"],
  },
];

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#e2e8f0_0%,#f1f5f9_100%)] py-24 md:py-32"
    >
      {/* Decorative Elements */}
      <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />
      <div className="pointer-events-none absolute right-0 bottom-0 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[400px] bg-[linear-gradient(180deg,rgba(255,255,255,0.6)_0%,rgba(255,255,255,0)_100%)]" />

      <div className="container relative mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div
          className={`mb-16 text-center transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="text-[11px] uppercase tracking-[0.3em] text-slate-500">
            Our Services
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
            บริการครบวงจรของเรา
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            เราพร้อมดูแลและตอบโจทย์ทุกความต้องการด้านอสังหาริมทรัพย์ของคุณ
            ด้วยทีมงานมืออาชีพและประสบการณ์กว่าทศวรรษ
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group relative overflow-hidden rounded-[2rem] bg-white/70 p-8 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.2)] backdrop-blur-xl transition-all duration-700 hover:-translate-y-2 hover:bg-white/90 hover:shadow-[0_30px_60px_-24px_rgba(15,23,42,0.35)] ${
                isVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-12 opacity-0"
              }`}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              {/* Icon */}
              <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                {service.icon}
              </div>

              {/* Content */}
              <h3 className="mb-3 text-xl font-semibold text-slate-950">
                {service.title}
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-slate-600">
                {service.description}
              </p>

              {/* Features Tags */}
              <div className="flex flex-wrap gap-2">
                {service.features.map((feature, featureIndex) => (
                  <span
                    key={featureIndex}
                    className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-medium text-slate-600 transition-colors group-hover:bg-slate-200"
                  >
                    {feature}
                  </span>
                ))}
              </div>

              {/* Hover Arrow */}
              <div className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-400 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:bg-slate-950 group-hover:text-white">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </div>

              {/* Gradient Border Effect */}
              <div className="absolute inset-0 rounded-[2rem] border border-white/50 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className={`mt-16 text-center transition-all duration-1000 delay-700 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="mb-4 text-slate-500">
            ต้องการคำปรึกษาเพิ่มเติม?
          </p>
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
            className="group inline-flex items-center gap-3 rounded-full bg-slate-950 px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-slate-800 hover:shadow-xl"
          >
            ติดต่อเรา
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
    </section>
  );
}
