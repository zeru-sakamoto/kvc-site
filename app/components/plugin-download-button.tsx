import FileDownloadLink from './file-download-link';
import { pluginDownload } from '@/lib/content';

export default function PluginDownloadButton({
  className,
}: {
  className: string;
}) {
  return (
    <FileDownloadLink
      fileHref={pluginDownload.fileHref}
      fileName={pluginDownload.fileName}
      className={className}
    >
      Download the plugin
    </FileDownloadLink>
  );
}
