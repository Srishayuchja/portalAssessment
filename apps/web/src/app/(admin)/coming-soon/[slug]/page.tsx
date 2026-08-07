import Link from 'next/link';
import { Construction } from 'lucide-react';

function titleCase(slug: string): string {
  return slug
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default async function ComingSoonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const label = titleCase(slug);

  return (
    <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-gray-200 bg-white py-24 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
        <Construction size={28} />
      </div>
      <h2 className="text-lg font-semibold text-gray-900">{label} — Coming Soon</h2>
      <p className="mt-1 max-w-sm text-sm text-gray-500">
        This screen is part of the full DEALPORT kit but is out of scope for this build. Only
        Dashboard, Add Product, and Product List are implemented.
      </p>
      <Link
        href="/dashboard"
        className="mt-6 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
