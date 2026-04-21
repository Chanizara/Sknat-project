'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

type Tab = 'login' | 'register';

const inputCls =
  'w-full bg-transparent border-b border-[#d8d2ca] pb-2.5 pt-1 text-sm text-[#171717] placeholder-[#bbb] focus:outline-none focus:border-[#171717] transition-colors duration-200';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-[rgba(10,10,10,0.42)] mb-2.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') ?? '/';
  const { login, user } = useAuthStore();
  const [tab, setTab] = useState<Tab>('login');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [regForm, setRegForm] = useState({ firstName: '', lastName: '', phone: '', email: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [regSuccess, setRegSuccess] = useState(false);

  useEffect(() => {
    if (user) router.replace(nextPath);
  }, [user, router, nextPath]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!loginForm.username.trim() || !loginForm.password.trim()) {
      setError('กรุณากรอก username และ password');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginForm.username.trim(), password: loginForm.password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message ?? 'เข้าสู่ระบบไม่สำเร็จ'); return; }
      login(data);
      router.push(nextPath);
    } catch {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!regForm.firstName.trim() || !regForm.lastName.trim()) { setError('กรุณากรอกชื่อและนามสกุล'); return; }
    if (!regForm.username.trim()) { setError('กรุณากรอก username'); return; }
    if (!regForm.password || regForm.password.length < 8) { setError('password ต้องมีอย่างน้อย 8 ตัวอักษร'); return; }
    if (!regForm.email.trim()) { setError('กรุณากรอกอีเมล'); return; }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regForm),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message ?? 'สมัครสมาชิกไม่สำเร็จ'); return; }
      setRegSuccess(true);
      setTimeout(() => {
        setTab('login');
        setRegSuccess(false);
        setRegForm({ firstName: '', lastName: '', phone: '', email: '', username: '', password: '' });
        setError('');
      }, 2000);
    } catch {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-7">
        <Link href="/" className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#555] hover:text-[#0a0a0a] transition flex items-center gap-2">
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          กลับหน้าหลัก
        </Link>
        <span className="text-sm font-medium tracking-[0.2em] uppercase text-[#171717]">SKNAT</span>
        <div className="w-24" />
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="mb-10 text-center">
            <h1 className="text-[2rem] font-light tracking-[-0.04em] text-[#171717] mb-2">
              {tab === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
            </h1>
            <p className="text-xs text-[#999]">
              {tab === 'login' ? 'เข้าสู่ระบบเพื่อรับสิทธิพิเศษและข้อมูลอสังหาฯ' : 'สร้างบัญชีเพื่อรับสิทธิพิเศษก่อนใคร'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="mb-8 flex gap-6 border-b border-[#e8e4df]">
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setError(''); }}
                className={`pb-3 text-[11px] font-semibold uppercase tracking-[0.24em] transition-colors duration-200 ${
                  tab === t
                    ? 'border-b-2 border-[#0a0a0a] text-[#0a0a0a] -mb-px'
                    : 'text-[#bbb] hover:text-[#666]'
                }`}
              >
                {t === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
              </button>
            ))}
          </div>

          {/* Login form */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} noValidate className="space-y-6">
              <Field label="Username">
                <input type="text" placeholder="username" value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  disabled={loading} className={inputCls} autoComplete="username" />
              </Field>
              <Field label="Password">
                <input type="password" placeholder="••••••••" value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  disabled={loading} className={inputCls} autoComplete="current-password" />
              </Field>
              {error && (
                <p className="text-xs text-[#c0392b] border-l-2 border-[#c0392b] pl-3 py-0.5">{error}</p>
              )}
              <div className="pt-2">
                <button type="submit" disabled={loading}
                  className="w-full bg-[#0a0a0a] py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#222] disabled:opacity-40">
                  {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                </button>
              </div>
              <p className="text-center text-xs text-[#aaa]">
                ยังไม่มีบัญชี?{' '}
                <button type="button" onClick={() => setTab('register')}
                  className="text-[#0a0a0a] underline underline-offset-2 hover:opacity-60 transition">
                  สมัครสมาชิก
                </button>
              </p>
            </form>
          )}

          {/* Register form */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} noValidate className="space-y-5">
              {regSuccess ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <div className="flex h-12 w-12 items-center justify-center border border-[#171717]">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-base font-light text-[#171717]">สมัครสมาชิกสำเร็จ!</p>
                  <p className="text-xs text-[#888]">กำลังพาไปยังหน้าเข้าสู่ระบบ...</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="ชื่อ">
                      <input type="text" placeholder="ชื่อ" value={regForm.firstName}
                        onChange={(e) => setRegForm({ ...regForm, firstName: e.target.value })}
                        disabled={loading} className={inputCls} />
                    </Field>
                    <Field label="นามสกุล">
                      <input type="text" placeholder="นามสกุล" value={regForm.lastName}
                        onChange={(e) => setRegForm({ ...regForm, lastName: e.target.value })}
                        disabled={loading} className={inputCls} />
                    </Field>
                  </div>
                  <Field label="Username">
                    <input type="text" placeholder="username สำหรับเข้าสู่ระบบ" value={regForm.username}
                      onChange={(e) => setRegForm({ ...regForm, username: e.target.value })}
                      disabled={loading} className={inputCls} autoComplete="username" />
                  </Field>
                  <Field label="Password">
                    <input type="password" placeholder="อย่างน้อย 8 ตัวอักษร" value={regForm.password}
                      onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                      disabled={loading} className={inputCls} autoComplete="new-password" />
                  </Field>
                  <Field label="เบอร์โทรศัพท์">
                    <input type="tel" placeholder="08X-XXX-XXXX" value={regForm.phone}
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      disabled={loading} className={inputCls} />
                  </Field>
                  <Field label="อีเมล">
                    <input type="email" placeholder="email@example.com" value={regForm.email}
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      disabled={loading} className={inputCls} />
                  </Field>
                  {error && (
                    <p className="text-xs text-[#c0392b] border-l-2 border-[#c0392b] pl-3 py-0.5">{error}</p>
                  )}
                  <div className="pt-1">
                    <button type="submit" disabled={loading}
                      className="w-full bg-[#0a0a0a] py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#222] disabled:opacity-40">
                      {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
                    </button>
                  </div>
                  <p className="text-center text-xs text-[#aaa]">
                    มีบัญชีแล้ว?{' '}
                    <button type="button" onClick={() => setTab('login')}
                      className="text-[#0a0a0a] underline underline-offset-2 hover:opacity-60 transition">
                      เข้าสู่ระบบ
                    </button>
                  </p>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
