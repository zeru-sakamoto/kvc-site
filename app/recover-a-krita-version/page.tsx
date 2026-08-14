import DiscoveryPage from '../components/discovery-page';
import { BranchMedia, DiffMedia, OwnershipMedia } from '../components/media';
import { recoverPage, pageMeta } from '@/lib/content';

export const metadata = pageMeta({
  path: `/${recoverPage.slug}`,
  metaTitle: recoverPage.metaTitle,
  metaDescription: recoverPage.metaDescription,
});

export default function Page() {
  return (
    <DiscoveryPage
      page={recoverPage}
      media={[
        <BranchMedia key="restore" />,
        <DiffMedia key="find" />,
        <OwnershipMedia key="goback" />,
      ]}
    />
  );
}
