import clsx from 'clsx';
import type { ProductStatus, StockStatus } from '@/lib/types';

const STOCK_STYLES: Record<StockStatus, string> = {
  IN_STOCK: 'bg-success/10 text-success',
  LOW_STOCK: 'bg-pending/10 text-pending',
  OUT_OF_STOCK: 'bg-error/10 text-error',
};

const STOCK_LABELS: Record<StockStatus, string> = {
  IN_STOCK: 'In Stock',
  LOW_STOCK: 'Low Stock',
  OUT_OF_STOCK: 'Out of Stock',
};

const STATUS_STYLES: Record<ProductStatus, string> = {
  PUBLISHED: 'bg-success/10 text-success',
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
