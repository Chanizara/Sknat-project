"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { emit } from "@/lib/socket";
import { useAuth } from "@/lib/auth";
import {
  ArrowLeftIcon,
  PlusIcon,
  SearchIcon,
  PhoneIcon,
  EmailIcon,
  MembersIcon,
  MoreIcon,
} from "../components/Icons";

interface Member {
  id: number;
  fullName: string;
  phone?: string;
  email?: string;
  status: "active" | "suspended";
  memberSince: string;
}

const emptyForm = { fullName: "", phone: "", email: "", status: "active" as "active" | "suspended" };

export default function MembersPage() {
  const { user } = useAuth();
  const isSeller = user?.role === "seller";
  const basePath = isSeller ? "/seller" : "/admin";
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadMembers = async () => {
    const payload = isSeller && user ? { sellerId: user.id } : {};
    const res = await emit<Member[]>("members:list", payload);
    if (res.ok && res.data) setMembers(res.data);
    setLoading(false);
  };

  useEffect(() => { if (user) loadMembers(); }, [user]);

  const filteredMembers = members.filter(
    (m) =>
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone?.includes(searchTerm)
  );

  const openAdd = () => {
    setEditingMember(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (m: Member) => {
    setEditingMember(m);
    setForm({ fullName: m.fullName, phone: m.phone ?? "", email: m.email ?? "", status: m.status });
    setFormError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setFormError("");
    let res;
    if (editingMember) {
      res = await emit<Member>("members:update", { id: editingMember.id, ...form, ...(isSeller && user ? { sellerId: user.id } : {}) });
    } else {
      res = await emit<Member>("members:create", { ...form, ...(isSeller && user ? { sellerId: user.id } : {}) });
    }
    setSaving(false);
    if (!res.ok) { setFormError(res.error ?? "เกิดข้อผิดพลาด"); return; }
    setShowModal(false);
    loadMembers();
  };

  const handleToggle = async (m: Member) => {
    const newStatus = m.status === "active" ? "suspended" : "active";
    await emit("members:update", { id: m.id, status: newStatus, ...(isSeller && user ? { sellerId: user.id } : {}) });
    setMembers((prev) => prev.map((x) => x.id === m.id ? { ...x, status: newStatus } : x));
  };

  const handleDelete = async (id: number) => {
    if (!confirm("ลบสมาชิกนี้?")) return;
    await emit("members:delete", { id, ...(isSeller && user ? { sellerId: user.id } : {}) });
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const inputClass = "w-full px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-300 transition-all";

  return (
    <div className="min-h-screen bg-white p-6 md:p-10 font-sans">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex items-start gap-4">
          <Link href={basePath} className="mt-1 p-2.5 text-neutral-400 hover:text-black hover:bg-neutral-50 border border-neutral-100 rounded-2xl transition-all">
            <ArrowLeftIcon className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-3xl font-light tracking-tight text-black mb-1">จัดการสมาชิก</h1>
            <p className="text-sm text-neutral-500 tracking-wide">สมัคร แก้ไข ค้นหา หรือระงับบัญชีลูกค้า</p>
          </div>
        </div>
        <button onClick={openAdd} className="px-5 py-2.5 bg-black text-white text-sm font-medium rounded-2xl hover:bg-neutral-800 transition-all flex items-center gap-2 self-start md:self-auto">
          <PlusIcon className="w-4 h-4" />
          <span>เพิ่มสมาชิก</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: "สมาชิกทั้งหมด", value: members.length, sub: "Registered clients" },
          { label: "บัญชีปกติ", value: members.filter(m => m.status === "active").length, sub: "Normal accounts" },
          { label: "บัญชีถูกระงับ", value: members.filter(m => m.status === "suspended").length, sub: "Suspended accounts" },
          { label: "ใหม่เดือนนี้", value: members.filter(m => new Date(m.memberSince).getMonth() === new Date().getMonth()).length, sub: "New this month" },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-neutral-100 p-6 rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
            <p className="text-neutral-500 text-xs tracking-wider uppercase mb-2">{s.label}</p>
            <p className="text-3xl font-light text-black tracking-tight mb-1">{loading ? "—" : s.value}</p>
            <p className="text-neutral-400 text-xs">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-5 mb-8 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input type="text" placeholder="ค้นหาด้วยชื่อ อีเมล หรือเบอร์โทร..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-neutral-300 transition-all" />
            <SearchIcon className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
          </div>
        </div>
      </div>

      {/* Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[0,1,2].map(i => <div key={i} className="h-56 bg-neutral-50 border border-neutral-100 rounded-3xl animate-pulse" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((m) => (
            <div key={m.id} className="group bg-white border border-neutral-100 rounded-3xl p-6 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-base font-semibold ${m.status === "active" ? "bg-black text-white" : "bg-neutral-100 text-neutral-400"}`}>
                      {m.fullName.charAt(0)}
                    </div>
                    {m.status === "active" && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />}
                  </div>
                  <div>
                    <h3 className="font-medium text-black text-sm">{m.fullName}</h3>
                    <span className={`inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full mt-1 ${
                      m.status === "active" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-amber-50 text-amber-600 border border-amber-100"
                    }`}>
                      <span className={`w-1 h-1 rounded-full ${m.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                      {m.status === "active" ? "บัญชีปกติ" : "บัญชีถูกระงับ"}
                    </span>
                  </div>
                </div>
                <button onClick={() => handleDelete(m.id)} className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                  <MoreIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                    <PhoneIcon className="w-3.5 h-3.5 text-neutral-500" />
                  </div>
                  <span className="text-neutral-600 text-xs">{m.phone ?? "—"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-center">
                    <EmailIcon className="w-3.5 h-3.5 text-neutral-500" />
                  </div>
                  <span className="text-neutral-600 text-xs truncate">{m.email ?? "—"}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100">
                <div className="text-xs text-neutral-400 mb-3">สมาชิก: {new Date(m.memberSince).toLocaleDateString("th-TH")}</div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(m)} className="flex-1 px-4 py-2.5 bg-neutral-50 border border-neutral-100 text-neutral-600 rounded-2xl text-sm font-medium hover:bg-neutral-100 transition-all">
                    แก้ไข
                  </button>
                  <button onClick={() => handleToggle(m)} className={`flex-1 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all border ${
                    m.status === "active" ? "bg-amber-50 border-amber-100 text-amber-600 hover:bg-amber-100" : "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-100"
                  }`}>
                    {m.status === "active" ? "ระงับบัญชี" : "คืนสถานะบัญชี"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filteredMembers.length === 0 && (
        <div className="text-center py-16">
          <div className="w-16 h-16 bg-neutral-50 border border-neutral-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <MembersIcon className="w-7 h-7 text-neutral-300" />
          </div>
          <p className="text-neutral-400 text-sm">ไม่พบข้อมูลสมาชิก</p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-neutral-100">
            <h3 className="text-xl font-light text-black mb-6">{editingMember ? "แก้ไขสมาชิก" : "เพิ่มสมาชิกใหม่"}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">ชื่อ-นามสกุล</label>
                <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="ชื่อ-นามสกุล" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">เบอร์โทร</label>
                  <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="08X-XXX-XXXX" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">อีเมล</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" className={inputClass} />
                </div>
              </div>
              {formError && <p className="text-xs text-red-500 bg-red-50 border border-red-100 px-4 py-3 rounded-2xl">{formError}</p>}
              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
                <button onClick={() => setShowModal(false)} className="px-5 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-50 border border-neutral-100 rounded-2xl transition-all">ยกเลิก</button>
                <button onClick={handleSave} disabled={saving} className="px-5 py-2.5 text-sm font-medium text-white bg-black hover:bg-neutral-800 rounded-2xl transition-all disabled:opacity-50">
                  {saving ? "กำลังบันทึก..." : "บันทึก"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
