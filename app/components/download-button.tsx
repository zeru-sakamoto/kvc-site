'use client';

import { useRouter } from 'next/navigation';
import { download } from '@/lib/content';

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

  return (
    <a
      href={download.fileHref}
      download={download.fileName}
      className={className}
      onClick={() => router.push(download.redirectHref)}
    >
      {label}
    </a>
  );
}
