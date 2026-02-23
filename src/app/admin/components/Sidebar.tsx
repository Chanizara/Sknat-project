"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  DashboardIcon,
  UsersIcon,
  MembersIcon,
  PropertyIcon,
  SearchIcon,
  ClipboardIcon,
  HistoryIcon,
  LogoutIcon,
  MenuIcon,
  CloseIcon,
} from "./Icons";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { title: "Dashboard", icon: DashboardIcon, href: "/admin" },
    { title: "จัดการบัญชีผู้ใช้", icon: UsersIcon, href: "/admin/users" },
    { title: "จัดการข้อมูลสมาชิก", icon: MembersIcon, href: "/admin/members" },
    { title: "จัดการอสังหาฯ", icon: PropertyIcon, href: "/admin/properties" },
    { title: "คัดเลือกอสังหาฯ", icon: SearchIcon, href: "/admin/selection" },
    { title: "ข้อมูลการสั่งซื้อ", icon: ClipboardIcon, href: "/admin/orders" },
    { title: "ประวัติการทำธุรกรรม", icon: HistoryIcon, href: "/admin/history" },
  ];

  return (
    <>
      {/* Toggle Button - Mobile */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 lg:hidden group"
      >
        {isMobileOpen ? (
          <CloseIcon className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
        ) : (
          <MenuIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        )}
      </button>

      {/* Floating Toggle Button - Desktop (when sidebar is closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="hidden lg:flex fixed top-6 left-4 z-50 items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
          title="เปิด Sidebar"
        >
          <MenuIcon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
        </button>
      )}

      {/* Sidebar Desktop */}
      <aside
        className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 bg-white/80 backdrop-blur-2xl border-r border-blue-100/50 h-screen transition-all duration-300 ease-out ${
          isOpen ? "w-72" : "w-20"
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 100%)'
        }}
      >
        {/* Logo/Header with Toggle Button */}
        <div className={`p-6 border-b border-blue-100/30 transition-all ${isOpen ? '' : 'p-4'}`}>
          <div className="flex items-center justify-between gap-2">
            <Link href="/" className="flex items-center gap-3 group flex-1 min-w-0">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-bold text-lg tracking-tight">S</span>
                </div>
              </div>
              {isOpen && (
                <div className="overflow-hidden whitespace-nowrap">
                  <span className="block text-base font-bold bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 bg-clip-text text-transparent">
                    Sknat Estate
                  </span>
                  <span className="block text-[10px] font-medium text-blue-400 tracking-[0.2em] uppercase">
                    Admin
                  </span>
                </div>
              )}
            </Link>
            
            {/* Toggle Button on Sidebar */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-blue-50 rounded-lg transition-all duration-300 group flex-shrink-0"
              title={isOpen ? 'ซ่อน Sidebar' : 'แสดง Sidebar'}
            >
              {isOpen ? (
                <CloseIcon className="w-5 h-5 text-blue-600 group-hover:rotate-90 transition-transform duration-300" />
              ) : (
                <MenuIcon className="w-5 h-5 text-blue-600 group-hover:scale-110 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 scrollbar-hide">
          {isOpen && (
            <div className="text-[10px] font-semibold text-blue-300 uppercase tracking-[0.15em] px-3 mb-2">
              Main Menu
            </div>
          )}
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={`relative flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-300 group overflow-hidden ${
                      isActive
                        ? "text-white"
                        : "text-slate-500 hover:text-blue-700"
                    } ${isOpen ? '' : 'justify-center'}`}
                    title={!isOpen ? item.title : undefined}
                  >
                    {isActive && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700" />
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
                      </>
                    )}
                    <div className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      isActive 
                        ? "bg-white/10" 
                        : "bg-slate-100 group-hover:bg-blue-50 group-hover:shadow-lg group-hover:shadow-blue-500/10"
                    }`}>
                      <Icon
                        className={`w-[18px] h-[18px] transition-all duration-300 ${
                          isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"
                        }`}
                      />
                    </div>
                    {isOpen && (
                      <span className="relative whitespace-nowrap overflow-hidden">{item.title}</span>
                    )}
                    {isActive && isOpen && (
                      <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.6)]" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section - User Info */}
        <div className={`p-3 border-t border-blue-100/50 ${isOpen ? '' : 'p-2'}`}>
          <div className={`relative rounded-xl overflow-hidden ${isOpen ? 'p-3' : 'p-2'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent" />
            
            <div className="relative flex items-center gap-3">
              <div className="relative w-9 h-9 flex-shrink-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full" />
                <div className="absolute inset-[2px] bg-white rounded-full flex items-center justify-center">
                  <span className="text-xs font-bold bg-gradient-to-br from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                    A
                  </span>
                </div>
              </div>
              {isOpen && (
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="text-sm font-bold text-slate-800 truncate">Admin</p>
                  <p className="text-xs text-blue-500 font-medium truncate">ผู้ดูแลระบบ</p>
                </div>
              )}
              <Link
                href="/"
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all rounded-lg flex-shrink-0"
                title="ออกจากระบบ"
              >
                <LogoutIcon className="w-[16px] h-[16px]" />
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-72 bg-white/95 backdrop-blur-2xl border-r border-blue-100/50 h-screen transition-transform duration-300 ease-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo/Header */}
        <div className="p-6">
          <Link href="/" className="flex items-center gap-4 group">
            <div className="relative w-12 h-12 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-bold text-xl">S</span>
              </div>
            </div>
            <div>
              <span className="block text-lg font-bold bg-gradient-to-r from-blue-900 to-indigo-900 bg-clip-text text-transparent">
                Sknat Estate
              </span>
              <span className="block text-[10px] font-medium text-blue-400 tracking-wider uppercase">
                Admin Panel
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="text-[10px] font-semibold text-blue-300 uppercase tracking-[0.15em] px-4 mb-3">
            Main Menu
          </div>
          <ul className="space-y-1.5">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={index}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`relative flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "text-white"
                        : "text-slate-500 hover:text-blue-700"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl" />
                    )}
                    <div className={`relative w-9 h-9 rounded-lg flex items-center justify-center ${
                      isActive ? "bg-white/10" : "bg-slate-100"
                    }`}>
                      <Icon className={`w-[18px] h-[18px] ${isActive ? "text-white" : "text-slate-400"}`} />
                    </div>
                    <span className="relative">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-100/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">A</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800">Admin</p>
              <p className="text-xs text-blue-500">ผู้ดูแลระบบ</p>
            </div>
            <Link href="/" className="p-2 text-slate-400 hover:text-red-500">
              <LogoutIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-blue-950/30 backdrop-blur-sm z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
    </>
  );
}
