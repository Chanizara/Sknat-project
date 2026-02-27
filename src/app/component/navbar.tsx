'use client';

import Link from "next/link";
import { useFavoritesStore } from "@/lib/favorites-store";

export default function Navbar() {
  const { favorites } = useFavoritesStore();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const navbarHeight = 80; // Approximate navbar height offset
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - navbarHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  return (
    <nav
  className="
    absolute top-10 left-0
    w-full
    px-20
    z-50
    flex justify-between items-center
    text-white text-sm tracking-wide
  "
  >
      {/* LEFT : Logo */}
      <img
      src="/house_logo.png"
      alt="logo"
      className="
        h-10
        w-11
        opacity-60
        
      "
    />

     {/* RIGHT : Menu */}
        <div className="col-start-3 justify-self-end flex gap-8 opacity-80">

        <button
            onClick={() => scrollToSection('about')}
            className="hover:opacity-100 transition cursor-pointer bg-transparent border-none text-white text-sm tracking-wide"
        >
            About
        </button>

        <button
            onClick={() => scrollToSection('services')}
            className="hover:opacity-100 transition cursor-pointer bg-transparent border-none text-white text-sm tracking-wide"
        >
            Services
        </button>

        <button
            onClick={() => scrollToSection('properties')}
            className="hover:opacity-100 transition cursor-pointer bg-transparent border-none text-white text-sm tracking-wide"
        >
            Properties
        </button>

        <button
            onClick={() => scrollToSection('contact')}
            className="hover:opacity-100 transition cursor-pointer bg-transparent border-none text-white text-sm tracking-wide"
        >
            Contact Us
        </button>

        {/* ปุ่มบ้านที่ชอบ */}
        <Link
          href="/compare"
          className="relative hover:opacity-100 transition cursor-pointer flex items-center gap-1.5"
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <span>Favorite houses</span>
          {favorites.length > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {favorites.length}
            </span>
          )}
        </Link>
        </div>

    </nav>
  );
}
