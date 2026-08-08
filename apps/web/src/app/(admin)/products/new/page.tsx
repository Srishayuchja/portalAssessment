'use client';

import { Suspense, useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Image as ImageIcon, Plus, RotateCw, Search, X } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import type { Category, Product, StockStatus } from '@/lib/types';

const COLOR_SWATCHES = ['#a7f3d0', '#fca5a5', '#93c5fd', '#fde68a', '#111827'];

const CURRENCY_SYMBOLS: Record<string, string> = { USD: '$', EUR: '€', GBP: '£', INR: '₹', LKR: 'Rs' };

function CurrencyFlag({ currency }: { currency: string }) {
  const common = { width: 16, height: 12, className: 'shrink-0 rounded-[1px]', 'aria-hidden': true } as const;

  if (currency === 'EUR') {
    return (
      <svg {...common} viewBox="0 0 16 12">
        <rect width="16" height="12" fill="#003399" />
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * 2 * Math.PI - Math.PI / 2;
          const cx = 8 + 3.2 * Math.cos(angle);
          const cy = 6 + 3.2 * Math.sin(angle);
          return <circle key={i} cx={cx} cy={cy} r="0.6" fill="#FFCC00" />;
        })}
      </svg>
    );
  }

  if (currency === 'GBP') {
    return (
      <svg {...common} viewBox="0 0 16 12">
        <rect width="16" height="12" fill="#00247D" />
        <path d="M0 0L16 12M16 0L0 12" stroke="white" strokeWidth="2.4" />
        <path d="M0 0L16 12M16 0L0 12" stroke="#CF142B" strokeWidth="0.9" />
        <path d="M8 0V12M0 6H16" stroke="white" strokeWidth="3.6" />
        <path d="M8 0V12M0 6H16" stroke="#CF142B" strokeWidth="1.6" />
      </svg>
    );
  }

  if (currency === 'INR') {
    return (
      <svg {...common} viewBox="0 0 16 12">
        <rect width="16" height="4" fill="#FF9933" />
        <rect y="4" width="16" height="4" fill="white" />
        <rect y="8" width="16" height="4" fill="#138808" />
        <circle cx="8" cy="6" r="1.3" fill="none" stroke="#000080" strokeWidth="0.3" />
      </svg>
    );
  }

  if (currency === 'LKR') {
    return (
      <svg {...common} viewBox="0 0 16 12">
        <rect x="3.2" width="12.8" height="12" fill="#8D153A" />
        <rect width="1.6" height="12" fill="#FF9933" />
        <rect x="1.6" width="1.6" height="12" fill="#00534E" />
        <rect x="3" width="0.4" height="12" fill="#FFB700" />
      </svg>
    );
  }

  return (
    <svg {...common} viewBox="0 0 16 12">
      <rect width="16" height="12" fill="#B22234" />
      <rect y="0.92" width="16" height="0.92" fill="white" />
      <rect y="2.77" width="16" height="0.92" fill="white" />
      <rect y="4.62" width="16" height="0.92" fill="white" />
      <rect y="6.46" width="16" height="0.92" fill="white" />
      <rect y="8.31" width="16" height="0.92" fill="white" />
      <rect y="10.15" width="16" height="0.92" fill="white" />
      <rect width="7" height="6.46" fill="#3C3B6E" />
    </svg>
  );
}

export default function AddProductPage() {
  return (
    <Suspense fallback={null}>
      <AddProductForm />
    </Suspense>
  );
}

function AddProductForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fromProductId = searchParams.get('from');
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [discountPrice, setDiscountPrice] = useState('');
  const [taxIncluded, setTaxIncluded] = useState(true);
  const [expirationStart, setExpirationStart] = useState('');
  const [expirationEnd, setExpirationEnd] = useState('');
  const [stockQuantity, setStockQuantity] = useState('0');
  const [unlimitedStock, setUnlimitedStock] = useState(false);
  const [stockStatus, setStockStatus] = useState<StockStatus>('IN_STOCK');
  const [featured, setFeatured] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const expirationStartRef = useRef<HTMLInputElement>(null);
  const expirationEndRef = useRef<HTMLInputElement>(null);
  const [colors, setColors] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [productSearch, setProductSearch] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  function applyProductToForm(product: Product) {
    setName(product.name);
    setDescription(product.description ?? '');
    setPrice(product.price);
    setDiscountPrice(product.discountPrice ?? '');
    setTaxIncluded(product.taxIncluded);
    setExpirationStart(product.expirationStart?.slice(0, 10) ?? '');
    setExpirationEnd(product.expirationEnd?.slice(0, 10) ?? '');
    setStockQuantity(String(product.stockQuantity));
    setUnlimitedStock(product.unlimitedStock);
    setStockStatus(product.stockStatus);
    setFeatured(product.featured);
    setCategoryId(product.categoryId ?? '');
    setTags(product.tags);
    setImages(product.images);
    setColors(product.colors);
  }

  useEffect(() => {
    if (!fromProductId) return;
    api.getProduct(fromProductId).then(applyProductToForm).catch(() => {});
  }, [fromProductId]);

  // "Search product for add": find an existing product to use as a duplicate/template
  // starting point, same prefill behavior as the dashboard's per-product "Add" button.
  useEffect(() => {
    if (!productSearch.trim()) {
      setSearchResults([]);
      return;
    }
    const timeout = setTimeout(() => {
      api
        .getProducts({ search: productSearch, limit: 5 })
        .then((res) => setSearchResults(res.data))
        .catch(() => setSearchResults([]));
    }, 250);
    return () => clearTimeout(timeout);
  }, [productSearch]);

  function selectSearchResult(product: Product) {
    applyProductToForm(product);
    setProductSearch('');
    setSearchResults([]);
    setShowResults(false);
  }

  function resetForm() {
    setName('');
    setDescription('');
    setPrice('');
    setDiscountPrice('');
    setTaxIncluded(true);
    setExpirationStart('');
    setExpirationEnd('');
    setStockQuantity('0');
    setUnlimitedStock(false);
    setStockStatus('IN_STOCK');
    setFeatured(false);
    setCategoryId('');
    setTags([]);
    setImages([]);
    setColors([]);
    setError(null);
    if (fromProductId) router.replace('/products/new');
  }

  function addTag() {
    const value = tagInput.trim();
    if (value && !tags.includes(value)) setTags([...tags, value]);
    setTagInput('');
  }

  function setMainImage() {
    const url = window.prompt('Image URL')?.trim();
    if (url) setImages((prev) => [url, ...prev.slice(1)]);
  }

  function addThumbnail() {
    const url = window.prompt('Image URL')?.trim();
    if (!url) return;
    setImages((prev) => (prev.length === 0 ? [url] : [...prev, url]));
  }

  function toggleColor(color: string) {
    setColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]));
  }

  async function handleSave(status: 'DRAFT' | 'PUBLISHED', e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!name.trim() || !price) {
      setError('Product name and price are required.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createProduct({
        name: name.trim(),
        description: description.trim() || undefined,
        price: Number(price),
        discountPrice: discountPrice ? Number(discountPrice) : undefined,
        taxIncluded,
        expirationStart: expirationStart || undefined,
        expirationEnd: expirationEnd || undefined,
        stockQuantity: unlimitedStock ? undefined : Number(stockQuantity),
        unlimitedStock,
        stockStatus,
        featured,
        images: images.length ? images : undefined,
        tags,
        colors,
        status,
        categoryId: categoryId || undefined,
      });
      router.push('/products');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass =
    'mt-[6px] w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary';
  const labelClass =
    'mb-1 block font-bold text-[#023337] [font-size:15px] [letter-spacing:0%] [line-height:100%]';
  const headingClass = 'font-bold text-[#23272e] [font-size:22px] [letter-spacing:0%] [line-height:26px]';

  return (
    <form className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900 [font-size:22px] [letter-spacing:0.11px] [line-height:100%]">Add New Product</h2>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search size={16} className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
            <input
              value={productSearch}
              onChange={(e) => setProductSearch(e.target.value)}
              onFocus={() => setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 150)}
              placeholder="Search product for add"
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-9 pl-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            {showResults && searchResults.length > 0 && (
              <ul className="absolute top-full right-0 z-10 mt-1 w-72 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
                {searchResults.map((product) => (
                  <li key={product.id}>
                    <button
                      type="button"
                      onMouseDown={() => selectSearchResult(product)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={product.images[0]} alt="" className="h-8 w-8 rounded-md object-cover" />
                      <span className="truncate">{product.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <button
            onClick={(e) => handleSave('PUBLISHED', e)}
            disabled={isSubmitting}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
          >
            Publish Product
          </button>
          <button
            onClick={(e) => handleSave('DRAFT', e)}
            disabled={isSubmitting}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/images/icons/save.svg" alt="" className="h-4 w-4" />
            Save to draft
          </button>
          <button
            type="button"
            onClick={resetForm}
            aria-label="Start a new product"
            title="Start a new product"
            className="rounded-lg border border-gray-300 bg-white p-2.5 hover:bg-gray-50"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/images/icons/addProduct.svg" alt="" className="h-4 w-4" />
          </button>
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[611fr_485fr]">
        <div className="space-y-8 rounded-lg bg-white p-5 [box-shadow:0px_1px_3px_0px_#00000033]">
          <div className="space-y-[25px]">
            <h3 className={headingClass}>Basic Details</h3>
            <div>
              <label className={labelClass}>Product Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="iPhone 15" />
            </div>
            <div>
              <label className={labelClass}>Product Description</label>
              <div className="relative">
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className={inputClass}
                  placeholder="Describe the product..."
                />
                <div className="pointer-events-none absolute right-3 bottom-3 flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/images/icons/desedit.svg" alt="" className="h-4 w-4" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/assets/images/icons/desbeauty.svg" alt="" className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-[25px] !mt-[37px]">
            <h3 className={headingClass}>Pricing</h3>
            <div>
              <label className={labelClass}>Product Price</label>
              <div className="mt-[6px] flex items-center rounded-lg border border-gray-200 bg-gray-50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                <span className="pl-3 text-sm text-gray-500 select-none">{CURRENCY_SYMBOLS[currency]}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full min-w-0 flex-1 bg-transparent py-2 pr-2 pl-1 text-sm outline-none"
                  placeholder="999.89"
                />
                <div className="relative flex items-center gap-1.5 border-l border-gray-200 py-2 pr-3 pl-2">
                  <CurrencyFlag currency={currency} />
                  <svg width="8" height="6" viewBox="0 0 8 6" fill="currentColor" className="text-gray-400" aria-hidden="true">
                    <path d="M0 0L4 6L8 0H0Z" />
                  </svg>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    aria-label="Currency"
                    className="absolute inset-0 cursor-pointer opacity-0"
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                    <option value="LKR">LKR</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Discounted Price (Optional)</label>
                <div className="mt-[6px] flex items-center rounded-lg border border-gray-200 bg-gray-50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                  <span className="pl-3 text-sm text-gray-500 select-none">{CURRENCY_SYMBOLS[currency]}</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={discountPrice}
                    onChange={(e) => setDiscountPrice(e.target.value)}
                    className="w-full min-w-0 flex-1 bg-transparent py-2 pr-3 pl-1 text-sm outline-none"
                  />
                </div>
                {Boolean(price) && Boolean(discountPrice) && Number(discountPrice) < Number(price) && (
                  <p className="mt-1 text-xs text-primary">
                    Save ${(Number(price) - Number(discountPrice)).toFixed(2)} (
                    {Math.round((1 - Number(discountPrice) / Number(price)) * 100)}% off)
                  </p>
                )}
              </div>
              <div>
                <label className={labelClass}>Tax Included</label>
                <div className="flex h-[38px] flex-nowrap items-center gap-4 text-sm whitespace-nowrap text-gray-600">
                  <label className="flex shrink-0 items-center gap-2">
                    <input type="radio" checked={taxIncluded} onChange={() => setTaxIncluded(true)} />
                    Yes
                  </label>
                  <label className="flex shrink-0 items-center gap-2">
                    <input type="radio" checked={!taxIncluded} onChange={() => setTaxIncluded(false)} />
                    No
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className={labelClass}>Expiration</label>
              <div className="mt-[6px] grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    ref={expirationStartRef}
                    type="date"
                    aria-label="Start"
                    value={expirationStart}
                    onChange={(e) => setExpirationStart(e.target.value)}
                    className={`${inputClass} !mt-0 pr-9 [&::-webkit-calendar-picker-indicator]:hidden ${expirationStart ? '' : 'text-transparent'}`}
                  />
                  {!expirationStart && (
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center font-normal text-gray-400 [font-size:15px] [letter-spacing:0%] [line-height:100%]">
                      Start
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => expirationStartRef.current?.showPicker?.()}
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/images/icons/calender.svg" alt="Open calendar" className="h-4 w-4" />
                  </button>
                </div>
                <div className="relative">
                  <input
                    ref={expirationEndRef}
                    type="date"
                    aria-label="End"
                    value={expirationEnd}
                    onChange={(e) => setExpirationEnd(e.target.value)}
                    className={`${inputClass} !mt-0 pr-9 [&::-webkit-calendar-picker-indicator]:hidden ${expirationEnd ? '' : 'text-transparent'}`}
                  />
                  {!expirationEnd && (
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center font-normal text-gray-400 [font-size:15px] [letter-spacing:0%] [line-height:100%]">
                      End
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => expirationEndRef.current?.showPicker?.()}
                    className="absolute inset-y-0 right-3 flex items-center"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/assets/images/icons/calender.svg" alt="Open calendar" className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-[25px] !mt-[37px]">
            <h3 className={headingClass}>Inventory</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Stock Quantity</label>
                <input
                  type={unlimitedStock ? 'text' : 'number'}
                  min="0"
                  disabled={unlimitedStock}
                  value={unlimitedStock ? 'Unlimited' : stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className={`${inputClass} disabled:bg-gray-100`}
                />
              </div>
              <div>
                <label className={labelClass}>Stock Status</label>
                <select
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value as StockStatus)}
                  className={inputClass}
                >
                  <option value="IN_STOCK">In Stock</option>
                  <option value="LOW_STOCK">Low Stock</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-4 text-sm text-gray-600">
              <button
                type="button"
                role="switch"
                aria-checked={unlimitedStock}
                onClick={() => setUnlimitedStock((v) => !v)}
                className={`flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                  unlimitedStock ? 'bg-primary justify-end' : 'bg-gray-300 justify-start'
                }`}
              >
                <span className="h-4 w-4 rounded-full bg-white" />
              </button>
              Unlimited
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <span className="relative inline-flex h-4 w-4 shrink-0">
                <input
                  type="checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="absolute inset-0 h-4 w-4 cursor-pointer opacity-0"
                />
                <span
                  className={`pointer-events-none flex h-4 w-4 items-center justify-center rounded ${
                    featured ? 'bg-primary' : 'border border-gray-300 bg-white'
                  }`}
                >
                  {featured && <Check size={12} strokeWidth={3} className="text-white" />}
                </span>
              </span>
              Highlight this product in a featured section.
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={(e) => handleSave('DRAFT', e)}
                disabled={isSubmitting}
                className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/images/icons/save.svg" alt="" className="h-4 w-4" />
                Save to draft
              </button>
              <button
                onClick={(e) => handleSave('PUBLISHED', e)}
                disabled={isSubmitting}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-60"
              >
                Publish Product
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-8 rounded-lg bg-white p-5 [box-shadow:0px_1px_3px_0px_#00000033]">
          <div className="space-y-3">
            <h3 className={headingClass}>Upload Product Image</h3>
            <p className={`${labelClass} !mt-[25px]`}>Product Image</p>

            <div className="relative !mt-[10px] flex aspect-[160/81] items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              {images[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={images[0]} alt="" className="h-full w-full object-contain" />
              ) : (
                <span className="text-xs text-gray-400">No image yet</span>
              )}
              {images[0] && (
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.slice(1))}
                  aria-label="Remove image"
                  className="absolute top-3 right-3 rounded-full bg-white/90 p-1 text-gray-500 shadow-sm hover:bg-white hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              )}
              <button
                type="button"
                onClick={setMainImage}
                className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <ImageIcon size={14} />
                Browse
              </button>
              <button
                type="button"
                onClick={setMainImage}
                className="absolute right-3 bottom-3 flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <RotateCw size={14} />
                Replace
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {images.slice(1).map((url, i) => (
                <div
                  className="group relative flex aspect-square items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-gray-50"
                  key={i}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt="" className="h-full w-full object-contain object-center" />
                  <button
                    type="button"
                    onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i + 1))}
                    className="absolute top-1 right-1 rounded-full bg-white/90 p-1 opacity-0 group-hover:opacity-100"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addThumbnail}
                className="flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-primary/40 text-xs font-medium text-primary hover:bg-primary/5"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white">
                  <Plus size={14} />
                </span>
                Add Image
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Real file upload is out of scope for this build — paste an image URL instead (documented in README).
            </p>
          </div>

          <div className="space-y-[25px]">
            <h3 className={headingClass}>Categories</h3>
            <div>
              <label className={labelClass}>Product Categories</label>
              <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className={inputClass}>
                <option value="">Select your category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>Product Tag</label>
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Type a tag and press Enter"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                    >
                      {tag}
                      <button type="button" onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Select your color</label>
              <div className="flex gap-2">
                {COLOR_SWATCHES.map((color) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => toggleColor(color)}
                    style={{ backgroundColor: color }}
                    className={`h-8 w-8 rounded-full border-2 ${
                      colors.includes(color) ? 'border-primary' : 'border-transparent'
                    }`}
                    aria-label={color}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
