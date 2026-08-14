import DiscoveryPage from '../components/discovery-page';
import {
  OwnershipMedia,
  PerformanceMedia,
  BranchMedia,
} from '../components/media';
import { backupPage, pageMeta } from '@/lib/content';

export const metadata = pageMeta({
  path: `/${backupPage.slug}`,
  metaTitle: backupPage.metaTitle,
  metaDescription: backupPage.metaDescription,
});

export default function Page() {
  return (
    <DiscoveryPage
      page={backupPage}
      media={[
        <OwnershipMedia key="pile" />,
        <PerformanceMedia key="size" />,
        <BranchMedia key="yours" />,
      ]}
    />
  );
}
