import Link from 'next/link';
import { Plus, ChevronRight, Smartphone, Shirt, Home as HomeIcon, Sparkles, Dumbbell, Package } from 'lucide-react';
import type { Category, Product } from '@/lib/types';

const CATEGORY_ICONS: Record<string, typeof Package> = {
  Electronic: Smartphone,
  Fashion: Shirt,
  Home: HomeIcon,
  Beauty: Sparkles,
  Sports: Dumbbell,
};

export function AddNewProductPanel({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  return (
    <div className="flex h-[610px] flex-col overflow-y-auto rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">Add New Product</h3>
        <Link
          href="/products/new"
          className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
        >
          <Plus size={14} />
          Add New
        </Link>
      </div>

      <p className="mt-4 mb-2 text-xs font-medium text-gray-400 uppercase">Categories</p>
      <ul className="space-y-2">
        {categories.slice(0, 3).map((category) => {
          const Icon = CATEGORY_ICONS[category.name] ?? Package;
          return (
            <li key={category.id}>
              <div className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-2 text-sm">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                  <Icon size={16} />
                </span>
                <span className="flex-1 font-medium text-gray-700">{category.name}</span>
                <ChevronRight size={14} className="text-gray-300" />
              </div>
            </li>
          );
        })}
      </ul>
      {categories.length > 3 && (
        <Link href="/products" className="mt-2 block text-xs font-medium text-emerald-600 hover:text-emerald-700">
          See more
        </Link>
      )}

      <p className="mt-5 mb-2 text-xs font-medium text-gray-400 uppercase">Product</p>
      <ul className="space-y-3">
        {products.slice(0, 3).map((product) => (
          <li key={product.id} className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.images[0]} alt={product.name} className="h-9 w-9 rounded-lg object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-gray-900">{product.name}</p>
              <p className="text-xs text-gray-400">${Number(product.price).toFixed(2)}</p>
            </div>
            <span className="flex items-center gap-1 rounded-full bg-emerald-600 px-3 py-1 text-xs font-medium text-white">
              <Plus size={12} />
              Add
            </span>
          </li>
        ))}
      </ul>
      <Link href="/products" className="mt-2 block text-xs font-medium text-emerald-600 hover:text-emerald-700">
        See more
      </Link>
    </div>
  );
}
