"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password) return;
    setLoading(true);
    setError("");
    const err = await login(username.trim(), password);
    setLoading(false);
    if (err) setError(err);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mb-4 shadow-[0_8px_30px_-4px_rgba(0,0,0,0.25)]">
            <span className="text-white font-serif italic text-2xl leading-none">S</span>
          </div>
          <h1 className="text-2xl font-light tracking-tight text-black">SKNAT</h1>
          <p className="text-xs text-neutral-400 tracking-[0.2em] uppercase mt-1">
            ระบบจัดการอสังหาริมทรัพย์
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-neutral-100 rounded-3xl p-8 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.06)]">
          <h2 className="text-sm font-semibold text-black tracking-wide uppercase mb-6">
            เข้าสู่ระบบ
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                ชื่อผู้ใช้
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                placeholder="กรอกชื่อผู้ใช้"
                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-300 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                รหัสผ่าน
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="กรอกรหัสผ่าน"
                  className="w-full px-4 py-3 pr-11 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-300 transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-3.5 text-neutral-400 hover:text-black transition-colors"
                >
                  {showPass ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-2xl">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-black text-white text-sm font-medium rounded-2xl hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>กำลังเข้าสู่ระบบ...</span>
                </>
              ) : (
                "เข้าสู่ระบบ"
              )}
            </button>
          </form>
        </div>

        {/* Hint */}
        <div className="mt-6 bg-white border border-neutral-100 rounded-2xl p-4 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">บัญชีทดสอบ</p>
          <div className="space-y-1 text-xs text-neutral-500">
            <div className="flex justify-between">
              <span>Admin:</span>
              <span className="font-mono text-black">admin / admin123</span>
            </div>
            <div className="flex justify-between">
              <span>Seller:</span>
              <span className="font-mono text-black">seller / seller123</span>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-neutral-300 mt-6">
          SKNAT Real Estate © 2026
        </p>
      </div>
    </div>
  );
}
