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
      {
        label: 'Dashboard',
        href: '/dashboard',
        fallback: LayoutDashboard,
        icon: '/assets/images/icons/home.svg',
        activeIcon: '/assets/images/icons/shome.svg',
      },
      {
        label: 'Order Management',
        href: comingSoon('Order Management'),
        fallback: ShoppingCart,
        icon: '/assets/images/icons/cart.svg',
        activeIcon: '/assets/images/icons/scard.svg',
      },
      {
        label: 'Customers',
        href: comingSoon('Customers'),
        fallback: Users,
        icon: '/assets/images/icons/users.svg',
        activeIcon: '/assets/images/icons/susers.svg',
      },
      {
        label: 'Coupon Code',
        href: comingSoon('Coupon Code'),
        fallback: Ticket,
        icon: '/assets/images/icons/ticket.svg',
        activeIcon: '/assets/images/icons/sticket.svg',
      },
      {
        label: 'Categories',
        href: comingSoon('Categories'),
        fallback: FolderTree,
        icon: '/assets/images/icons/category.svg',
        activeIcon: '/assets/images/icons/scategory.svg',
      },
      {
        label: 'Transaction',
        href: comingSoon('Transaction'),
        fallback: Receipt,
        icon: '/assets/images/icons/transaction.svg',
        activeIcon: '/assets/images/icons/stransaction.svg',
      },
      {
        label: 'Brand',
        href: comingSoon('Brand'),
        fallback: Star,
        icon: '/assets/images/icons/brand.svg',
        activeIcon: '/assets/images/icons/sbrand.svg',
      },
    ],
  },
  {
    section: 'Product',
    items: [
      {
        label: 'Add Products',
        href: '/products/new',
        fallback: PlusCircle,
        icon: '/assets/images/icons/addProduct.svg',
        activeIcon: '/assets/images/icons/saddProduct.svg',
      },
      {
        label: 'Product Media',
        href: comingSoon('Product Media'),
        fallback: ImageIcon,
        icon: '/assets/images/icons/productMedia.svg',
        activeIcon: '/assets/images/icons/sproductMedia.svg',
      },
      {
        label: 'Product List',
        href: '/products',
        fallback: List,
        icon: '/assets/images/icons/productList.svg',
        activeIcon: '/assets/images/icons/sProductList.svg',
      },
      {
        label: 'Product Reviews',
        href: comingSoon('Product Reviews'),
        fallback: MessageSquare,
        icon: '/assets/images/icons/productReview.svg',
        activeIcon: '/assets/images/icons/sProductReview.svg',
      },
    ],
  },
  {
    section: 'Admin',
    items: [
      {
        label: 'Admin role',
        href: comingSoon('Admin Role'),
        fallback: ShieldCheck,
        icon: '/assets/images/icons/adminRole.svg',
        activeIcon: '/assets/images/icons/sAdminrole.svg',
      },
      {
        label: 'Control Authority',
        href: comingSoon('Control Authority'),
        fallback: Settings,
        icon: '/assets/images/icons/controlAuthority.svg',
        activeIcon: '/assets/images/icons/scontrolAuthority.svg',
      },
    ],
  },
];

function NavIcon({
  label,
  isActive,
  size,
  fallback: Fallback,
  icon,
  activeIcon,
}: {
  label: string;
  isActive: boolean;
  size: number;
  fallback: ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;
  icon?: string;
  activeIcon?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <Fallback size={size} strokeWidth={1.75} className="align-middle" />;
  }

  const src = isActive ? (activeIcon ?? iconPath(label, true)) : (icon ?? iconPath(label, false));
  const isSolidActiveOverride = isActive && Boolean(activeIcon);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={size}
      height={size}
      className={clsx('align-middle', isSolidActiveOverride && '[filter:brightness(0)_invert(1)]')}
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
  const [collapsed, setCollapsed] = useState(false);
  const yourShopHref = comingSoon('Your Shop');
  const isYourShopActive = pathname === yourShopHref;

  return (
    <aside
      className={clsx(
        'flex h-full shrink-0 flex-col border-r border-gray-200 bg-white transition-[width]',
        collapsed ? 'w-[80px]' : 'w-[280px]',
        lato.className,
      )}
    >
      <div className={clsx('flex h-16 items-center px-6', collapsed ? 'justify-center' : 'justify-between')}>
        {!collapsed && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/assets/images/icons/dealPortLogo.svg" alt="DEALPORT" className="h-[18px] w-auto" />
        )}
        <button onClick={() => setCollapsed((c) => !c)} aria-label="Toggle sidebar">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/images/icons/drawer.svg" alt="" className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-4 pt-[4px] pb-2">
        {NAV_ITEMS.map((group) => (
          <div key={group.section}>
            {!collapsed && (
              <p className="mb-2 px-2 text-xs font-medium tracking-wide text-gray-400">{group.section}</p>
            )}
            <ul className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname === item.href;

                return (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={clsx(
                        'flex items-center gap-3 rounded-lg py-[7px] align-middle text-[16px] leading-[22px] tracking-[0px] transition-colors',
                        collapsed ? 'justify-center px-2' : 'px-3',
                        isActive
                          ? 'bg-primary font-bold text-white'
                          : 'font-normal text-[#6a717f] hover:bg-gray-100',
                      )}
                    >
                      <NavIcon
                        label={item.label}
                        isActive={isActive}
                        size={isActive ? 24 : 22}
                        fallback={item.fallback}
                        icon={'icon' in item ? item.icon : undefined}
                        activeIcon={'activeIcon' in item ? item.activeIcon : undefined}
                      />
                      {!collapsed && item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-200 p-4">
        <div className={clsx('mb-3 flex items-center gap-3 px-2', collapsed && 'justify-center')}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/assets/images/icons/profile.svg"
            alt={user?.name ?? 'Profile'}
            className="h-9 w-9 shrink-0 rounded-full object-cover"
          />
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-gray-900 [font-family:var(--font-inter),sans-serif] [font-size:14px] [letter-spacing:0%] [line-height:16px]">
                  {user?.name ?? 'Dealport'}
                </p>
                <p className="truncate text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                aria-label="Log out"
                className="shrink-0 rounded-lg p-1.5 hover:bg-gray-100"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/images/icons/logout.svg" alt="" className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
        {collapsed ? (
          <button
            onClick={logout}
            aria-label="Log out"
            className="flex w-full items-center justify-center rounded-lg py-2 hover:bg-gray-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/images/icons/logout.svg" alt="" className="h-4 w-4" />
          </button>
        ) : (
          <Link
            href={yourShopHref}
            className={clsx(
              'flex items-center justify-between rounded-lg border px-2 py-2 transition-colors',
              isYourShopActive
                ? 'border-primary bg-primary font-bold text-white'
                : 'border-gray-200 text-[#023337] hover:bg-gray-100',
            )}
          >
            <div className="flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={isYourShopActive ? '/assets/images/icons/sYourShop.svg' : '/assets/images/icons/yourShop.svg'}
                alt=""
                className={clsx('h-4 w-4', isYourShopActive && '[filter:brightness(0)_invert(1)]')}
              />
              <span className="font-medium [font-size:15px] [letter-spacing:0.075px] [line-height:100%]">
                Your Shop
              </span>
            </div>
            <ExternalLink size={14} />
          </Link>
        )}
      </div>
    </aside>
  );
}
