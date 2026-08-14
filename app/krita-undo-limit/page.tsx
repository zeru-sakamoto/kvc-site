import DiscoveryPage from '../components/discovery-page';
import { BranchMedia, DiffMedia, OwnershipMedia } from '../components/media';
import { undoLimitPage, pageMeta } from '@/lib/content';

export const metadata = pageMeta({
  path: `/${undoLimitPage.slug}`,
  metaTitle: undoLimitPage.metaTitle,
  metaDescription: undoLimitPage.metaDescription,
});

export default function Page() {
  return (
    <DiscoveryPage
      page={undoLimitPage}
      media={[
        <BranchMedia key="stack" />,
        <DiffMedia key="versions" />,
        <OwnershipMedia key="reversible" />,
      ]}
    />
  );
}
