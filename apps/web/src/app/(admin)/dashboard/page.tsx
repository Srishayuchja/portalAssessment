'use client';

import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import type { Category, Product } from '@/lib/types';
import { StatCard } from '@/components/StatCard';
import { WeeklyReportChart } from '@/components/WeeklyReportChart';
import { StockBadge } from '@/components/StatusBadge';
import { UsersInsightCard } from '@/components/UsersInsightCard';
import { AddNewProductPanel } from '@/components/AddNewProductPanel';

// Static, seeded-in-frontend data: there is no Order Management API in scope for this
// assessment (explicitly out of scope per the brief), so stat cards / weekly report /
// transaction table below are static placeholders as permitted by the brief.
const TRANSACTIONS = [
  { no: 1, customer: '#6545', date: '01 Oct | 11:29 am', status: 'Paid', amount: '$64' },
  { no: 2, customer: '#5412', date: '01 Oct | 11:29 am', status: 'Pending', amount: '$557' },
  { no: 3, customer: '#6622', date: '01 Oct | 11:29 am', status: 'Paid', amount: '$156' },
  { no: 4, customer: '#6462', date: '01 Oct | 11:29 am', status: 'Paid', amount: '$265' },
  { no: 5, customer: '#5462', date: '01 Oct | 11:29 am', status: 'Paid', amount: '$265' },
];

const REPORT_METRICS = [
  { label: 'Customers', value: '52k', active: true },
  { label: 'Total Products', value: '3.5k' },
  { label: 'Stock Products', value: '2.5k' },
  { label: 'Out of Stock', value: '0.5k' },
  { label: 'Revenue', value: '250k' },
];

export default function DashboardPage() {
  const [bestSelling, setBestSelling] = useState<Product[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      api.getProducts({ limit: 4, sortBy: 'totalOrders', sortOrder: 'desc' }),
      api.getProducts({ limit: 4, sortBy: 'createdAt', sortOrder: 'desc' }),
      api.getCategories(),
    ])
      .then(([best, latest, cats]) => {
        setBestSelling(best.data);
        setTopProducts(latest.data);
        setCategories(cats);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load products'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Total Sales" subtitle="Last 7 days" value="$350K" valueLabel="Sales" delta="10.4%" footnote="Previous 7days ($235)" />
        <StatCard title="Total Orders" subtitle="Last 7 days" value="10.7K" valueLabel="order" delta="14.4%" footnote="Previous 7days (7.6k)" />
        <StatCard title="Pending & Canceled" subtitle="Last 7 days" value="509" valueLabel="Pending" delta="14.4%" positive={false} footnote="Canceled 94" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[739fr_361fr]">
        <div className="flex h-[460px] flex-col rounded-lg border border-gray-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Report for this week</h3>
            <div className="flex overflow-hidden rounded-full border border-gray-200 text-xs font-medium">
              <span className="bg-emerald-600 px-3 py-1.5 text-white">This week</span>
              <span className="px-3 py-1.5 text-gray-500">Last week</span>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap gap-6 border-b border-gray-100 pb-4">
            {REPORT_METRICS.map((m) => (
              <div key={m.label} className={m.active ? 'border-b-2 border-emerald-600 pb-1' : 'pb-1'}>
                <p className="text-lg font-semibold text-gray-900">{m.value}</p>
                <p className="text-xs text-gray-400">{m.label}</p>
              </div>
            ))}
          </div>

          <div className="flex-1">
            <WeeklyReportChart />
          </div>
        </div>

        <UsersInsightCard />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[808fr_292fr]">
        <div className="flex h-[420px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-gray-900">Transaction</h3>
            <button className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
              Filter
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-gray-400 uppercase">
                <tr>
                  <th className="px-5 py-2 font-medium">No</th>
                  <th className="px-5 py-2 font-medium">Id Customer</th>
                  <th className="px-5 py-2 font-medium">Order Date</th>
                  <th className="px-5 py-2 font-medium">Status</th>
                  <th className="px-5 py-2 font-medium">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {TRANSACTIONS.map((t) => (
                  <tr key={t.no}>
                    <td className="px-5 py-3 text-gray-500">{t.no}</td>
                    <td className="px-5 py-3 font-medium text-gray-900">{t.customer}</td>
                    <td className="px-5 py-3 text-gray-500">{t.date}</td>
                    <td className="px-5 py-3">
                      <span
                        className={
                          t.status === 'Paid'
                            ? 'inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700'
                            : 'inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700'
                        }
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {t.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-900">{t.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end px-5 py-4">
            <button className="rounded-full border border-emerald-200 px-4 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50">
              Details
            </button>
          </div>
        </div>

        <div className="flex h-[420px] flex-col gap-4 rounded-lg border border-gray-200 bg-white pt-5 pr-4 pb-5 pl-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Top Products</h3>
            <span className="text-xs font-medium text-emerald-600">All product</span>
          </div>
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              disabled
              placeholder="Search"
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pr-3 pl-9 text-sm text-gray-400 outline-none"
            />
          </div>

          {isLoading && <p className="text-sm text-gray-400">Loading...</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <ul className="flex-1 space-y-3 overflow-y-auto">
            {topProducts.map((p) => (
              <li key={p.id} className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-400">Item: #{p.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <span className="text-sm font-medium text-gray-900">${Number(p.price).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[739fr_361fr]">
        <div className="flex h-[430px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h3 className="text-sm font-semibold text-gray-900">Best selling product</h3>
            <button className="rounded-full bg-emerald-600 px-4 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
              Filter
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-emerald-50 text-xs text-emerald-700 uppercase">
                <tr>
                  <th className="px-5 py-2.5 font-medium">Product</th>
                  <th className="px-5 py-2.5 font-medium">Total Order</th>
                  <th className="px-5 py-2.5 font-medium">Status</th>
                  <th className="px-5 py-2.5 font-medium">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {bestSelling.map((p) => (
                  <tr key={p.id}>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.images[0]} alt={p.name} className="h-9 w-9 rounded-lg object-cover" />
                        <span className="font-medium text-gray-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500">{p.totalOrders}</td>
                    <td className="px-5 py-3">
                      <StockBadge status={p.stockStatus} />
                    </td>
                    <td className="px-5 py-3 font-medium text-gray-900">${Number(p.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end px-5 py-4">
            <button className="rounded-full border border-emerald-200 px-4 py-1.5 text-xs font-medium text-emerald-700 hover:bg-emerald-50">
              Details
            </button>
          </div>
        </div>

        <AddNewProductPanel categories={categories} products={topProducts} />
      </div>
    </div>
  );
}
