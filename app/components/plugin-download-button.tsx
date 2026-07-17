'use client';

import { useState } from 'react';
import { pluginDownload } from '@/lib/content';

// Same click-cooldown as the app installer's DownloadButton — see that file.
const COOLDOWN_MS = 3000;

export default function PluginDownloadButton({
  className,
}: {
  className: string;
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
      href={pluginDownload.fileHref}
      download={pluginDownload.fileName}
      aria-disabled={cooling}
      className={
        cooling ? `${className} pointer-events-none opacity-60` : className
      }
      onClick={handleClick}
    >
      Download the plugin
    </a>
  );
}
