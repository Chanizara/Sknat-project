'use client';

import Link from "next/link";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  return (
    <>
      <section id="contact" className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100 py-20 md:py-28 text-slate-900">
        {/* Decorative background elements */}
        <div className="pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden">
          <div className="absolute -left-20 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-100/40 to-cyan-100/40 blur-3xl" />
          <div className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-gradient-to-br from-blue-100/50 to-indigo-100/40 blur-3xl" />
          <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-r from-slate-200/30 to-slate-300/20 blur-3xl" />
        </div>

        <div className="container relative mx-auto px-4 md:px-6">
          {/* Header */}
          <div className="mb-16 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 shadow-sm backdrop-blur-sm">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-600">พร้อมให้คำปรึกษา</span>
            </div>
            <h2 className="mt-6 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              ติดต่อที่ปรึกษาของเรา
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base text-slate-600 md:text-lg">
              บริการแบบ private consultation สำหรับบ้านหรู พร้อมตอบทุกคำถามผ่านช่องทางที่คุณสะดวก
            </p>
          </div>

          {/* Main Contact Cards */}
          <div className="mx-auto max-w-4xl">
            <div className="grid gap-6 md:grid-cols-2">
              {/* LINE Official */}
              <a 
                href="https://line.me/R/ti/p/@sknat" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#00B900] to-[#00A000] p-8 text-white shadow-xl shadow-emerald-900/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/20"
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl transition-all group-hover:scale-150" />
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                      <svg className="h-7 w-7 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596l-1.09.338c-.376.117-.376.655-.06.79l1.18.466c.39.154.634.53.634.939v.506c0 .566-.5.991-1.029.87l-2.478-.576a1.181 1.181 0 01-.885-1.142v-1.197c0-.432.24-.831.626-1.035l2.196-1.17c.326-.173.721-.164 1.039.024.317.188.5.528.5.89v.501h-.201zm-4.59 2.323c0 .344-.279.629-.631.629-.348 0-.629-.285-.629-.629V8.108c0-.345.281-.63.63-.63.349 0 .63.285.63.63v7.094zm-2.466-4.412h-1.875v3.067c0 .345-.282.63-.63.63-.35 0-.631-.285-.631-.63V8.108c0-.345.282-.63.63-.63h2.506c.348 0 .63.285.63.63 0 .345-.282.63-.63.63zm-4.473 0H2.527v1.125h1.354c.348 0 .629.285.629.63 0 .344-.281.629-.63.629H2.527v1.238c0 .345-.282.63-.63.63-.349 0-.63-.285-.63-.63V8.108c0-.345.281-.63.63-.63h2.386c.349 0 .63.285.63.63 0 .345-.281.63-.63.63zM12 2C6.477 2 2 5.579 2 10.003c0 4.198 3.655 7.699 8.452 8.363.329.045.774.102.889.234.098.111.078.287.061.401l-.146.879c-.043.252-.124.603.213.766.334.16.587-.104.847-.341l1.224-1.104c.16-.144.326-.202.523-.122.29.114 1.076.464 1.517.607C17.748 20.822 22 17.653 22 12.003 22 6.484 17.523 2 12 2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-emerald-100">แชทได้ทันที</p>
                      <h3 className="text-2xl font-bold">LINE Official</h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-emerald-50">
                    @sknat · ตอบเร็วภายใน 10 นาที
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold">
                    <span>คลิกเพื่อแชท</span>
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </a>

              {/* Phone Call */}
              <a 
                href="tel:0899999999"
                className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-white shadow-xl shadow-slate-900/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/30"
              >
                <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/5 blur-2xl transition-all group-hover:scale-150" />
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                      <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">โทรปรึกษา</p>
                      <h3 className="text-2xl font-bold">โทรหาเรา</h3>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-slate-300">
                    089-999-9999 · 02-123-4567
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold">
                    <span>กดโทรทันที</span>
                    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </a>
            </div>

            {/* Secondary Info Cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {/* Address */}
              <div className="rounded-2xl bg-white/70 p-6 backdrop-blur-sm shadow-sm transition-all hover:bg-white/90 hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className="mt-3 font-semibold text-slate-900">ที่อยู่</h4>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  123 อาคารสแกนัท ถนนสุขุมวิท<br />แขวงคลองตัน เขตคลองเตย กรุงเทพฯ 10110
                </p>
              </div>

              {/* Email */}
              <a href="mailto:hello@sknat.co.th" className="group rounded-2xl bg-white/70 p-6 backdrop-blur-sm shadow-sm transition-all hover:bg-white/90 hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-slate-200">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h4 className="mt-3 font-semibold text-slate-900">อีเมล</h4>
                <p className="mt-1 text-sm text-slate-600 group-hover:text-slate-900">hello@sknat.co.th</p>
              </a>

              {/* Business Hours */}
              <div className="rounded-2xl bg-white/70 p-6 backdrop-blur-sm shadow-sm transition-all hover:bg-white/90 hover:shadow-md">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="mt-3 font-semibold text-slate-900">เวลาทำการ</h4>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">
                  จันทร์ - เสาร์<br />09:00 - 18:00 น.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative overflow-hidden bg-slate-950 py-14 text-slate-300">
        <div className="pointer-events-none absolute -top-20 right-12 h-56 w-56 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="container relative mx-auto px-4 md:px-6">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.26em] text-slate-500">SKNAT</p>
              <h4 className="mt-2 text-2xl font-semibold text-white">Sknat Property</h4>
              <p className="mt-3 max-w-md text-sm text-slate-400">บริการอสังหาริมทรัพย์สำหรับผู้ที่ต้องการประสบการณ์หาบ้านที่เป็นระบบ โปร่งใส และพรีเมียม</p>
            </div>

            <div>
              <h5 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">เมนู</h5>
              <ul className="mt-3 space-y-2 text-sm">
                <li>
                  <button 
                    onClick={() => scrollToSection('home')}
                    className="transition hover:text-white bg-transparent border-none text-slate-300 cursor-pointer"
                  >
                    หน้าแรก
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('properties')}
                    className="transition hover:text-white bg-transparent border-none text-slate-300 cursor-pointer"
                  >
                    บ้านทั้งหมด
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => scrollToSection('contact')}
                    className="transition hover:text-white bg-transparent border-none text-slate-300 cursor-pointer"
                  >
                    ติดต่อเรา
                  </button>
                </li>
                <li>
                  <Link href="/admin/properties" className="transition hover:text-white">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-sm font-semibold uppercase tracking-[0.16em] text-white">เวลาทำการ</h5>
              <p className="mt-3 text-sm text-slate-400">จันทร์ - เสาร์ 09:00 - 18:00</p>
              <p className="mt-1 text-sm text-slate-400">โทร 02-123-4567</p>
            </div>
          </div>

          <div className="mt-10 border-t border-slate-800 pt-6 text-sm text-slate-500">
            <p>&copy; {new Date().getFullYear()} SKNAT Property. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}


