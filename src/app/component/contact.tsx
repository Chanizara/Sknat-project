'use client';

import { useEffect, useRef, useState } from 'react';

export default function Contact() {
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
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ background: '#f0ebe3' }}
    >
      <div className="container mx-auto px-6 md:px-10 py-28 md:py-36">
        <div className="flex flex-col lg:flex-row items-center gap-16">

          {/* Left content */}
          <div
            className="flex-1 transition-all duration-1000"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
            }}
          >
            <p
              className="mb-6 flex items-center gap-2 text-[11px] uppercase tracking-[0.4em]"
              style={{ color: 'rgba(10,10,10,0.45)' }}
            >
              <span>◆</span> WHERE VISION MEETS EXECUTION
            </p>

            <h2
              className="font-light leading-tight text-[#0a0a0a] mb-10"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.75rem)', maxWidth: '560px' }}
            >
              เริ่มต้นทุกการลงทุน<br />
              ด้วยความเข้าใจ<br />
              ที่ถูกต้อง
            </h2>

            <div className="flex flex-wrap gap-4">
              <a
                href="#about"
                className="inline-flex items-center gap-3 bg-[#0a0a0a] text-white px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] transition-all duration-200 hover:bg-[#1a40b6]"
              >
                <span style={{ fontFamily: 'monospace' }}>↳</span> เกี่ยวกับเรา
              </a>
              <button
                onClick={scrollToContact}
                className="inline-flex items-center gap-3 bg-transparent text-[#0a0a0a] px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.25em] transition-all duration-200 hover:bg-[#0a0a0a]/5"
                style={{ border: '1px solid rgba(10,10,10,0.3)' }}
              >
                <span style={{ fontFamily: 'monospace' }}>↳</span> ติดต่อเรา
              </button>
            </div>
          </div>

          {/* Right geometric wireframe */}
          <div
            className="flex-1 flex items-center justify-center transition-all duration-1000"
            style={{
              opacity: isVisible ? 0.55 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(32px)',
              transitionDelay: '250ms',
            }}
          >
            <WireframeBox />
          </div>
        </div>
      </div>
    </section>
  );
}

function WireframeBox() {
  return (
    <svg
      viewBox="0 0 480 380"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full max-w-[420px]"
    >
      {/* Back face */}
      <rect x="180" y="40" width="260" height="200" stroke="#0a0a0a" strokeWidth="0.8" />
      {/* Front face */}
      <rect x="40" y="140" width="260" height="200" stroke="#0a0a0a" strokeWidth="0.8" />
      {/* Connecting edges: top-left */}
      <line x1="40" y1="140" x2="180" y2="40" stroke="#0a0a0a" strokeWidth="0.8" />
      {/* top-right */}
      <line x1="300" y1="140" x2="440" y2="40" stroke="#0a0a0a" strokeWidth="0.8" />
      {/* bottom-right */}
      <line x1="300" y1="340" x2="440" y2="240" stroke="#0a0a0a" strokeWidth="0.8" />
      {/* bottom-left (hidden edge, dashed) */}
      <line x1="40" y1="340" x2="180" y2="240" stroke="#0a0a0a" strokeWidth="0.8" strokeDasharray="4 4" />
      {/* Inner diagonal accent line */}
      <line x1="180" y1="40" x2="300" y2="340" stroke="#0a0a0a" strokeWidth="0.4" strokeDasharray="6 6" />
    </svg>
  );
}
