import Link from 'next/link';
import { CirclePlus, ChevronRight, Smartphone, Shirt, Home as HomeIcon, Sparkles, Dumbbell, Package } from 'lucide-react';
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
  const FEATURED_CATEGORY_ORDER = ['Electronic', 'Fashion', 'Home'];
  const featuredCategories = FEATURED_CATEGORY_ORDER.map((name) => categories.find((c) => c.name === name)).filter(
    (c): c is Category => c != null,
  );

  return (
    <div className="flex h-[640px] flex-col overflow-y-auto rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[#23272e] [font-family:var(--font-lato),sans-serif] [font-size:18px] [letter-spacing:0%] [line-height:26px]">
          Add New Product
        </h3>
        <Link
          href="/products/new"
          className="flex items-center gap-1 text-xs font-medium text-accent hover:text-accent/80"
        >
          <CirclePlus size={14} />
          Add New
        </Link>
      </div>

      <p className="mt-4 mb-[18px] font-normal text-[#6a717f] [font-size:14px] [letter-spacing:-0.28px] [line-height:100%]">Categories</p>
      <ul className="space-y-2">
        {featuredCategories.map((category) => {
          const Icon = CATEGORY_ICONS[category.name] ?? Package;
          return (
            <li key={category.id}>
              <Link
                href={`/products?categoryId=${category.id}`}
                className="flex items-center gap-3 rounded-lg border border-gray-100 px-3 py-[7px] text-sm hover:bg-gray-50"
              >
                {category.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-[45px] w-[45px] rounded-lg border border-gray-200 object-cover"
                  />
                ) : (
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-gray-500">
                    <Icon size={18} />
                  </span>
                )}
                <span className="flex-1 font-normal text-black [font-size:16px] [letter-spacing:-0.36px] [line-height:100%]">{category.name}</span>
                <ChevronRight size={18} className="text-black" />
              </Link>
            </li>
          );
        })}
      </ul>
      {categories.length > 3 && (
        <Link href="/products" className="mt-[13px] block text-center text-xs font-medium text-accent hover:text-accent/80">
          See more
        </Link>
      )}

      <p className="mt-5 mb-[13px] font-normal text-[#6a717f] [font-size:14px] [letter-spacing:-0.28px] [line-height:100%]">Product</p>
      <ul className="divide-y divide-gray-100">
        {products.slice(0, 3).map((product) => (
          <li key={product.id} className="flex items-center gap-3 py-3 first:pt-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.images[0]} alt={product.name} className="h-[45px] w-[45px] rounded-lg object-cover" />
            <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
              <p className="truncate font-normal text-black [font-size:14px] [letter-spacing:-0.28px] [line-height:100%]">{product.name}</p>
              <p className="font-semibold text-[#4ea674] [font-size:14px] [letter-spacing:-0.28px] [line-height:100%]">${Number(product.price).toFixed(2)}</p>
            </div>
            <Link
              href={`/products/new?from=${product.id}`}
              className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-medium text-white hover:bg-primary/90"
            >
              <CirclePlus size={12} />
              Add
            </Link>
          </li>
        ))}
      </ul>
      <Link
        href="/products"
        className="mt-2 mb-[3px] block border-t border-gray-100 pt-[15px] text-center text-xs font-medium text-accent hover:text-accent/80"
      >
        See more
      </Link>
    </div>
  );
}
