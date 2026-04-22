'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/auth-store";

const inputCls =
  'w-full bg-transparent border-b border-[#d8d2ca] pb-2.5 pt-1 text-sm text-[#171717] placeholder-[#bbb] focus:outline-none focus:border-[#171717] transition-colors duration-200';

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col gap-1 py-4 border-b border-[#e8e4df] last:border-0">
      <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[rgba(10,10,10,0.42)]">
        {label}
      </span>
      <span className="text-sm text-[#171717]">
        {value || <span className="text-[#bbb]">—</span>}
      </span>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="py-4 border-b border-[#e8e4df] last:border-0">
      <label className="block text-[10px] font-semibold uppercase tracking-[0.28em] text-[rgba(10,10,10,0.42)] mb-2.5">
        {label}
      </label>
      {children}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, hasHydrated, logout, login } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ fullName: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hasHydrated && !user) {
      router.replace('/login?next=/profile');
    }
  }, [user, hasHydrated, router]);

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName ?? '',
        email: user.email ?? '',
        phone: user.phone ?? '',
      });
    }
  }, [user]);

  if (!hasHydrated || !user) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="w-5 h-5 border border-[#171717] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message ?? 'บันทึกไม่สำเร็จ'); return; }
      login(data);
      setEditing(false);
    } catch {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({ fullName: user.fullName ?? '', email: user.email ?? '', phone: user.phone ?? '' });
    setError('');
    setEditing(false);
  };

  const roleLabel: Record<string, string> = {
    admin: 'ผู้ดูแลระบบ',
    seller: 'ผู้ขาย',
    member: 'สมาชิก',
  };

  const joinedDate = new Date(user.createdAt).toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-[#faf9f7] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-7">
        <Link
          href="/"
          className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#555] hover:text-[#0a0a0a] transition flex items-center gap-2"
        >
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
          {/* Avatar + name */}
          <div className="mb-10 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center bg-[#0a0a0a] text-white text-2xl font-light uppercase">
              {user.username.charAt(0)}
            </div>
            <h1 className="text-[2rem] font-light tracking-[-0.04em] text-[#171717] mb-1">
              {user.fullName ?? user.username}
            </h1>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-[rgba(10,10,10,0.42)]">
              {roleLabel[user.role] ?? user.role}
            </p>
          </div>

          {/* Info / Edit */}
          {editing ? (
            <form onSubmit={handleSave} noValidate>
              <div className="mb-8 border-t border-[#e8e4df]">
                <Field label="ชื่อ-นามสกุล">
                  <input
                    type="text"
                    placeholder="ชื่อ-นามสกุล"
                    value={form.fullName}
                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                    disabled={loading}
                    className={inputCls}
                  />
                </Field>
                <Field label="อีเมล">
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    disabled={loading}
                    className={inputCls}
                  />
                </Field>
                <Field label="เบอร์โทรศัพท์">
                  <input
                    type="tel"
                    placeholder="08X-XXX-XXXX"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    disabled={loading}
                    className={inputCls}
                  />
                </Field>
              </div>
              {error && (
                <p className="mb-4 text-xs text-[#c0392b] border-l-2 border-[#c0392b] pl-3 py-0.5">{error}</p>
              )}
              <div className="flex gap-3 mb-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-[#0a0a0a] py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#222] disabled:opacity-40"
                >
                  {loading ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 border border-[#0a0a0a] py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#0a0a0a] transition hover:bg-[#f0ede8] disabled:opacity-40"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="mb-8 border-t border-[#e8e4df]">
                <InfoRow label="Username" value={user.username} />
                <InfoRow label="ชื่อ-นามสกุล" value={user.fullName} />
                <InfoRow label="อีเมล" value={user.email} />
                <InfoRow label="เบอร์โทรศัพท์" value={user.phone} />
                <InfoRow label="สมาชิกตั้งแต่" value={joinedDate} />
              </div>
              <button
                onClick={() => setEditing(true)}
                className="w-full bg-[#0a0a0a] py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-white transition hover:bg-[#222] mb-3"
              >
                แก้ไขข้อมูล
              </button>
            </>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full border border-[#0a0a0a] py-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#0a0a0a] transition hover:bg-[#0a0a0a] hover:text-white"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>
    </div>
  );
}
