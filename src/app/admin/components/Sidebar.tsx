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
    { title: "Manage Users", icon: UsersIcon, href: "/admin/users" },
    { title: "Manage Members", icon: MembersIcon, href: "/admin/members" },
    { title: "Properties", icon: PropertyIcon, href: "/admin/properties" },
    { title: "Selection", icon: SearchIcon, href: "/admin/selection" },
    { title: "Orders", icon: ClipboardIcon, href: "/admin/orders" },
    { title: "History", icon: HistoryIcon, href: "/admin/history" },
  ];

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 p-2.5 bg-black text-white hover:bg-neutral-800 rounded-md shadow-sm transition-all lg:hidden"
      >
        {isMobileOpen ? <CloseIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
      </button>

      {/* Desktop Toggle (Closed state) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="hidden lg:flex fixed top-6 left-5 z-50 items-center justify-center w-10 h-10 bg-white border border-neutral-200 hover:border-black text-black rounded-md transition-all shadow-sm"
          title="Open Menu"
        >
          <MenuIcon className="w-5 h-5" />
        </button>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 bg-[#FAFAFA] border-r border-neutral-200 h-screen transition-all duration-300 ease-in-out ${
          isOpen ? "w-72" : "w-0 opacity-0 overflow-hidden"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 min-w-0">
            <div className="flex-shrink-0 w-8 h-8 bg-black flex items-center justify-center rounded-sm">
              <span className="text-white font-serif italic text-lg leading-none">S</span>
            </div>
            <div className="overflow-hidden whitespace-nowrap">
              <span className="block text-sm font-semibold text-black tracking-wide">
                SKNAT
              </span>
              <span className="block text-[9px] text-neutral-500 tracking-[0.2em] uppercase">
                Admin
              </span>
            </div>
          </Link>
          
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-neutral-200 rounded-md transition-colors flex-shrink-0 text-neutral-500 hover:text-black"
            title="Close Menu"
          >
            <CloseIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 scrollbar-hide">
          <div className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest px-2 mb-4">
            Menu
          </div>
          <ul className="space-y-1.5">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-4 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-black text-white"
                        : "text-neutral-500 hover:text-black hover:bg-neutral-100"
                    }`}
                  >
                    <Icon
                      className={`w-[18px] h-[18px] flex-shrink-0 ${
                        isActive ? "text-white" : "text-neutral-400"
                      }`}
                    />
                    <span className="whitespace-nowrap tracking-wide">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-neutral-200">
          <div className="flex items-center gap-3 w-full p-2 bg-white border border-neutral-200 rounded-md">
            <div className="w-8 h-8 flex-shrink-0 bg-neutral-100 border border-neutral-200 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-black leading-none">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-black truncate tracking-wide">Administrator</p>
              <p className="text-[10px] text-neutral-500 tracking-wider uppercase">System</p>
            </div>
            <Link
              href="/"
              className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-md transition-colors flex-shrink-0"
              title="Logout"
            >
              <LogoutIcon className="w-[14px] h-[14px]" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar overlay */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-neutral-200 h-screen transition-transform duration-300 ease-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-neutral-200 flex items-center gap-3">
          <div className="w-8 h-8 bg-black flex items-center justify-center rounded-sm">
            <span className="text-white font-serif italic text-lg">S</span>
          </div>
          <div>
            <span className="block text-sm font-semibold tracking-wide">SKNAT</span>
            <span className="block text-[9px] text-neutral-500 tracking-[0.2em] uppercase">Admin</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <li key={index}>
                  <Link
                    href={item.href}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                      isActive ? "bg-black text-white" : "text-neutral-500 hover:text-black hover:bg-neutral-100"
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                    <span className="tracking-wide">{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-30" onClick={() => setIsMobileOpen(false)} />
      )}
    </>
  );
}

