import DiscoveryPage from '../components/discovery-page';
import { DiffMedia, BranchMedia, PanelMedia } from '../components/media';
import { comparePage, pageMeta } from '@/lib/content';

export const metadata = pageMeta({
  path: `/${comparePage.slug}`,
  metaTitle: comparePage.metaTitle,
  metaDescription: comparePage.metaDescription,
});

export default function Page() {
  return (
    <DiscoveryPage
      page={comparePage}
      media={[
        <DiffMedia key="diff" />,
        <BranchMedia key="layers" />,
        <PanelMedia key="branches" />,
      ]}
    />
  );
}
