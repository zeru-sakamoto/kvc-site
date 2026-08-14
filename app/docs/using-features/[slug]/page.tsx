import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FeaturePage from '../../../components/feature-page';
import { docsFeatures, docsUsingFeatures, pageMeta } from '@/lib/content';

export async function generateStaticParams() {
  return docsFeatures.map((feature) => ({ slug: feature.slug }));
}

function findFeature(slug: string) {
  return docsFeatures.find((feature) => feature.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const feature = findFeature(slug);
  if (!feature) return {};
  return pageMeta({
    path: `/docs/${docsUsingFeatures.slug}/${feature.slug}`,
    metaTitle: feature.metaTitle,
    metaDescription: feature.metaDescription,
  });
}

export default async function UsingFeatureDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const feature = findFeature(slug);
  if (!feature) notFound();

  return (
    <FeaturePage
      feature={feature}
      backHref={`/docs/${docsUsingFeatures.slug}`}
      backLabel={docsUsingFeatures.label}
    />
  );
}
