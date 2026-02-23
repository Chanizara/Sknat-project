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
    <div className={`sknat-splash ${isHidden ? "is-hidden" : ""}`} role="status" aria-live="polite">
      <div className="sknat-splash__backdrop" />
      <div className="sknat-splash__content">
        <svg className="sknat-logo" viewBox="0 0 96 96" aria-hidden="true">
          <path
            className="sknat-logo__house"
            d="M16 43L48 18L80 43M24 43V74H40V56H56V74H72V43"
          />
          <rect className="sknat-logo__door-frame" x="40" y="56" width="16" height="18" rx="1.4" />
          <rect className="sknat-logo__door-loader" x="40" y="74" width="16" height="0" rx="1.4" />
        </svg>
        <p className="sknat-splash__brand">SKNAT</p>
        <p className="sknat-splash__hint">loading</p>
      </div>
    </div>
  );
}
