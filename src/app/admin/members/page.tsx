"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  PlusIcon,
  SearchIcon,
  PhoneIcon,
  EmailIcon,
  HeartIcon,
  FilterIcon,
  MoreIcon,
} from "../components/Icons";

interface Member {
  id: number;
  fullName: string;
  phone: string;
  email: string;
  memberSince: string;
  status: "active" | "suspended";
  favoriteCount: number;
  lastActive: string;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      fullName: "วิชัย มั่งมี",
      phone: "081-111-2222",
      email: "wichai@gmail.com",
      memberSince: "2024-01-10",
      status: "active",
      favoriteCount: 5,
      lastActive: "2 ชั่วโมงที่แล้ว",
    },
    {
      id: 2,
      fullName: "สุดา รุ่งเรือง",
      phone: "089-333-4444",
      email: "suda@gmail.com",
      memberSince: "2024-02-15",
      status: "active",
      favoriteCount: 3,
      lastActive: "5 นาทีที่แล้ว",
    },
    {
      id: 3,
      fullName: "ประภาส สุขใจ",
      phone: "090-555-6666",
      email: "prapas@hotmail.com",
      memberSince: "2023-11-20",
      status: "suspended",
      favoriteCount: 0,
      lastActive: "1 เดือนที่แล้ว",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const filteredMembers = members.filter(
    (member) =>
      member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm)
  );

  const handleToggleStatus = (id: number) => {
    setMembers(
      members.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "active" ? "suspended" : "active" }
          : m
      )
    );
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-blue-100/50 sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              >
                <ArrowLeftIcon className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-blue-900 bg-clip-text text-transparent">
                  จัดการข้อมูลสมาชิก
                </h1>
                <p className="text-xs text-slate-400">
                  สมัคร แก้ไข ค้นหา หรือระงับบัญชีลูกค้า
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingMember(null);
                setShowModal(true);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>เพิ่มสมาชิก</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 premium-shadow">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">สมาชิกทั้งหมด</div>
            <div className="text-2xl font-bold text-slate-800">{members.length}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 premium-shadow">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">ใช้งานอยู่</div>
            <div className="text-2xl font-bold text-emerald-600">{members.filter(m => m.status === "active").length}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 premium-shadow">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">ระงับ</div>
            <div className="text-2xl font-bold text-amber-500">{members.filter(m => m.status === "suspended").length}</div>
          </div>
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-5 text-white">
            <div className="text-xs font-semibold text-blue-200 uppercase tracking-wider mb-1">ใหม่เดือนนี้</div>
            <div className="text-2xl font-bold">+12</div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-2xl p-4 mb-6 premium-shadow">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ค้นหาด้วยชื่อ อีเมล หรือเบอร์โทร..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
              <SearchIcon className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </div>
            <select className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all min-w-[140px]">
              <option>ทั้งหมด</option>
              <option>ใช้งาน</option>
              <option>ระงับ</option>
            </select>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="group bg-white rounded-2xl p-5 premium-shadow hover:premium-shadow-hover transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold ${
                      member.status === "active"
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                        : "bg-slate-200 text-slate-500"
                    }`}>
                      {member.fullName.charAt(0)}
                    </div>
                    {member.status === "active" && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-800">{member.fullName}</h3>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        member.status === "active"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}
                    >
                      <span className={`w-1 h-1 rounded-full ${member.status === "active" ? "bg-emerald-500" : "bg-amber-500"}`} />
                      {member.status === "active" ? "ใช้งาน" : "ระงับ"}
                    </span>
                  </div>
                </div>
                <button className="p-2 text-slate-300 hover:text-slate-500 hover:bg-slate-50 rounded-lg transition-all">
                  <MoreIcon className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                    <PhoneIcon className="w-3.5 h-3.5 text-blue-500" />
                  </div>
                  <span className="text-slate-600">{member.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center">
                    <EmailIcon className="w-3.5 h-3.5 text-indigo-500" />
                  </div>
                  <span className="text-slate-600 truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center">
                    <HeartIcon className="w-3.5 h-3.5 text-rose-500" />
                  </div>
                  <span className="text-slate-600">{member.favoriteCount} รายการโปรด</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span>สมาชิก: {member.memberSince}</span>
                  <span>เข้าใช้ล่าสุด: {member.lastActive}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingMember(member);
                      setShowModal(true);
                    }}
                    className="flex-1 px-4 py-2.5 bg-slate-50 text-slate-600 rounded-xl text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-all"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleToggleStatus(member.id)}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      member.status === "active"
                        ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                        : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                    }`}
                  >
                    {member.status === "active" ? "ระงับ" : "เปิดใช้"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMembers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-400">ไม่พบข้อมูลสมาชิก</p>
          </div>
        )}
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-blue-950/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-slate-800 mb-6">
              {editingMember ? "แก้ไขข้อมูลสมาชิก" : "เพิ่มสมาชิกใหม่"}
            </h3>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                  ชื่อ-นามสกุล
                </label>
                <input
                  type="text"
                  defaultValue={editingMember?.fullName}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  placeholder="กรอกชื่อ-นามสกุล"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    เบอร์โทร
                  </label>
                  <input
                    type="tel"
                    defaultValue={editingMember?.phone}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    placeholder="08X-XXX-XXXX"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    อีเมล
                  </label>
                  <input
                    type="email"
                    defaultValue={editingMember?.email}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
