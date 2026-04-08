"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { emit } from "@/lib/socket";
import { useAuth } from "@/lib/auth";
import {
  ArrowLeftIcon,
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  UserGroupIcon,
} from "../components/Icons";

interface User {
  id: number;
  username: string;
  role: "admin" | "seller";
  fullName?: string;
  phone?: string;
  email?: string;
  createdAt: string;
}

interface FormState {
  username: string;
  password: string;
  role: "admin" | "seller";
  fullName: string;
  phone: string;
  email: string;
}

const emptyForm: FormState = { username: "", password: "", role: "seller", fullName: "", phone: "", email: "" };

export default function UsersPage() {
  const { user } = useAuth();
  const basePath = user?.role === "seller" ? "/seller" : "/admin";
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("seller");
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const loadUsers = async () => {
    const res = await emit<User[]>("users:list");
    if (res.ok && res.data) setUsers(res.data);
    setLoading(false);
  };

  useEffect(() => { loadUsers(); }, []);

  const filteredUsers = users.filter(
    (u) =>
      (u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterRole === "all" || u.role === filterRole)
  );
  const sellerUsers = filteredUsers.filter((u) => u.role === "seller");

  const openAdd = () => {
    setEditingUser(null);
    setForm(emptyForm);
    setFormError("");
    setShowModal(true);
  };

  const openEdit = (u: User) => {
    setEditingUser(u);
    setForm({ username: u.username, password: "", role: u.role, fullName: u.fullName ?? "", phone: u.phone ?? "", email: u.email ?? "" });
    setFormError("");
    setShowModal(true);
  };

  const handleSave = async () => {
    setSaving(true);
    setFormError("");
    let res;
    if (editingUser) {
      res = await emit<User>("users:update", {
        id: editingUser.id,
        role: form.role,
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        ...(form.password ? { password: form.password } : {}),
      });
    } else {
      res = await emit<User>("users:create", {
        username: form.username,
        password: form.password,
        role: "seller",
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
      });
    }
    setSaving(false);
    if (!res.ok) { setFormError(res.error ?? "เกิดข้อผิดพลาด"); return; }
    setShowModal(false);
    loadUsers();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("ลบผู้ใช้นี้?")) return;
    await emit("users:delete", { id });
    setUsers((prev) => prev.filter((u) => u.id !== id));
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
            <h1 className="text-3xl font-light tracking-tight text-black mb-1">จัดการคนขาย</h1>
            <p className="text-sm text-neutral-500 tracking-wide">สร้าง แก้ไข หรือลบบัญชีพนักงานขาย และดูประวัติการขาย</p>
          </div>
        </div>
        <button onClick={openAdd} className="px-5 py-2.5 bg-black text-white text-sm font-medium rounded-2xl hover:bg-neutral-800 transition-all flex items-center gap-2 self-start md:self-auto">
          <PlusIcon className="w-4 h-4" />
          <span>เพิ่มคนขาย</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[
          { label: "พนักงานขายทั้งหมด", value: users.filter(u => u.role === "seller").length, sub: "Seller" },
          { label: "ผู้ดูแลระบบ", value: users.filter(u => u.role === "admin").length, sub: "Admin" },
          { label: "คนขายใหม่เดือนนี้", value: users.filter(u => u.role === "seller" && new Date(u.createdAt).getMonth() === new Date().getMonth()).length, sub: "New seller" },
          { label: "ที่กำลังแสดง", value: sellerUsers.length, sub: "Filtered" },
        ].map((s, i) => (
          <div key={i} className="bg-white border border-neutral-100 p-6 rounded-3xl shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
            <p className="text-neutral-500 text-xs tracking-wider uppercase mb-2">{s.label}</p>
            <p className="text-3xl font-light text-black tracking-tight mb-1">{loading ? "—" : s.value}</p>
            <p className="text-neutral-400 text-xs">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white border border-neutral-100 rounded-3xl p-5 mb-6 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)]">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <input type="text" placeholder="ค้นหาชื่อ / username / อีเมล..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              className={inputClass} />
            <SearchIcon className="w-4 h-4 text-neutral-400 absolute left-4 top-3.5" />
          </div>
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}
            className="px-4 py-3 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm focus:outline-none min-w-35">
            <option value="all">ทุกบทบาท</option>
            <option value="seller">พนักงานขาย</option>
            <option value="admin">ผู้ดูแลระบบ</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-100 rounded-3xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-6 py-5 border-b border-neutral-100 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-black tracking-wide uppercase">รายชื่อคนขาย</h2>
          <span className="text-xs text-neutral-400 bg-neutral-50 border border-neutral-100 px-3 py-1 rounded-full">{sellerUsers.length} รายการ</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-100/50">
                {["ผู้ใช้", "บทบาท", "ติดต่อ", "วันที่สร้าง", "จัดการ"].map((h) => (
                  <th key={h} className="px-6 py-4 text-left text-xs font-semibold text-neutral-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100/50">
              {loading
                ? [0,1,2].map((i) => (
                    <tr key={i}><td colSpan={5} className="px-6 py-4"><div className="h-8 bg-neutral-50 rounded-xl animate-pulse" /></td></tr>
                  ))
                : sellerUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-semibold bg-black text-white shrink-0">
                            {(u.fullName ?? u.username).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <Link href={`/admin/sellers/${u.id}`} className="font-medium text-black text-sm hover:underline">
                              {u.fullName ?? u.username}
                            </Link>
                            <div className="text-xs text-neutral-400">@{u.username}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                          u.role === "admin" ? "bg-black text-white border-black" : "bg-neutral-50 text-neutral-600 border-neutral-200"
                        }`}>
                          {u.role === "admin" ? "ผู้ดูแลระบบ" : "พนักงานขาย"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-neutral-500">{u.phone ?? "—"}</div>
                        <div className="text-xs text-neutral-400">{u.email ?? "—"}</div>
                      </td>
                      <td className="px-6 py-4 text-xs text-neutral-400">{new Date(u.createdAt).toLocaleDateString("th-TH")}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(u)} className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-xl transition-all">
                            <EditIcon className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(u.id)} className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all">
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
          {!loading && sellerUsers.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-neutral-50 border border-neutral-100 rounded-3xl flex items-center justify-center mx-auto mb-4">
                <UserGroupIcon className="w-7 h-7 text-neutral-300" />
              </div>
              <p className="text-neutral-400 text-sm">ไม่พบข้อมูลคนขาย</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-neutral-100">
            <h3 className="text-xl font-light text-black mb-6">{editingUser ? "แก้ไขคนขาย" : "เพิ่มคนขายใหม่"}</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">ชื่อ-นามสกุล</label>
                  <input type="text" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} placeholder="ชื่อ-นามสกุล" className={inputClass} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">บทบาท</label>
                  <input value="พนักงานขาย" readOnly className={inputClass} />
                </div>
                {!editingUser && (
                  <div>
                    <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">Username</label>
                    <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} placeholder="username" className={inputClass} />
                  </div>
                )}
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">{editingUser ? "รหัสผ่านใหม่ (ถ้าต้องการเปลี่ยน)" : "รหัสผ่าน"}</label>
                  <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="รหัสผ่าน" className={inputClass} />
                </div>
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
