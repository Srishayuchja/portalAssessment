'use client';

import { usePathname } from 'next/navigation';
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
    <header className="flex h-[91.2px] shrink-0 items-center justify-between border-b border-gray-200 bg-white pr-10 pl-6">
      <h1 className="text-[16.245px] font-bold text-secondary">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/images/icons/search.svg"
            alt=""
            className="pointer-events-none absolute top-1/2 right-[12px] h-[36px] w-[36px] -translate-y-1/2"
          />
          <input
            type="text"
            placeholder="Search data, users, or reports"
            className="h-[40px] w-[407px] rounded-full bg-gray-50 pr-9 pl-[17px] font-normal outline-none placeholder:text-[#000000]/60 focus:ring-1 focus:ring-primary [font-size:15px] [letter-spacing:0.08px] [line-height:100%]"
          />
        </div>

        <button className="rounded-full p-2 hover:bg-gray-100" aria-label="Notifications">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/images/icons/notification.svg" alt="" className="h-5 w-5" />
        </button>

        <button aria-label="Toggle theme">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/images/icons/theme.svg" alt="" className="h-8 w-14" />
        </button>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/images/icons/profile.svg"
          alt={user?.name ?? 'Profile'}
          className="h-9 w-9 rounded-full object-cover"
        />
      </div>
    </header>
  );
}
