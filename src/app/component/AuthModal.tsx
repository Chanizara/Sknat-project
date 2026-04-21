'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '@/lib/auth-store';

type Tab = 'login' | 'register';

interface AuthModalProps {
  open: boolean;
  defaultTab?: Tab;
  onClose: () => void;
}

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

export default function AuthModal({ open, defaultTab = 'login', onClose }: AuthModalProps) {
  const [tab, setTab] = useState<Tab>(defaultTab);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [regForm, setRegForm] = useState({ firstName: '', lastName: '', phone: '', email: '', username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const backdropRef = useRef<HTMLDivElement>(null);
  const { login } = useAuthStore();

  useEffect(() => {
    if (open) {
      setTab(defaultTab);
      setError('');
      setSuccess(false);
    }
  }, [open, defaultTab]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

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
      onClose();
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
      setSuccess(true);
      setTimeout(() => { setTab('login'); setSuccess(false); setRegForm({ firstName: '', lastName: '', phone: '', email: '', username: '', password: '' }); }, 1800);
    } catch {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          ref={backdropRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-md bg-white p-8 shadow-[0_32px_80px_-24px_rgba(0,0,0,0.32)]"
          >
            {/* Close */}
            <button
              onClick={onClose}
              className="absolute right-5 top-5 text-[#999] hover:text-[#0a0a0a] transition"
              aria-label="ปิด"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Tab switcher */}
            <div className="mb-8 flex gap-6 border-b border-[#ebebeb] pb-0">
              {(['login', 'register'] as Tab[]).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setError(''); }}
                  className={`pb-3 text-[11px] font-semibold uppercase tracking-[0.24em] transition-colors duration-200 ${
                    tab === t
                      ? 'border-b-2 border-[#0a0a0a] text-[#0a0a0a]'
                      : 'text-[#aaa] hover:text-[#555]'
                  }`}
                >
                  {t === 'login' ? 'เข้าสู่ระบบ' : 'สมัครสมาชิก'}
                </button>
              ))}
            </div>

            {/* Login form */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} noValidate className="space-y-5">
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
                {error && <p className="text-xs text-[#c0392b] border-l-2 border-[#c0392b] pl-3 py-0.5">{error}</p>}
                <div className="pt-2">
                  <button type="submit" disabled={loading}
                    className="w-full bg-[#0a0a0a] py-3.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#222] disabled:opacity-40">
                    {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                  </button>
                </div>
                <p className="text-center text-xs text-[#aaa]">
                  ยังไม่มีบัญชี?{' '}
                  <button type="button" onClick={() => setTab('register')} className="text-[#0a0a0a] underline underline-offset-2">
                    สมัครสมาชิก
                  </button>
                </p>
              </form>
            )}

            {/* Register form */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} noValidate className="space-y-4">
                {success ? (
                  <div className="flex flex-col items-center gap-3 py-6 text-center">
                    <div className="flex h-10 w-10 items-center justify-center border border-[#171717]">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm font-light text-[#171717]">สมัครสมาชิกสำเร็จ!</p>
                    <p className="text-xs text-[#888]">กำลังพาไปยังหน้าเข้าสู่ระบบ...</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-2 gap-3">
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
                      <input type="text" placeholder="username" value={regForm.username}
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
                    {error && <p className="text-xs text-[#c0392b] border-l-2 border-[#c0392b] pl-3 py-0.5">{error}</p>}
                    <div className="pt-1">
                      <button type="submit" disabled={loading}
                        className="w-full bg-[#0a0a0a] py-3.5 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#222] disabled:opacity-40">
                        {loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก'}
                      </button>
                    </div>
                    <p className="text-center text-xs text-[#aaa]">
                      มีบัญชีแล้ว?{' '}
                      <button type="button" onClick={() => setTab('login')} className="text-[#0a0a0a] underline underline-offset-2">
                        เข้าสู่ระบบ
                      </button>
                    </p>
                  </>
                )}
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
