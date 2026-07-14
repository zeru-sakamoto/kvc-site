import type { Metadata } from 'next';
import DiscoveryPage from '../components/discovery-page';
import {
  OwnershipMedia,
  PerformanceMedia,
  DiffMedia,
} from '../components/media';
import { vsCopiesPage } from '@/lib/content';

export const metadata: Metadata = {
  title: vsCopiesPage.metaTitle,
  description: vsCopiesPage.metaDescription,
  alternates: { canonical: `/${vsCopiesPage.slug}` },
  openGraph: {
    type: 'article',
    url: `/${vsCopiesPage.slug}`,
    title: vsCopiesPage.metaTitle,
    description: vsCopiesPage.metaDescription,
  },
  twitter: {
    title: vsCopiesPage.metaTitle,
    description: vsCopiesPage.metaDescription,
  },
};

export default function Page() {
  return (
    <DiscoveryPage
      page={vsCopiesPage}
      media={[
        <OwnershipMedia key="pile" />,
        <PerformanceMedia key="savings" />,
        <DiffMedia key="diff" />,
      ]}
    />
  );
}
