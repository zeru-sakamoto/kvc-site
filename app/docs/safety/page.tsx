import type { Metadata } from 'next';
import BulletList from '../../components/bullet-list';
import { docsSafety } from '@/lib/content';

export const metadata: Metadata = {
  title: docsSafety.metaTitle,
  description: docsSafety.metaDescription,
};

export default function SafetyPage() {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
        {docsSafety.title}
      </h2>
      <div className="mt-8">
        <BulletList items={docsSafety.items} />
      </div>
    </div>
  );
}
