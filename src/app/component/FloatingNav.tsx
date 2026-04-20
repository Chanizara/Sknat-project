'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

function PageNameDisplay() {
  const pathname = usePathname();
  const getPageName = () => {
    if (pathname === '/') return 'Home';
    if (pathname === '/about') return 'About';
    if (pathname.startsWith('/property')) return 'Property';
    if (pathname.startsWith('/compare')) return 'Compare';
    const cleanPath = pathname.replace(/^\//, '');
    return cleanPath.charAt(0).toUpperCase() + cleanPath.slice(1) || 'Home';
  };
  return (
    <span className="text-[10.5px] font-medium tracking-[0.18em] uppercase" style={{ color: '#f5f2ee' }}>
      {getPageName()}
    </span>
  );
}

function AnimatedNavLink({
  href,
  children,
  onClick,
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
        className="group flex w-full items-baseline justify-between py-[7px] transition-all hover:pl-1"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <span className="text-[1.5rem] font-light leading-tight" style={{ color: 'rgba(255,255,255,0.92)' }}>
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
      className="group flex w-full items-baseline justify-between py-[7px] text-left transition-all hover:pl-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className="text-[1.5rem] font-light leading-tight" style={{ color: 'rgba(255,255,255,0.92)' }}>
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

const NAV_ITEMS = [
  { label: 'About Us', href: '/about' },
  { label: 'Properties', id: 'properties' },
  { label: 'Contact', href: '/about#about-contact' },
  { label: 'Favourites', href: '/compare' },
] as const;

const ALL_NAV_ITEMS = [{ label: 'Home', href: '/' as string }, ...NAV_ITEMS.map(i => ({ ...i }))] as Array<{ label: string; href?: string; id?: string }>;

export default function FloatingNav() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const [animationPhase, setAnimationPhase] = useState<'pill' | 'morphing' | 'floating' | 'card'>('pill');
  const [menuOpen, setMenuOpen] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowH = window.innerHeight;
      const scrollHeight = document.documentElement.scrollHeight;
      const atBottom = scrollY > 0 && scrollY + windowH >= scrollHeight - 8;

      setAnimationPhase((prev) => {
        const isCard = prev === 'card' || prev === 'floating' || prev === 'morphing';
        if (atBottom && !isCard) {
          setMenuOpen(false);
          setTimeout(() => setAnimationPhase('floating'), 200);
          setTimeout(() => setAnimationPhase('card'), 500);
          return 'morphing';
        }
        if (!atBottom && isCard) {
          return 'pill';
        }
        return prev;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const scrollToSection = (sectionId: string) => {
    setMenuOpen(false);
    if (!isHomePage) {
      window.location.assign(sectionId === 'home' ? '/' : `/#${sectionId}`);
      return;
    }
    if (sectionId === 'home') {
      const lenis = (window as unknown as { lenis?: { scrollTo: (t: number) => void } }).lenis;
      if (lenis) lenis.scrollTo(0);
      else window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      const lenis = (window as unknown as { lenis?: { scrollTo: (t: number) => void } }).lenis;
      const targetY = element.getBoundingClientRect().top + window.scrollY - 80;
      if (lenis) lenis.scrollTo(targetY);
      else window.scrollTo({ top: targetY, behavior: 'smooth' });
    }
  };

  const goToContact = () => {
    setMenuOpen(false);
    if (pathname === '/') { scrollToSection('contact'); return; }
    window.location.assign('/about#about-contact');
  };

  if (pathname.startsWith('/admin')) return null;

  const isMorphing = animationPhase === 'morphing';
  const isFloating = animationPhase === 'floating';
  const isCard = animationPhase === 'card';

  return (
    <>
      {/* Morphing dot */}
      {(isMorphing || isFloating) && (
        <div
          className="fixed left-1/2 z-[9997] pointer-events-none"
          style={{
            bottom: isMorphing ? '32px' : '50%',
            transform: isMorphing
              ? 'translateX(-50%) translateY(0) scale(0)'
              : 'translateX(-50%) translateY(50%) scale(1)',
            opacity: isMorphing ? 0 : 0.95,
            transition: isMorphing
              ? 'all 0.01s'
              : 'bottom 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s, transform 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s, opacity 0.3s ease 0.05s',
          }}
        >
          <div
            style={{
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: 'rgba(0,0,0,0.95)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.1)',
            }}
          />
        </div>
      )}

      {/* Card (center of viewport) */}
      <div
        className="fixed left-1/2 top-1/2 z-[9999]"
        style={{
          transform: isCard ? 'translate(-50%,-50%) scale(1)' : 'translate(-50%,-30%) scale(0.85)',
          opacity: isCard ? 1 : 0,
          transition: 'all 0.7s cubic-bezier(0.22,1,0.36,1)',
          pointerEvents: isCard ? 'auto' : 'none',
        }}
      >
        <div className="relative" style={{ width: 320, borderRadius: 12 }}>
          {/* Soft glow */}
          <div
            className="absolute -inset-3 rounded-[20px] pointer-events-none"
            style={{ background: 'radial-gradient(circle,rgba(0,0,0,0.3) 0%,transparent 70%)', filter: 'blur(20px)' }}
          />
          <div
            className="relative"
            style={{
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(20px) saturate(160%)',
              WebkitBackdropFilter: 'blur(20px) saturate(160%)',
              borderRadius: 12,
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 0 0 1px rgba(255,255,255,0.04), 0 40px 100px -30px rgba(0,0,0,0.6)',
            }}
          >
            <div className="absolute inset-x-4 top-0 h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)' }}
            />
            <div className="px-7 pt-8 pb-7">
              <div className="flex justify-center mb-5">
                <Link href="/" className="block transition-opacity hover:opacity-70">
                  <svg width="28" height="28" viewBox="0 0 96 96" fill="none"
                    style={{ stroke: 'rgba(255,255,255,0.7)', strokeWidth: 2.2 }}>
                    <path d="M16 43L48 18L80 43" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M24 43V74H40V56H56V74H72V43" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
              </div>
              <p className="mb-5 text-[10px] font-medium tracking-[0.2em] uppercase text-center"
                style={{ color: 'rgba(255,255,255,0.45)' }}>MENU</p>
              <nav className="mb-6">
                {ALL_NAV_ITEMS.map((item, index) => (
                  <div key={item.label}
                    style={{ borderBottom: index < ALL_NAV_ITEMS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    {item.href ? (
                      <AnimatedNavLink href={item.href}>{item.label}</AnimatedNavLink>
                    ) : (
                      <AnimatedNavLink onClick={() => item.id && scrollToSection(item.id)}>{item.label}</AnimatedNavLink>
                    )}
                  </div>
                ))}
              </nav>
              <div className="mb-6 grid grid-cols-2 gap-x-4 text-[11px]">
                <div className="space-y-1.5">
                  {[['News', '#'], ['Showroom', '#']].map(([label, href]) => (
                    <a key={label} href={href}
                      className="block transition-colors duration-200"
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.9)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.45)')}
                    >{label}</a>
                  ))}
                </div>
                <div className="space-y-1.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  <p>089-999-9999</p>
                  <p>hello@sknat.co.th</p>
                </div>
              </div>
              <button
                type="button"
                onClick={goToContact}
                className="flex w-full items-center justify-center gap-2 py-[11px] transition-all duration-200"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 6,
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.2)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'transparent';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
                }}
              >
                <span style={{ fontSize: '0.7rem' }}>→</span>
                GET IN TOUCH
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pill (fixed bottom-center) */}
      <div
        ref={pillRef}
        className="fixed left-1/2 z-[9998]"
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => setMenuOpen(false)}
        style={{
          bottom: 32,
          transform: isCard
            ? 'translateX(-50%) translateY(0) scale(0)'
            : isMorphing
              ? 'translateX(-50%) translateY(0) scale(1)'
              : 'translateX(-50%)',
          opacity: isCard ? 0 : 1,
          transition: 'all 0.6s cubic-bezier(0.34,1.56,0.64,1)',
          pointerEvents: isCard ? 'none' : 'auto',
        }}
      >
        {/* Hover-triggered dropdown */}
        <div
          className="absolute left-1/2"
          style={{
            bottom: '100%',
            width: 220,
            transform: `translateX(-50%) translateY(${menuOpen ? '0' : '10px'})`,
            opacity: menuOpen ? 1 : 0,
            transition: 'all 0.35s cubic-bezier(0.22,1,0.36,1)',
            marginBottom: 8,
            zIndex: 60,
          }}
        >
          <div
            className="pointer-events-auto overflow-hidden"
            style={{
              background: 'rgba(18,18,18,0.92)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 -16px 48px -12px rgba(0,0,0,0.5), 0 4px 24px rgba(0,0,0,0.3)',
            }}
          >
            <div className="px-4 py-3">
              {ALL_NAV_ITEMS.map((item, index) => (
                <div key={item.label}
                  style={{ borderBottom: index < ALL_NAV_ITEMS.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="group flex w-full items-center justify-between py-2.5 transition-all hover:pl-1"
                    >
                      <span className="text-sm font-light" style={{ color: 'rgba(255,255,255,0.85)' }}>
                        {item.label}
                      </span>
                      <svg className="h-3 w-3 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-40 group-hover:translate-x-0"
                        fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.5)">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ) : (
                    <button
                      onClick={() => item.id && scrollToSection(item.id)}
                      className="group flex w-full items-center justify-between py-2.5 transition-all hover:pl-1"
                    >
                      <span className="text-sm font-light" style={{ color: 'rgba(255,255,255,0.85)' }}>
                        {item.label}
                      </span>
                      <svg className="h-3 w-3 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-40 group-hover:translate-x-0"
                        fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.5)">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pill bar */}
        <div
          className="flex items-center justify-center relative overflow-hidden"
          style={{
            width: isMorphing ? 38 : 'auto',
            height: isMorphing ? 38 : 'auto',
            padding: isMorphing ? 0 : '9px 22px',
            backgroundColor: isMorphing ? 'rgba(0,0,0,0.95)' : 'rgba(42,42,42,0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: isMorphing ? '50%' : 2,
            transition: 'width 0.5s cubic-bezier(0.34,1.56,0.64,1), height 0.5s cubic-bezier(0.34,1.56,0.64,1), border-radius 0.4s cubic-bezier(0.34,1.56,0.64,1), background-color 0.3s ease, padding 0.4s ease',
          }}
        >
          <div
            className="flex items-center gap-4"
            style={{
              opacity: isMorphing ? 0 : 1,
              transform: isMorphing ? 'scale(0.8)' : 'scale(1)',
              transition: 'opacity 0.25s ease, transform 0.35s cubic-bezier(0.34,1.56,0.64,1)',
            }}
          >
            {/* Logo */}
            <Link href="/" className="transition-opacity hover:opacity-70">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ stroke: '#f5f2ee', strokeWidth: 1.5 }}>
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </Link>
            <div style={{ width: 1, height: 15, backgroundColor: 'rgba(255,255,255,0.15)' }} />
            <PageNameDisplay />
            <div style={{ width: 1, height: 15, backgroundColor: 'rgba(255,255,255,0.15)' }} />
            {/* Hamburger */}
            <div
              className="flex items-center justify-center"
              style={{ width: 25, height: 25, color: '#f5f2ee' }}
            >
              {menuOpen ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" style={{ stroke: 'currentColor', strokeWidth: 1.8 }}>
                  <line x1="4" y1="4" x2="20" y2="20" />
                  <line x1="20" y1="4" x2="4" y2="20" />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" style={{ stroke: 'currentColor', strokeWidth: 1.5 }}>
                  <line x1="3" y1="8" x2="21" y2="8" />
                  <line x1="3" y1="16" x2="21" y2="16" />
                </svg>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
