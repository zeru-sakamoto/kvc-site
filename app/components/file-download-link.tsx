'use client';

import { useState } from 'react';

// Blocks re-triggering a download for a few seconds after a click — see
// download-button.tsx, which has the same cooldown plus a redirect on top.
const COOLDOWN_MS = 3000;

export default function FileDownloadLink({
  fileHref,
  fileName,
  className,
  children,
}: {
  fileHref: string;
  fileName: string;
  className: string;
  children: React.ReactNode;
}) {
  const [cooling, setCooling] = useState(false);

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (cooling) {
      e.preventDefault();
      return;
    }
    setCooling(true);
    setTimeout(() => setCooling(false), COOLDOWN_MS);
  };

  return (
    <a
      href={fileHref}
      download={fileName}
      aria-disabled={cooling}
      className={
        cooling ? `${className} pointer-events-none opacity-60` : className
      }
      onClick={handleClick}
    >
      {children}
    </a>
  );
}
