"use client";

import { useEffect, useState } from "react";

export default function BootSplash() {
  const [isHidden, setIsHidden] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => {
      setIsHidden(true);
    }, 1900);

    const removeTimer = window.setTimeout(() => {
      setIsRemoved(true);
    }, 2450);

    return () => {
      window.clearTimeout(hideTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (isRemoved) {
    return null;
  }

  return (
    <div 
      className={`sknat-splash ${isHidden ? "is-hidden" : ""}`} 
      role="status" 
      aria-live="polite"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#f5f2ee', // Light cream background
        transition: 'opacity 0.45s ease, visibility 0.45s ease',
      }}
    >
      <div 
        className="sknat-splash__content"
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.55rem',
          color: '#1a1a1a',
        }}
      >
        <svg 
          className="sknat-logo" 
          viewBox="0 0 96 96" 
          aria-hidden="true"
          style={{
            width: '6.4rem',
            height: '6.4rem',
          }}
        >
          <path
            className="sknat-logo__house"
            d="M16 43L48 18L80 43M24 43V74H40V56H56V74H72V43"
            style={{
              fill: 'none',
              stroke: '#1a1a1a',
              strokeWidth: 2.4,
              strokeLinecap: 'round',
              strokeLinejoin: 'round',
            }}
          />
          <rect 
            className="sknat-logo__door-frame" 
            x="40" y="56" width="16" height="18" rx="1.4" 
            style={{
              fill: 'none',
              stroke: '#666',
              strokeWidth: 1.2,
            }}
          />
          <rect 
            className="sknat-logo__door-loader" 
            x="40" y="74" width="16" height="0" rx="1.4" 
            style={{
              fill: '#1a1a1a',
            }}
          />
        </svg>
        <p 
          className="sknat-splash__brand"
          style={{
            margin: 0,
            fontSize: '1.08rem',
            fontWeight: 600,
            letterSpacing: '0.42rem',
            textIndent: '0.42rem',
            color: '#1a1a1a',
          }}
        >SKNAT</p>
        <p 
          className="sknat-splash__hint"
          style={{
            margin: 0,
            fontSize: '0.68rem',
            letterSpacing: '0.18rem',
            textTransform: 'uppercase',
            color: '#666',
          }}
        >loading</p>
      </div>
    </div>
  );
}
