'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Lenis from 'lenis';

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
      lenisRef.current.scrollTo(targetY, { immediate: true });
    } else {
      window.scrollTo({ top: targetY, left: 0, behavior: 'auto' });
    }

    return true;
  };

  useEffect(() => {
    // Initialize Lenis with heavy/smooth feel like fluid.glass
    const lenis = new Lenis({
      duration: 1.4,           // Higher = slower/heavier feel
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth exponential easing
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.85,   // Slightly slower wheel scrolling for weight
      touchMultiplier: 1.2,
    });

    lenisRef.current = lenis;

    // RAF loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Expose lenis globally for scrollTo
    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    return () => {
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Prevent browser restoring previous scroll on route navigation.
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    let cancelled = false;
    let attempts = 0;
    const maxAttempts = 14;

    const tryScroll = () => {
      if (cancelled) return;

      const didScrollToHash = scrollToHashTarget();

      if (didScrollToHash) return;

      // When there is no hash, keep default behavior: always reset to top on route changes.
      if (!window.location.hash) {
        if (lenisRef.current) {
          lenisRef.current.scrollTo(0, { immediate: true });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        }
        return;
      }

      // If hash target isn't mounted yet, retry briefly.
      attempts += 1;
      if (attempts < maxAttempts) {
        window.setTimeout(tryScroll, 50);
      }
    };

    // Wait one frame so the next route's layout has mounted.
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
