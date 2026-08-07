'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const TITLES: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/products': 'Product List',
  '/products/new': 'Add Product',
};

export function Topbar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const title = TITLES[pathname] ?? 'DEALPORT';

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6">
      <h1 className="text-lg font-semibold text-gray-900">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search data, users, or reports"
            className="w-72 rounded-lg border border-gray-200 bg-gray-50 py-2 pr-3 pl-9 text-sm outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <button className="rounded-full p-2 text-gray-500 hover:bg-gray-100">
          <Bell size={18} />
        </button>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white">
          {user?.name?.charAt(0) ?? 'D'}
        </div>
      </div>
    </header>
  );
}
