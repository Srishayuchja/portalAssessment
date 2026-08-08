'use client';

import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { ListFilter, Search } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import type { Category, Product } from '@/lib/types';
import { StatCard } from '@/components/StatCard';
import { WeeklyReportChart } from '@/components/WeeklyReportChart';
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
  { label: 'Customers', value: '52k' },
  { label: 'Total Products', value: '3.5k' },
  { label: 'Stock Products', value: '2.5k' },
  { label: 'Out of Stock', value: '0.5k' },
  { label: 'Revenue', value: '250k' },
];

export default function DashboardPage() {
  const [bestSelling, setBestSelling] = useState<Product[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [newProductPicks, setNewProductPicks] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState('Customers');
  const [productSearch, setProductSearch] = useState('');

  useEffect(() => {
    Promise.all([
      api.getProducts({ limit: 4, sortBy: 'totalOrders', sortOrder: 'desc' }),
      api.getProducts({ limit: 4, sortBy: 'createdAt', sortOrder: 'desc' }),
      api.getProducts({ limit: 3, sortBy: 'createdAt', sortOrder: 'asc' }),
      api.getCategories(),
    ])
      .then(([best, latest, oldest, cats]) => {
        setBestSelling(best.data);
        setTopProducts(latest.data);
        setNewProductPicks(oldest.data);
        setCategories(cats);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Failed to load products'))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Total Sales" subtitle="Last 7 days" value="$350K" valueLabel="Sales" delta="10.4%" footnote="Previous 7days" footnoteValue="($235)" />
        <StatCard title="Total Orders" subtitle="Last 7 days" value="10.7K" valueLabel="order" delta="14.4%" footnote="Previous 7days" footnoteValue="(7.6k)" />
        <StatCard
          title="Pending & Canceled"
          subtitle="Last 7 days"
          columns={[
            { label: 'Pending', value: '509', sub: 'user 204' },
            { label: 'Canceled', value: '94', delta: '14.4%', positive: false },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[739fr_361fr]">
        <div className="flex h-[420px] flex-col rounded-xl border border-gray-200 bg-white pt-5 pr-5 pb-[10px] pl-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="card-title text-gray-900">Report for this week</h3>
            <div className="flex items-center gap-3">
              <div className="flex overflow-hidden rounded-lg border border-gray-200 text-xs font-medium">
                <span className="bg-primary/10 px-3 py-1.5 text-primary">This week</span>
                <span className="px-3 py-1.5 text-gray-500">Last week</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/images/icons/DotsHorizontal.svg"
                alt="More options"
                className="h-4 w-4"
              />
            </div>
          </div>

          <div className="mb-[2px] flex flex-wrap gap-[80px] pl-[20px]">
            {REPORT_METRICS.map((m) => (
              <button
                key={m.label}
                type="button"
                onClick={() => setActiveMetric(m.label)}
                className={clsx(
                  'border-b-[3px] pb-[10px] text-left',
                  m.label === activeMetric ? 'border-primary' : 'border-gray-200',
                )}
              >
                <p className="card-value card-value--sm text-secondary">{m.value}</p>
                <p className="card-subtitle mt-[5px] text-gray-400">{m.label}</p>
              </button>
            ))}
          </div>

          <div className="mt-[5px] flex-1">
            <WeeklyReportChart />
          </div>
        </div>

        <UsersInsightCard />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[783fr_317fr]">
        <div className="flex h-[405px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between py-4 pr-5 pl-[25px]">
            <h3 className="card-title text-gray-900">Transaction</h3>
            <button className="relative right-[5px] flex items-center gap-1.5 rounded-md bg-primary px-[17px] py-[5.5px] text-xs font-medium text-white hover:bg-primary/90">
              Filter
              <ListFilter size={12} />
            </button>
          </div>
          <div className="flex-1">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-gray-300">
                <tr>
                  <th className="table-label pt-2 pr-5 pb-[11px] pl-[30px] lg:pr-[95px]">No</th>
                  <th className="table-label pt-2 pr-5 pb-[11px] pl-5 lg:pr-[105px]">Id Customer</th>
                  <th className="table-label pt-2 pr-5 pb-[11px] pl-5 lg:pr-[100px]">Order Date</th>
                  <th className="table-label pt-2 pr-5 pb-[11px] pl-5 lg:pr-[100px]">Status</th>
                  <th className="table-label pt-2 px-5 pb-[11px]">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr aria-hidden="true">
                  <td className="h-[13px] p-0" colSpan={5} />
                </tr>
                {TRANSACTIONS.map((t, i) => (
                  <Fragment key={t.no}>
                    {i > 0 && (
                      <tr aria-hidden="true">
                        <td className="h-[10px] p-0" colSpan={5} />
                      </tr>
                    )}
                    <tr>
                      <td className="table-cell py-3 pr-5 pl-[30px] lg:pr-[95px]">{t.no}.</td>
                      <td className="table-cell py-3 pr-5 pl-5 lg:pr-[105px]">{t.customer}</td>
                      <td className="table-cell py-3 pr-5 pl-5 whitespace-nowrap [word-spacing:5px] lg:pr-[100px]">{t.date}</td>
                      <td className="table-cell py-3 pr-5 pl-5 lg:pr-[100px]">
                        <span className="flex items-center gap-1.5">
                          <span className={clsx('h-1.5 w-1.5 rounded-full', t.status === 'Paid' ? 'bg-success' : 'bg-pending')} />
                          {t.status}
                        </span>
                      </td>
                      <td className="table-cell px-5 py-3">{t.amount}</td>
                    </tr>
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end px-5 pt-[11px] pb-4">
            <button className="rounded-full border border-accent/60 px-4 py-1.5 text-xs font-medium text-accent hover:bg-accent/10">
              Details
            </button>
          </div>
        </div>

        <div className="flex h-[405px] flex-col gap-4 rounded-lg border border-gray-200 bg-white pt-5 pr-4 pb-5 pl-4">
          <div className="flex items-center justify-between">
            <h3 className="card-title relative left-[5px] text-gray-900">Top Products</h3>
            <Link href="/products" className="relative left-[-5px] text-xs font-medium text-accent hover:underline">
              All product
            </Link>
          </div>
          <div className="relative">
            <Search size={18} strokeWidth={1.5} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
            <input
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              placeholder="Search"
              className="w-full rounded-lg bg-gray-50 py-2 pr-3 pl-9 font-normal text-black outline-none placeholder:text-[#6a717f] [font-size:14px] [letter-spacing:0%] [line-height:100%]"
            />
          </div>

          {isLoading && <p className="text-sm text-gray-400">Loading...</p>}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <ul className="flex-1 divide-y divide-gray-300 overflow-y-auto">
            {topProducts
              .filter((p) => p.name.toLowerCase().includes(productSearch.trim().toLowerCase()))
              .map((p) => (
              <li key={p.id} className="flex items-center gap-3 border-gray-300 py-3 first:pt-0 last:border-b last:pb-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.images[0]} alt={p.name} className="h-[45px] w-[45px] rounded-lg object-cover" />
                <div className="flex min-w-0 flex-1 flex-col gap-[10px]">
                  <p className="truncate font-medium text-secondary [font-size:15px] [letter-spacing:-0.15px] [line-height:100%]">{p.name}</p>
                  <p className="font-normal text-gray-400 [font-size:12px] [letter-spacing:0px] [line-height:100%]">Item: #{p.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <span className="relative left-[-20px] text-right align-middle font-semibold text-secondary [font-size:15px] [letter-spacing:0px] [line-height:22px]">${Number(p.price).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[739fr_361fr]">
        <div className="flex h-[430px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="flex items-center justify-between px-5 py-4">
            <h3 className="card-title text-gray-900">Best selling product</h3>
            <button className="flex items-center gap-1.5 rounded-md bg-primary px-4 py-1.5 text-xs font-medium text-white hover:bg-primary/90">
              Filter
              <ListFilter size={12} />
            </button>
          </div>
          <div className="mx-5 flex-1 overflow-y-auto">
            <div className="mt-4 grid grid-cols-[3fr_1fr_1fr_1fr] items-center rounded-lg bg-[#eaf8e7] px-5 py-2.5 font-medium text-[#6a717f] uppercase [font-family:var(--font-public-sans),sans-serif] [font-size:13px] [letter-spacing:0px] [line-height:100%]">
              <span>Product</span>
              <span>Total Order</span>
              <span>Status</span>
              <span>Price</span>
            </div>
            {bestSelling.map((p) => {
              const inStock = p.stockStatus !== 'OUT_OF_STOCK';
              return (
                <div key={p.id} className="grid grid-cols-[3fr_1fr_1fr_1fr] items-center px-5 py-3 text-sm">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.images[0]} alt={p.name} className="h-[40px] w-[40px] rounded-lg object-cover" />
                    <span className="font-bold text-[#023337] [font-size:15px] [letter-spacing:-0.15px] [line-height:100%]">{p.name}</span>
                  </div>
                  <span className="align-middle font-normal text-[#23272e] [font-size:15px] [letter-spacing:0px] [line-height:22px]">{p.totalOrders}</span>
                  <span
                    className={clsx(
                      'flex items-center gap-1.5 align-middle font-normal [font-family:var(--font-public-sans),sans-serif] [font-size:15px] [letter-spacing:0px] [line-height:22px]',
                      inStock ? 'text-success' : 'text-error',
                    )}
                  >
                    <span className={clsx('h-1.5 w-1.5 rounded-full', inStock ? 'bg-success' : 'bg-error')} />
                    {inStock ? 'Stock' : 'Stock out'}
                  </span>
                  <span className="text-left align-middle font-bold text-[#023337] [font-size:15px] [letter-spacing:0px] [line-height:22px]">${Number(p.price).toFixed(2)}</span>
                </div>
              );
            })}
          </div>
          <div className="flex justify-end px-5 py-4">
            <button className="rounded-full border border-accent/60 px-4 py-1.5 text-xs font-medium text-accent hover:bg-accent/10">
              Details
            </button>
          </div>
        </div>

        <AddNewProductPanel categories={categories} products={newProductPicks} />
      </div>
    </div>
  );
}
