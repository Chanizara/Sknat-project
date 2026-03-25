'use client';

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

// Animated Nav Link with text slide up effect
function AnimatedNavLink({ 
  href, 
  children,
  onClick
}: { 
  href?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const content = (
    <span className="relative overflow-hidden inline-block">
      <span 
        className="block transition-transform duration-300 ease-out"
        style={{ transform: isHovered ? 'translateY(-100%)' : 'translateY(0)' }}
      >
        {children}
      </span>
      <span 
        className="absolute inset-0 flex items-center transition-transform duration-300 ease-out"
        style={{ transform: isHovered ? 'translateY(0)' : 'translateY(100%)' }}
      >
        {children}
      </span>
    </span>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="group flex w-full items-baseline justify-between bg-transparent border-none cursor-pointer py-[7px] text-left"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span
          className="text-[1.5rem] font-light leading-tight transition-all duration-200 group-hover:pl-1"
          style={{ color: 'rgba(255,255,255,0.92)' }}
        >
          {content}
        </span>
        <svg
          className="h-3 w-3 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-50 group-hover:translate-x-0"
          fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.6)"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className="group flex w-full items-baseline justify-between bg-transparent border-none cursor-pointer py-[7px] text-left"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className="text-[1.5rem] font-light leading-tight transition-all duration-200 group-hover:pl-1"
        style={{ color: 'rgba(255,255,255,0.92)' }}
      >
        {content}
      </span>
      <svg
        className="h-3 w-3 opacity-0 -translate-x-2 transition-all duration-200 group-hover:opacity-50 group-hover:translate-x-0"
        fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.6)"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

// Hover Dropdown Menu Component
function HoverDropdownMenu({ 
  isVisible, 
  navItems 
}: { 
  isVisible: boolean;
  navItems: Array<{ label: string; href?: string; id?: string }>;
}) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const scrollToSection = (sectionId: string) => {
    if (!isHomePage) {
      window.location.assign(sectionId === 'home' ? '/' : `/#${sectionId}`);
      return;
    }
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const targetY = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  // Add Home to the beginning of navItems
  const allItems = [
    { label: 'Home', href: '/' },
    ...navItems
  ];

  return (
    <div 
      className="absolute left-1/2 w-64 overflow-hidden pointer-events-none"
      style={{
        bottom: '100%',
        transform: `translateX(-50%) translateY(${isVisible ? '0' : '10px'})`,
        opacity: isVisible ? 1 : 0,
        transition: 'all 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        marginBottom: '8px',
        zIndex: 60,
      }}
    >
      <div 
        className="pointer-events-auto"
        style={{
          background: 'rgba(0,0,0,0.9)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderRadius: '8px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 -20px 60px -20px rgba(0,0,0,0.5)',
        }}
      >
        {/* Menu content */}
        <div className="px-4 py-4">
          <nav>
            {allItems.map((item, index) => {
              const isLink = item.href !== undefined;
              
              return (
                <div
                  key={item.label}
                  style={{
                    borderBottom: index < allItems.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                  }}
                >
                  {isLink ? (
                    <Link
                      href={item.href!}
                      className="group flex w-full items-center justify-between py-2.5 transition-all hover:pl-1"
                    >
                      <span 
                        className="text-sm font-light"
                        style={{ color: 'rgba(255,255,255,0.85)' }}
                      >
                        {item.label}
                      </span>
                      <svg
                        className="h-3 w-3 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-40 group-hover:translate-x-0"
                        fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.5)"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ) : (
                    <button
                      onClick={() => item.id && scrollToSection(item.id)}
                      className="group flex w-full items-center justify-between py-2.5 transition-all hover:pl-1"
                    >
                      <span 
                        className="text-sm font-light"
                        style={{ color: 'rgba(255,255,255,0.85)' }}
                      >
                        {item.label}
                      </span>
                      <svg
                        className="h-3 w-3 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-40 group-hover:translate-x-0"
                        fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.5)"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}

export default function Footer() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const sectionRef = useRef<HTMLElement>(null);
  const [showCard, setShowCard] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'home' | 'morphing' | 'floating' | 'card'>('home');
  const [menuHover, setMenuHover] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;

      // Show card only when user has scrolled to absolute bottom (within 8px)
      const atBottom = scrollY + windowH >= scrollHeight - 8;
      
      // Animate phases
      if (atBottom && !showCard) {
        setShowCard(true);
        // Start animation sequence
        setAnimationPhase('morphing');
        setTimeout(() => setAnimationPhase('floating'), 200);
        setTimeout(() => setAnimationPhase('card'), 500);
      } else if (!atBottom && showCard) {
        setShowCard(false);
        setAnimationPhase('home');
      }

      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        setIsInView(rect.top < windowH && rect.bottom > 0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [showCard]);

  const scrollToSection = (sectionId: string) => {
    if (!isHomePage) {
      window.location.assign(sectionId === 'home' ? '/' : `/#${sectionId}`);
      return;
    }
    if (sectionId === 'home') {
      const lenis = (window as unknown as { lenis?: { scrollTo: (target: number) => void } }).lenis;
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const lenis = (window as unknown as { lenis?: { scrollTo: (target: number) => void } }).lenis;
      const targetY = element.getBoundingClientRect().top + window.scrollY - 80;
      if (lenis) {
        lenis.scrollTo(targetY);
      } else {
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    }
  };

  const navItems = [
    { label: 'About',      href: '/about' },
    { label: 'Services',   href: '/about' },
    { label: 'Properties', id: 'properties' },
    { label: 'Approach',   href: '/about' },
    { label: 'Contact',    href: '/contact' },
  ];

  // Animation states
  const isHome = animationPhase === 'home';
  const isMorphing = animationPhase === 'morphing';
  const isFloating = animationPhase === 'floating';
  const isCard = animationPhase === 'card';

  return (
    <footer
      ref={sectionRef}
      id="site-footer"
      className="relative overflow-hidden"
      style={{ height: '100vh', minHeight: '600px', zIndex: 10 }}
    >
      {/* ── Full-bleed background with parallax ── */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
        >
          <Image
            src="/footer.jpg"
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div
            className="absolute inset-0"
            style={{ background: 'rgba(0,0,0,0.18)' }}
          />
        </div>
      </div>

      {/* ── Giant watermark ── */}
      <div className="pointer-events-none absolute inset-0 flex items-end overflow-hidden select-none pb-16">
        <p
          className="w-full text-center font-black uppercase leading-none tracking-tight"
          style={{
            fontSize: 'clamp(6rem, 22vw, 26rem)',
            color: 'rgba(255,255,255,0.07)',
            letterSpacing: '-0.03em',
          }}
        >
          SKNAT
        </p>
      </div>

      {/* ── Fluid glass animated blobs (blurred by the card's backdrop-filter) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div style={{
          position: 'absolute', width: '440px', height: '440px',
          background: 'radial-gradient(circle, rgba(99,102,241,0.52) 0%, transparent 66%)',
          filter: 'blur(32px)',
          top: '50%', left: '50%',
          transform: 'translate(-62%, -52%)',
          animation: 'blob-drift-1 18s ease-in-out infinite',
          willChange: 'transform',
        }} />
        <div style={{
          position: 'absolute', width: '380px', height: '380px',
          background: 'radial-gradient(circle, rgba(168,85,247,0.44) 0%, transparent 66%)',
          filter: 'blur(38px)',
          top: '50%', left: '50%',
          transform: 'translate(-38%, -40%)',
          animation: 'blob-drift-2 23s ease-in-out infinite',
          animationDelay: '-9s',
          willChange: 'transform',
        }} />
        <div style={{
          position: 'absolute', width: '320px', height: '320px',
          background: 'radial-gradient(circle, rgba(6,182,212,0.38) 0%, transparent 66%)',
          filter: 'blur(28px)',
          top: '50%', left: '50%',
          transform: 'translate(-48%, -62%)',
          animation: 'blob-drift-3 20s ease-in-out infinite',
          animationDelay: '-5s',
          willChange: 'transform',
        }} />
      </div>

      {/* ── HOME Button at Bottom Center ── */}
      <div
        className="absolute left-1/2 z-20"
        style={{
          bottom: '100px',
          transform: isHome 
            ? 'translateX(-50%) translateY(0) scale(1)' 
            : isMorphing 
              ? 'translateX(-50%) translateY(10px) scale(0.8)' 
              : isFloating 
                ? 'translateX(-50%) translateY(-30vh) scale(0.4)' 
                : 'translateX(-50%) translateY(-40vh) scale(0)',
          opacity: isHome ? 1 : isMorphing ? 0.6 : isFloating ? 0.3 : 0,
          transition: 'all 0.5s cubic-bezier(0.22, 1, 0.36, 1)',
          pointerEvents: isHome ? 'auto' : 'none',
        }}
      >
        <Link
          href="/"
          className="inline-flex items-center justify-center transition-all hover:scale-105"
          style={{
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '0.75rem',
            padding: '16px 48px',
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.9)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.2)';
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,1)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)';
            (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.9)';
          }}
        >
          HOME
        </Link>
      </div>

      {/* ── Morphing Drop Animation ── */}
      {(isMorphing || isFloating || isCard) && (
        <div
          className="absolute left-1/2 z-30 pointer-events-none"
          style={{
            bottom: isMorphing ? '80px' : isFloating ? '50%' : '50%',
            transform: isMorphing 
              ? 'translateX(-50%) translateY(0) scale(1)' 
              : isFloating 
                ? 'translateX(-50%) translateY(50%) scale(0.3)' 
                : 'translateX(-50%) translateY(50%) scale(0)',
            opacity: isMorphing ? 0.8 : isFloating ? 0.6 : 0,
            transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        >
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
            }}
          />
        </div>
      )}

      {/* ── Menu Card at Center ── */}
      <div
        className="absolute left-1/2 top-1/2 z-40 pointer-events-none"
        style={{
          transform: isCard 
            ? 'translate(-50%, -50%) scale(1)' 
            : 'translate(-50%, -30%) scale(0.85)',
          opacity: isCard ? 1 : 0,
          transition: 'all 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
          pointerEvents: isCard ? 'auto' : 'none',
        }}
      >
        {/* Card with soft blurred edges */}
        <div
          className="relative"
          style={{
            width: '320px',
            borderRadius: '12px',
          }}
        >
          {/* Soft outer glow */}
          <div 
            className="absolute -inset-3 rounded-[20px] pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(0,0,0,0.3) 0%, transparent 70%)',
              filter: 'blur(20px)',
            }}
          />
          
          {/* Main card content */}
          <div
            className="relative"
            style={{
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: `
                0 0 0 1px rgba(255,255,255,0.04),
                0 40px 100px -30px rgba(0,0,0,0.6),
                0 0 80px -20px rgba(0,0,0,0.4)
              `,
            }}
          >
            {/* Top highlight line */}
            <div 
              className="absolute inset-x-4 top-0 h-px pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              }}
            />

            {/* Card Content */}
            <div className="px-7 pt-8 pb-7">
              {/* House Icon - Mini Navbar Style */}
              <div className="flex justify-center mb-5">
                <Link href="/" className="block transition-opacity hover:opacity-70">
                  <svg 
                    width="28" 
                    height="28" 
                    viewBox="0 0 96 96" 
                    fill="none"
                    style={{ stroke: 'rgba(255,255,255,0.7)', strokeWidth: 2.2 }}
                  >
                    <path d="M16 43L48 18L80 43" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M24 43V74H40V56H56V74H72V43" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>

              {/* MENU label */}
              <p
                className="mb-5 text-[10px] font-medium tracking-[0.2em] uppercase text-center"
                style={{ color: 'rgba(255,255,255,0.45)' }}
              >
                MENU
              </p>

              {/* Nav items */}
              <nav className="mb-6">
                {navItems.map((item, index) => {
                  const isLink = 'href' in item;
                  
                  return (
                    <div
                      key={item.label}
                      style={{
                        borderBottom: index < navItems.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                      }}
                    >
                      {isLink ? (
                        <AnimatedNavLink href={item.href}>
                          {item.label}
                        </AnimatedNavLink>
                      ) : (
                        <AnimatedNavLink onClick={() => scrollToSection(item.id)}>
                          {item.label}
                        </AnimatedNavLink>
                      )}
                    </div>
                  );
                })}
              </nav>

              {/* Two-column contact */}
              <div className="mb-6 grid grid-cols-2 gap-x-4 text-[11px]">
                <div className="space-y-1.5">
                  <a
                    href="#"
                    className="block transition-colors duration-200"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                  >
                    News
                  </a>
                  <a
                    href="#"
                    className="block transition-colors duration-200"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                  >
                    Showroom
                  </a>
                </div>
                <div className="space-y-1.5">
                  <p style={{ color: 'rgba(255,255,255,0.45)' }}>089-999-9999</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)' }}>hello@sknat.co.th</p>
                </div>
              </div>

              {/* CTA button */}
              <Link
                href="/contact"
                className="flex w-full items-center justify-center gap-2 py-[11px] transition-all duration-200"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '6px',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.95)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)';
                }}
              >
                <span style={{ fontSize: '0.7rem' }}>→</span>
                GET IN TOUCH
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer Container ── */}
      <div className="absolute bottom-0 left-0 right-0 z-50">
        {/* ── Bottom Navigation Bar with Hover Dropdown ── */}
        <div 
          className="absolute bottom-6 left-1/2"
          style={{ transform: 'translateX(-50%)' }}
          onMouseEnter={() => setMenuHover(true)}
          onMouseLeave={() => setMenuHover(false)}
        >
          {/* Dropdown Menu - appears above on hover */}
          <HoverDropdownMenu 
            isVisible={menuHover}
            navItems={navItems}
          />

          <div 
            className="flex items-center gap-6 px-8 py-3 relative"
            style={{ 
              backgroundColor: 'rgba(42,42,42,0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '2px',
            }}
          >
            {/* Logo icon */}
            <Link href="/" className="transition-opacity hover:opacity-70">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ stroke: '#f5f2ee', strokeWidth: 1.5 }}>
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </Link>

            {/* Divider */}
            <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.15)' }} />

            {/* Text */}
            <span 
              className="text-xs font-medium tracking-[0.2em] uppercase"
              style={{ color: '#f5f2ee' }}
            >
              CONTACT
            </span>

            {/* Divider */}
            <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255,255,255,0.15)' }} />

            {/* Hamburger Menu Icon */}
            <div
              className="flex items-center justify-center w-8 h-8 transition-opacity hover:opacity-70 cursor-pointer"
              style={{ color: '#f5f2ee' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ stroke: 'currentColor', strokeWidth: 1.5 }}>
                <line x1="3" y1="8" x2="21" y2="8" />
                <line x1="3" y1="16" x2="21" y2="16" />
              </svg>
            </div>
          </div>
        </div>

        {/* ── Bottom corner bars with enhanced readability ── */}
        <div
          className="flex items-center justify-between px-6 py-4 md:px-10"
          style={{ 
            borderTop: '1px solid rgba(255,255,255,0.08)',
            background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
          }}
        >
          <div className="flex items-center gap-4 text-[12px]" style={{ 
            color: 'rgba(255,255,255,0.55)',
            textShadow: '0 1px 3px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
          }}>
            <span>&copy; {new Date().getFullYear()}, SKNAT Property</span>
            <Link
              href="/about"
              className="transition hover:text-white/80"
              style={{ color: 'inherit' }}
            >
              Line
            </Link>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="transition hover:text-white/80"
              style={{ color: 'inherit' }}
            >
              Instagram
            </a>
          </div>
          <div className="flex items-center gap-4 text-[12px]" style={{ 
            color: 'rgba(255,255,255,0.55)',
            textShadow: '0 1px 3px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
          }}>
            <span>นโยบายความเป็นส่วนตัว</span>
            <span>·</span>
            <span>ข้อตกลงการใช้งาน</span>
            <span>·</span>
            <Link
              href="/admin/properties"
              className="transition hover:text-white/80"
              style={{ color: 'inherit' }}
            >
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
