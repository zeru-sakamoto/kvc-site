import DiscoveryPage from '../components/discovery-page';
import { BranchMedia, PanelMedia, DiffMedia } from '../components/media';
import { recoverAfterCrashPage, pageMeta } from '@/lib/content';

export const metadata = pageMeta({
  path: `/${recoverAfterCrashPage.slug}`,
  metaTitle: recoverAfterCrashPage.metaTitle,
  metaDescription: recoverAfterCrashPage.metaDescription,
});

export default function Page() {
  return (
    <DiscoveryPage
      page={recoverAfterCrashPage}
      media={[
        <BranchMedia key="history" />,
        <PanelMedia key="panel" />,
        <DiffMedia key="goback" />,
      ]}
    />
  );
}
