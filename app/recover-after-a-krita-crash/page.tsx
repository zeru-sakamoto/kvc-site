import type { Metadata } from 'next';
import DiscoveryPage from '../components/discovery-page';
import { BranchMedia, PanelMedia, DiffMedia } from '../components/media';
import { recoverAfterCrashPage } from '@/lib/content';

export const metadata: Metadata = {
  title: recoverAfterCrashPage.metaTitle,
  description: recoverAfterCrashPage.metaDescription,
  alternates: { canonical: `/${recoverAfterCrashPage.slug}` },
  openGraph: {
    type: 'article',
    url: `/${recoverAfterCrashPage.slug}`,
    title: recoverAfterCrashPage.metaTitle,
    description: recoverAfterCrashPage.metaDescription,
  },
  twitter: {
    title: recoverAfterCrashPage.metaTitle,
    description: recoverAfterCrashPage.metaDescription,
  },
};

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
