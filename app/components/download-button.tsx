'use client';

import { useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { download, platformDownloads } from '@/lib/content';
import { WindowsGlyph, MacGlyph, LinuxGlyph } from './platform-icons';

// Blocks re-triggering the download for a few seconds after a click, so
// spam-clicking (or a double-fire on a slow tap) can't queue up repeat
// downloads/redirects.
const COOLDOWN_MS = 3000;

type Platform = keyof typeof platformDownloads;

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
}: {
  label: string;
  className: string;
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
    router.push(download.redirectHref);
  };

  if (!platform) {
    return (
      <Link href="/download" className={className}>
        {label}
      </Link>
    );
  }

  const file = platformDownloads[platform];
  const Glyph = glyphs[platform];

  return (
    <a
      href={file.primary.fileHref}
      download={file.primary.fileName}
      aria-disabled={cooling}
      className={
        cooling ? `${className} pointer-events-none opacity-60` : className
      }
      onClick={handleClick}
    >
      <Glyph />
      <span className="ml-2">Download for {file.name}</span>
    </a>
  );
}
