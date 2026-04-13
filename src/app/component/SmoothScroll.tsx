'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Lenis from 'lenis';

const SCROLL_STORE_KEY = 'sknat_scroll_positions';

function saveScroll(key: string, y: number) {
  try {
    const store = JSON.parse(sessionStorage.getItem(SCROLL_STORE_KEY) || '{}');
    store[key] = y;
    sessionStorage.setItem(SCROLL_STORE_KEY, JSON.stringify(store));
  } catch {}
}

function getSavedScroll(key: string): number | null {
  try {
    const store = JSON.parse(sessionStorage.getItem(SCROLL_STORE_KEY) || '{}');
    return typeof store[key] === 'number' ? store[key] : null;
  } catch {
    return null;
  }
}

function pathKey(pathname: string, searchParams: URLSearchParams) {
  const qs = searchParams.toString();
  return qs ? `${pathname}?${qs}` : pathname;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isPopStateRef = useRef(false);

  const scrollToHashTarget = () => {
    if (typeof window === 'undefined') return false;

    const rawHash = window.location.hash;
    if (!rawHash) return false;

    const sectionId = decodeURIComponent(rawHash.replace('#', ''));
    if (!sectionId) return false;

    const candidateIds =
      pathname === '/about' && sectionId === 'contact'
        ? ['about-contact', 'contact']
        : [sectionId];

    const target = candidateIds
      .map((id) => document.getElementById(id))
      .find((element): element is HTMLElement => element !== null);
    if (!target) return false;

    const offsetY = 80;
    const targetY = target.getBoundingClientRect().top + window.scrollY - offsetY;

    if (lenisRef.current) {
      lenisRef.current.resize();
      lenisRef.current.scrollTo(targetY, { immediate: true });
    } else {
      window.scrollTo({ top: targetY, left: 0, behavior: 'auto' });
    }

    return true;
  };

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.2,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    // Save scroll position continuously (debounced) — keyed to current path
    let saveTimer: ReturnType<typeof setTimeout>;
    const onScroll = () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        const key = window.location.pathname + (window.location.search || '');
        saveScroll(key, window.scrollY);
      }, 100);
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Save position immediately on any pointer interaction — fires BEFORE
    // Next.js has a chance to call scrollTo(0,0) during navigation.
    // This is the most reliable snapshot of where the user actually was.
    const onPointerDown = () => {
      const key = window.location.pathname + (window.location.search || '');
      saveScroll(key, window.scrollY);
    };
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    // Detect browser back/forward button
    const onPopState = () => {
      isPopStateRef.current = true;
    };
    window.addEventListener('popstate', onPopState);

    return () => {
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('popstate', onPopState);
      clearTimeout(saveTimer);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if ('scrollRestoration' in window.history) {
      // 'auto' lets the browser restore scroll on page refresh.
      // We use popstate + sessionStorage to handle back/forward ourselves.
      window.history.scrollRestoration = 'auto';
    }

    const currentKey = pathKey(pathname, searchParams);
    // NOTE: we intentionally do NOT save window.scrollY here because by the
    // time this effect runs, Next.js may have already called scrollTo(0,0).
    // Position is captured accurately by the pointerdown + scroll listeners.

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 20;

    const tryScroll = () => {
      if (cancelled) return;

      // Hash anchor → scroll to section
      if (window.location.hash) {
        scrollToHashTarget();
        attempts += 1;
        if (attempts < maxAttempts) window.setTimeout(tryScroll, 50);
        return;
      }

      // Back/forward navigation → restore saved scroll position
      if (isPopStateRef.current) {
        isPopStateRef.current = false;
        const saved = getSavedScroll(currentKey);
        if (saved !== null && saved > 0) {
          const tryRestore = () => {
            if (cancelled) return;
            const pageHeight = document.documentElement.scrollHeight - window.innerHeight;
            const target = Math.min(saved, Math.max(pageHeight, 0));
            if (lenisRef.current) {
              lenisRef.current.resize();
              lenisRef.current.scrollTo(target, { immediate: true });
            } else {
              window.scrollTo({ top: target, behavior: 'auto' });
            }
            // Retry if page content hasn't fully rendered its height yet
            if (pageHeight < saved - 50 && attempts < maxAttempts) {
              attempts += 1;
              window.setTimeout(tryRestore, 50);
            }
          };
          tryRestore();
          return;
        }
      }

      // New navigation (link click / router.push) → scroll to top
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    };

    requestAnimationFrame(tryScroll);

    return () => {
      cancelled = true;
    };
  }, [pathname, searchParams]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onHashChange = () => {
      requestAnimationFrame(() => {
        scrollToHashTarget();
      });
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  return <>{children}</>;
}
