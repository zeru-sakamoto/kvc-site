import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FeaturePage from '../../components/feature-page';
import { pluginPage, pluginSubchapters } from '@/lib/content';

export async function generateStaticParams() {
  return pluginSubchapters.map((sub) => ({ slug: sub.slug }));
}

function findSubchapter(slug: string) {
  return pluginSubchapters.find((sub) => sub.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const sub = findSubchapter(slug);
  if (!sub) return {};
  return { title: sub.metaTitle, description: sub.metaDescription };
}

export default async function PluginSubchapterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sub = findSubchapter(slug);
  if (!sub) notFound();

  return (
    <FeaturePage
      feature={sub}
      backHref={`/${pluginPage.slug}`}
      backLabel="Krita plugin"
    />
  );
}
