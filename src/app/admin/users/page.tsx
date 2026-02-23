"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  PlusIcon,
  SearchIcon,
  EditIcon,
  TrashIcon,
  FilterIcon,
  MoreIcon,
} from "../components/Icons";

interface User {
  id: number;
  fullName: string;
  position: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  createdAt: string;
  avatar?: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      fullName: "สมชาย ใจดี",
      position: "ผู้จัดการฝ่ายขาย",
      phone: "081-234-5678",
      email: "somchai@sknat.com",
      status: "active",
      createdAt: "2024-01-15",
    },
    {
      id: 2,
      fullName: "สมหญิง รักงาน",
      position: "พนักงานขาย",
      phone: "089-876-5432",
      email: "somying@sknat.com",
      status: "active",
      createdAt: "2024-02-20",
    },
    {
      id: 3,
      fullName: "ประเสริฐ มีทรัพย์",
      position: "ที่ปรึกษาด้านอสังหาฯ",
      phone: "092-345-6789",
      email: "prasert@sknat.com",
      status: "inactive",
      createdAt: "2023-12-10",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredUsers = users.filter(
    (user) =>
      (user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "all" || user.status === filterStatus)
  );

  const handleDelete = (id: number) => {
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  const getInitials = (name: string) => {
    return name.charAt(0);
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
                  จัดการบัญชีผู้ใช้
                </h1>
                <p className="text-xs text-slate-400">
                  สร้าง แก้ไข หรือลบบัญชีเจ้าหน้าที่
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setEditingUser(null);
                setShowModal(true);
              }}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>เพิ่มผู้ใช้</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-[1600px] mx-auto px-6 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 premium-shadow">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">ผู้ใช้ทั้งหมด</div>
            <div className="text-2xl font-bold text-slate-800">{users.length}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 premium-shadow">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">ใช้งานอยู่</div>
            <div className="text-2xl font-bold text-emerald-600">{users.filter(u => u.status === "active").length}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 premium-shadow">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">ไม่ใช้งาน</div>
            <div className="text-2xl font-bold text-slate-400">{users.filter(u => u.status === "inactive").length}</div>
          </div>
          <div className="bg-white rounded-2xl p-5 premium-shadow">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">เพิ่มใหม่เดือนนี้</div>
            <div className="text-2xl font-bold text-blue-600">+2</div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 mb-6 premium-shadow">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="ค้นหาด้วยชื่อหรืออีเมล..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              />
              <SearchIcon className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            </div>
            <div className="flex gap-3">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all min-w-[140px]"
              >
                <option value="all">ทุกสถานะ</option>
                <option value="active">ใช้งาน</option>
                <option value="inactive">ไม่ใช้งาน</option>
              </select>
              <button className="px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-500 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all">
                <FilterIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl premium-shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-blue-50/30 border-b border-blue-100/50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ผู้ใช้</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ตำแหน่ง</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">ติดต่อ</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">สถานะ</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">วันที่สร้าง</th>
                  <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold ${
                            user.status === "active"
                              ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white"
                              : "bg-slate-200 text-slate-500"
                          }`}>
                            {getInitials(user.fullName)}
                          </div>
                          {user.status === "active" && (
                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{user.fullName}</div>
                          <div className="text-xs text-slate-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                        {user.position}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-600">{user.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                          user.status === "active"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-slate-100 text-slate-500 border border-slate-200"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === "active" ? "bg-emerald-500" : "bg-slate-400"}`} />
                        {user.status === "active" ? "ใช้งาน" : "ไม่ใช้งาน"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">{user.createdAt}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setShowModal(true);
                          }}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="แก้ไข"
                        >
                          <EditIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="ลบ"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredUsers.length === 0 && (
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SearchIcon className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-400">ไม่พบข้อมูลผู้ใช้</p>
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-blue-950/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-800 mb-6">
              {editingUser ? "แก้ไขข้อมูลผู้ใช้" : "เพิ่มผู้ใช้ใหม่"}
            </h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    ชื่อ-นามสกุล
                  </label>
                  <input
                    type="text"
                    defaultValue={editingUser?.fullName}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    placeholder="กรอกชื่อ-นามสกุล"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    ตำแหน่ง
                  </label>
                  <input
                    type="text"
                    defaultValue={editingUser?.position}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                    placeholder="กรอกตำแหน่ง"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                    เบอร์โทร
                  </label>
                  <input
                    type="tel"
                    defaultValue={editingUser?.phone}
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
                    defaultValue={editingUser?.email}
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
