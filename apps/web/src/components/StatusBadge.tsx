import clsx from 'clsx';
import type { ProductStatus, StockStatus } from '@/lib/types';

const STOCK_STYLES: Record<StockStatus, string> = {
  IN_STOCK: 'bg-emerald-50 text-emerald-700',
  LOW_STOCK: 'bg-amber-50 text-amber-700',
  OUT_OF_STOCK: 'bg-red-50 text-red-700',
};

const STOCK_LABELS: Record<StockStatus, string> = {
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock',
};

const STATUS_STYLES: Record<ProductStatus, string> = {
  PUBLISHED: 'bg-emerald-50 text-emerald-700',
  DRAFT: 'bg-gray-100 text-gray-600',
};

export function StockBadge({ status }: { status: StockStatus }) {
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium', STOCK_STYLES[status])}>
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {STOCK_LABELS[status]}
    </span>
  );
}

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span className={clsx('inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize', STATUS_STYLES[status])}>
      {status.toLowerCase()}
    </span>
  );
}
