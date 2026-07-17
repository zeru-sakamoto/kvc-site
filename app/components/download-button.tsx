'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { download } from '@/lib/content';
import { WindowsGlyph } from './platform-icons';

// Blocks re-triggering the download for a few seconds after a click, so
// spam-clicking (or a double-fire on a slow tap) can't queue up repeat
// downloads/redirects.
const COOLDOWN_MS = 3000;

// A real file-download link (works with JS disabled) that also client-navigates
// to the Getting Started chapter on click. The `download` attribute forces the
// browser to save the file rather than navigate, so both actions fire from the
// same click without needing any anchor-cloning tricks.
export default function DownloadButton({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  const router = useRouter();
  const [cooling, setCooling] = useState(false);

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (cooling) {
      e.preventDefault();
      return;
    }
    setCooling(true);
    setTimeout(() => setCooling(false), COOLDOWN_MS);
    router.push(download.redirectHref);
  };

  return (
    <a
      href={download.fileHref}
      download={download.fileName}
      aria-disabled={cooling}
      className={
        cooling ? `${className} pointer-events-none opacity-60` : className
      }
      onClick={handleClick}
    >
      {/* Windows glyph — the installer is Windows-only for now (see PlatformIcons). */}
      <WindowsGlyph />
      <span className="ml-2">{label}</span>
    </a>
  );
}
