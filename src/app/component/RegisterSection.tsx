'use client';

import { useEffect, useRef, useState } from 'react';

type FormState = { firstName: string; lastName: string; phone: string; email: string };
const emptyForm: FormState = { firstName: '', lastName: '', phone: '', email: '' };

export default function RegisterSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      const section = sectionRef.current;
      if (!section) return;
      if (section.getBoundingClientRect().top < window.innerHeight * 0.92) setVisible(true);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`.trim();
    if (!form.firstName.trim() || !form.lastName.trim()) {
      setError('กรุณากรอกชื่อและนามสกุล');
      return;
    }
    if (!form.phone.trim()) {
      setError('กรุณากรอกเบอร์โทรศัพท์');
      return;
    }
    if (!form.email.trim()) {
      setError('กรุณากรอกอีเมล');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone: form.phone.trim(), email: form.email.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่');
        return;
      }

      setSuccess(true);
      setForm(emptyForm);
    } catch {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="register"
      className="relative z-30 bg-white overflow-hidden"
    >
      {/* Thin top rule */}
      <div className="mx-auto max-w-470 px-6 sm:px-8 md:px-12 xl:px-16">
        <div className="h-px bg-neutral-100" />
      </div>

      <div
        className="mx-auto max-w-470 px-6 sm:px-8 md:px-12 xl:px-16 py-20 md:py-28"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(22px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-start">

          {/* ── Left: editorial copy ─────────────────────────────── */}
          <div className="lg:sticky lg:top-32">
            <p className="mb-8 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.34em] text-[rgba(10,10,10,0.55)]">
              <span className="text-[12px]">◆</span>
              Membership
            </p>

            <h2
              className="font-light leading-tight text-[#171717] mb-8"
              style={{ fontSize: 'clamp(2.2rem, 3.6vw, 4.2rem)', letterSpacing: '-0.045em' }}
            >
              สมัครสมาชิก
              <br />
              เพื่อรับสิทธิพิเศษก่อนใคร
            </h2>

            <p className="text-sm leading-7 text-[#5f5a54] max-w-xs mb-10">
              รับข้อมูลอสังหาริมทรัพย์คัดสรรและโอกาส
              การลงทุนที่คุณจะไม่พบที่ไหน
              ส่งตรงถึงคุณก่อนเปิดตัวสู่สาธารณะ
            </p>

            {/* Three feature points */}
            <div className="space-y-5">
              {[
                { label: 'Early Access', desc: 'รับข้อมูลก่อนเปิดขายสู่สาธารณะ' },
                { label: 'Curated Listings', desc: 'คัดสรรเฉพาะอสังหาฯ คุณภาพสูง' },
                { label: 'Expert Guidance', desc: 'คำแนะนำจากผู้เชี่ยวชาญตัวต่อตัว' },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4">
                  <div className="mt-1 w-1 h-1 rounded-full bg-[#171717] shrink-0" />
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#171717] mb-0.5">{item.label}</p>
                    <p className="text-xs text-[#5f5a54] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: form ──────────────────────────────────────── */}
          <div className="lg:pr-16 xl:pr-24 lg:pt-16">
            {success ? (
              <div
                className="border border-neutral-100 px-8 py-12 "
                style={{ animation: 'fadeUp 0.6s ease forwards' }}
              >
                <div className="mb-6 w-10 h-10 border border-[#171717] flex items-center justify-center">
                  <svg className="w-4 h-4 text-[#171717]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-lg font-light text-[#171717] mb-2" style={{ letterSpacing: '-0.02em' }}>
                  ลงทะเบียนสำเร็จแล้ว
                </p>
                <p className="text-sm text-[#5f5a54] leading-relaxed mb-8">
                  ทีมงานจะติดต่อกลับหาคุณเร็ว ๆ นี้
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#171717] transition-opacity hover:opacity-40"
                >
                  <span style={{ fontFamily: 'monospace' }}>↳</span>
                  ลงทะเบียนอีกครั้ง
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>

                {/* Name row */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Field label="ชื่อ">
                    <input
                      type="text"
                      placeholder="ชื่อ"
                      value={form.firstName}
                      onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                      disabled={submitting}
                      className={inputCls}
                    />
                  </Field>
                  <Field label="นามสกุล">
                    <input
                      type="text"
                      placeholder="นามสกุล"
                      value={form.lastName}
                      onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                      disabled={submitting}
                      className={inputCls}
                    />
                  </Field>
                </div>

                {/* Phone */}
                <div className="mb-6">
                  <Field label="เบอร์โทรศัพท์">
                    <input
                      type="tel"
                      placeholder="08X-XXX-XXXX"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      disabled={submitting}
                      className={inputCls}
                    />
                  </Field>
                </div>

                {/* Email */}
                <div className="mb-8">
                  <Field label="อีเมล">
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      disabled={submitting}
                      className={inputCls}
                    />
                  </Field>
                </div>

                {/* Error */}
                {error && (
                  <p className="mb-6 text-xs text-[#5f5a54] border-l-2 border-[#171717] pl-4 py-1">
                    {error}
                  </p>
                )}

                {/* Divider */}
                <div className="h-px bg-neutral-100 mb-8" />

                {/* Submit + note */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-3 bg-[#111111] px-7 py-3.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#f7f2ec] transition-colors duration-200 hover:bg-[#202020] disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <span style={{ fontFamily: 'monospace' }}>↳</span>
                    {submitting ? 'กำลังส่ง...' : 'สมัครสมาชิก'}
                  </button>
                  <p className="text-[11px] text-[rgba(10,10,10,0.38)] leading-relaxed max-w-[18rem]">
                    ข้อมูลของคุณจะถูกเก็บรักษาอย่างปลอดภัย
                    และไม่เผยแพร่ต่อบุคคลภายนอก
                  </p>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>

      {/* Thin bottom rule */}
      <div className="mx-auto max-w-470 px-6 sm:px-8 md:px-12 xl:px-16">
        <div className="h-px bg-neutral-100" />
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}

const inputCls =
  'w-full bg-transparent border-b border-neutral-200 pb-2.5 pt-1 text-sm text-[#171717] placeholder-neutral-300 focus:outline-none focus:border-[#171717] transition-colors duration-200';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-[rgba(10,10,10,0.42)] mb-3">
        {label}
      </label>
      {children}
    </div>
  );
}
