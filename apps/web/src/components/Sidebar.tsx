'use client';

import { useState, type ComponentType } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Lato } from 'next/font/google';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Ticket,
  FolderTree,
  Receipt,
  Star,
  PlusCircle,
  Image as ImageIcon,
  List,
  MessageSquare,
  ShieldCheck,
  Settings,
  LogOut,
  Store,
  ExternalLink,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/lib/auth-context';

const lato = Lato({ subsets: ['latin'], weight: ['400', '700'] });

// Only Dashboard / Add Products / Product List are implemented routes (per assessment scope).
// The rest of the nav still navigates — each to its own "/coming-soon/<slug>" page — so every
// item gets its own distinct URL (and therefore its own individual active state) instead of
// all sharing one route and lighting up together.
function comingSoon(label: string): string {
  return `/coming-soon/${slugify(label)}`;
}

function slugify(label: string): string {
  return label.toLowerCase().replace(/\s+/g, '-');
}

// Custom icons exported from the Figma design go in public/assets/images/icons/<slug>.svg
// (and optionally <slug>-active.svg for the selected/white variant). Until a file exists at
// that path, NavIcon below falls back to the closest lucide-react icon automatically.
const ICONS_DIR = '/assets/images/icons';

function iconPath(label: string, active = false): string {
  return `${ICONS_DIR}/${slugify(label)}${active ? '-active' : ''}.svg`;
}

const NAV_ITEMS = [
  {
    section: 'Main menu',
    items: [
      { label: 'Dashboard', href: '/dashboard', fallback: LayoutDashboard },
      { label: 'Order Management', href: comingSoon('Order Management'), fallback: ShoppingCart },
      { label: 'Customers', href: comingSoon('Customers'), fallback: Users },
      { label: 'Coupon Code', href: comingSoon('Coupon Code'), fallback: Ticket },
      { label: 'Categories', href: comingSoon('Categories'), fallback: FolderTree },
      { label: 'Transaction', href: comingSoon('Transaction'), fallback: Receipt },
      { label: 'Brand', href: comingSoon('Brand'), fallback: Star },
    ],
  },
  {
    section: 'Product',
    items: [
      { label: 'Add Products', href: '/products/new', fallback: PlusCircle },
      { label: 'Product Media', href: comingSoon('Product Media'), fallback: ImageIcon },
      { label: 'Product List', href: '/products', fallback: List },
      { label: 'Product Reviews', href: comingSoon('Product Reviews'), fallback: MessageSquare },
    ],
  },
  {
    section: 'Admin',
    items: [
      { label: 'Admin role', href: comingSoon('Admin Role'), fallback: ShieldCheck },
      { label: 'Control Authority', href: comingSoon('Control Authority'), fallback: Settings },
    ],
  },
];

function NavIcon({
  label,
  isActive,
  size,
  fallback: Fallback,
}: {
  label: string;
  isActive: boolean;
  size: number;
  fallback: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <Fallback size={size} strokeWidth={1.75} className="align-middle" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={iconPath(label, isActive)}
      alt=""
      width={size}
      height={size}
      className="align-middle"
      onError={(e) => {
        // Selected-state icon missing: fall back to the unselected export instead of the lucide icon.
        if (isActive && e.currentTarget.src.endsWith('-active.svg')) {
          e.currentTarget.src = iconPath(label, false);
          return;
        }
        setFailed(true);
      }}
    />
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className={clsx('flex h-full w-[260px] shrink-0 flex-col border-r border-gray-200 bg-white', lato.className)}>
      <div className="flex h-16 items-center gap-1 px-6 text-xl font-bold">
        <span className="text-gray-900">DEALP</span>
        <span className="text-primary">✱</span>
        <span className="text-gray-900">RT</span>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 py-2">
        {NAV_ITEMS.map((group) => (
          <div key={group.section}>
            <p className="mb-2 px-2 text-xs font-medium tracking-wide text-gray-400 uppercase">
              {group.section}
            </p>
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className={clsx(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-[16px] leading-[22px] tracking-normal transition-colors',
                        isActive
                          ? 'bg-primary font-bold text-white'
                          : 'font-normal text-gray-600 hover:bg-gray-100',
                      )}
                    >
                      <NavIcon
                        label={item.label}
                        isActive={isActive}
                        size={isActive ? 24 : 22}
                        fallback={item.fallback}
                      />
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <div className="mb-3 flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
            {user?.name?.charAt(0) ?? 'D'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">{user?.name ?? 'Dealport'}</p>
            <p className="truncate text-xs text-gray-500">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            aria-label="Log out"
            className="shrink-0 rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900"
          >
            <LogOut size={16} />
          </button>
        </div>
        <div className="flex items-center justify-between rounded-lg px-2 py-2 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Store size={16} />
            <span>Your Shop</span>
          </div>
          <ExternalLink size={14} />
        </div>
      </div>
    </aside>
  );
}
