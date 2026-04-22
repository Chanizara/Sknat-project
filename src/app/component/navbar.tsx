'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useFavoritesStore } from "@/lib/favorites-store";
import { useAuthStore } from "@/lib/auth-store";

export default function Navbar() {
  const { favorites, hasHydrated } = useFavoritesStore();
  const { user, hasHydrated: authHydrated, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const isHomePage = pathname === '/';
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    if (!isHomePage) {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({ top: element.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' });
    }
  };

  return (
    <nav className="absolute top-10 left-0 w-full px-20 z-50 flex justify-between items-center text-white text-sm tracking-wide">
      {/* LEFT : Logo */}
      <button onClick={() => scrollToSection('hero')} className="cursor-pointer bg-transparent border-none p-0">
        <Image src="/icon_02.png" alt="logo" width={44} height={40} className="opacity-60 hover:opacity-100 transition" />
      </button>

      {/* RIGHT : Menu */}
      <div className="flex items-center gap-8 opacity-80">
        <Link href="/about" className="hover:opacity-100 transition text-white text-sm tracking-wide">About</Link>
        <button onClick={() => scrollToSection('services')} className="hover:opacity-100 transition bg-transparent border-none text-white text-sm tracking-wide">Services</button>
        <button onClick={() => scrollToSection('properties')} className="hover:opacity-100 transition bg-transparent border-none text-white text-sm tracking-wide">Properties</button>
        <button onClick={() => scrollToSection('contact')} className="hover:opacity-100 transition bg-transparent border-none text-white text-sm tracking-wide">Contact Us</button>

        {/* Compare */}
        <Link href="/compare" className="relative hover:opacity-100 transition flex items-center gap-1.5">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
          </svg>
          <span>Compare</span>
        </Link>

        {/* Favorites */}
        <Link href="/favorite" className="relative hover:opacity-100 transition flex items-center gap-1.5">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>Favorites</span>
          {hasHydrated && favorites.length > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {favorites.length}
            </span>
          )}
        </Link>

        {/* Auth */}
        {authHydrated && (
          user ? (
            <div className="relative">
              <button onClick={() => setUserMenuOpen((v) => !v)} className="flex items-center gap-2 hover:opacity-100 transition">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-[11px] font-semibold uppercase">
                  {user.username.charAt(0)}
                </span>
                <span className="text-sm">{user.username}</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-10 w-40 bg-white shadow-lg border border-[#ececec] py-1 z-50">
                  <div className="px-4 py-2 border-b border-[#f0f0f0]">
                    <p className="text-[11px] font-semibold text-[#0a0a0a] truncate">{user.fullName ?? user.username}</p>
                    <p className="text-[10px] text-[#888] uppercase tracking-wide">{user.role}</p>
                  </div>
                  <button
                    onClick={() => { logout(); setUserMenuOpen(false); }}
                    className="w-full text-left px-4 py-2 text-[12px] text-[#555] hover:bg-[#f7f7f7] hover:text-[#0a0a0a] transition"
                  >
                    ออกจากระบบ
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button onClick={() => router.push('/login')} className="flex items-center gap-1.5 hover:opacity-100 transition" aria-label="เข้าสู่ระบบ">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              <span className="text-sm">เข้าสู่ระบบ</span>
            </button>
          )
        )}
      </div>
    </nav>
  );
}
