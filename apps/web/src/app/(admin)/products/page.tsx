'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Plus, Search, Trash2 } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import type { Category, Product, ProductStatus } from '@/lib/types';
import { ProductStatusBadge, StockBadge } from '@/components/StatusBadge';

const LIMIT = 8;

export default function ProductListPage() {
  return (
    <Suspense fallback={null}>
      <ProductList />
    </Suspense>
  );
}

function ProductList() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<ProductStatus | ''>('');
  const [categoryId, setCategoryId] = useState(searchParams.get('categoryId') ?? '');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(true);
      setError(null);
      api
        .getProducts({
          search: search || undefined,
          status: status || undefined,
          categoryId: categoryId || undefined,
          page,
          limit: LIMIT,
        })
        .then((res) => {
          setProducts(res.data);
          setTotal(res.meta.total);
          setTotalPages(res.meta.totalPages);
        })
        .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load products'))
        .finally(() => setIsLoading(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [search, status, categoryId, page]);

  async function handleDelete(id: string) {
    if (!confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setTotal((prev) => prev - 1);
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Failed to delete product');
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              placeholder="Search products..."
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-3 pl-9 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <select
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value as ProductStatus | '');
            }}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">All statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>

          <select
            value={categoryId}
            onChange={(e) => {
              setPage(1);
              setCategoryId(e.target.value);
            }}
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <Link
          href="/products/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                  Loading products...
                </td>
              </tr>
            )}

            {!isLoading && error && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-red-500">
                  {error}
                </td>
              </tr>
            )}

            {!isLoading && !error && products.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-400">
                  No products found.
                </td>
              </tr>
            )}

            {!isLoading &&
              !error &&
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="h-10 w-10 shrink-0 rounded-lg object-cover"
                      />
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{product.category?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-500">{product.totalOrders}</td>
                  <td className="px-4 py-3">
                    <StockBadge status={product.stockStatus} />
                  </td>
                  <td className="px-4 py-3">
                    <ProductStatusBadge status={product.status} />
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {product.discountPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">${Number(product.discountPrice).toFixed(2)}</span>
                        <span className="text-xs text-gray-400 line-through">
                          ${Number(product.price).toFixed(2)}
                        </span>
                      </div>
                    ) : (
                      <span>${Number(product.price).toFixed(2)}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600"
                      aria-label={`Delete ${product.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 text-sm text-gray-500">
          <span>
            {total === 0 ? 0 : (page - 1) * LIMIT + 1}–{Math.min(page * LIMIT, total)} of {total}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="rounded-lg border border-gray-200 px-3 py-1.5 disabled:opacity-40"
            >
              Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="rounded-lg border border-gray-200 px-3 py-1.5 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
