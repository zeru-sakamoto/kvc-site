import type { Metadata } from 'next';
import DiscoveryPage from '../components/discovery-page';
import { BranchMedia, DiffMedia, OwnershipMedia } from '../components/media';
import { recoverPage } from '@/lib/content';

export const metadata: Metadata = {
  title: recoverPage.metaTitle,
  description: recoverPage.metaDescription,
  alternates: { canonical: `/${recoverPage.slug}` },
  openGraph: {
    type: 'article',
    url: `/${recoverPage.slug}`,
    title: recoverPage.metaTitle,
    description: recoverPage.metaDescription,
  },
  twitter: {
    title: recoverPage.metaTitle,
    description: recoverPage.metaDescription,
  },
};

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
