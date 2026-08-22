'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { PlatformDownloads } from '@/lib/content';
import { WindowsGlyph, MacGlyph, LinuxGlyph } from './platform-glyphs';

// Blocks re-triggering the download for a few seconds after a click, so
// spam-clicking (or a double-fire on a slow tap) can't queue up repeat
// downloads/redirects.
const COOLDOWN_MS = 3000;

type Platform = keyof PlatformDownloads;

const glyphs = { windows: WindowsGlyph, macos: MacGlyph, linux: LinuxGlyph };

// User-agent sniffing only — good enough for "which installer to default to",
// never used for anything that would break if it's wrong (the /download page
// still lists every platform for anyone this misses).
function detectPlatform(): Platform | null {
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return 'windows';
  if (/Mac OS X|Macintosh/i.test(ua) && !/iPhone|iPad|iPod/i.test(ua))
    return 'macos';
  if (/Linux/i.test(ua) && !/Android/i.test(ua)) return 'linux';
  return null;
}

const noop = () => () => {};
const getServerSnapshot = () => null;

// The label goes from "Download for free" (168px) to "Download for Windows"
// (226px, the widest of the three) once the platform resolves. Without a floor,
// that swap shoves whatever sits beside the button sideways ~700ms after load —
// a mis-click hazard on a live CTA, and a layout shift. Reserving the widest
// label's width up front costs nothing and holds the row still.
const RESERVE_WIDEST_LABEL = 'min-w-[14.25rem]';

// Reads a client-only global (navigator) the hydration-safe way: the server
// render and the first client render both use getServerSnapshot (null, the
// neutral state below), then React swaps in the real detected platform right
// after hydration — no effect, no cascading setState.
function usePlatform(): Platform | null {
  return useSyncExternalStore(noop, detectPlatform, getServerSnapshot);
}

// A real file-download link (works with JS disabled once mounted) that also
// client-navigates to the Getting Started chapter on click. The `download`
// attribute forces the browser to save the file rather than navigate, so
// both actions fire from the same click without needing any anchor-cloning
// tricks. Server render (and the brief pre-mount client render) shows a
// neutral state — same as an unrecognized OS — so there's no hydration
// mismatch; `useEffect` upgrades it to the detected platform after mount.
export default function DownloadButton({
  label,
  className,
  files,
  redirectHref,
}: {
  label: string;
  className: string;
  files: PlatformDownloads;
  redirectHref: string;
}) {
  const router = useRouter();
  const [cooling, setCooling] = useState(false);
  const platform = usePlatform();

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
    if (cooling) {
      e.preventDefault();
      return;
    }
    setCooling(true);
    setTimeout(() => setCooling(false), COOLDOWN_MS);
    router.push(redirectHref);
  };

  if (!platform) {
    return (
      <Link href="/download" className={`${className} ${RESERVE_WIDEST_LABEL}`}>
        {label}
      </Link>
    );
  }

  const file = files[platform];
  const Glyph = glyphs[platform];

  return (
    <a
      href={file.primary.fileHref}
      download={file.primary.fileName}
      aria-disabled={cooling}
      className={`${className} ${RESERVE_WIDEST_LABEL}${
        cooling ? ' pointer-events-none opacity-60' : ''
      }`}
      onClick={handleClick}
    >
      <Glyph />
      <span className="ml-2">Download for {file.name}</span>
    </a>
  );
}
