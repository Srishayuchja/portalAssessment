'use client';

import { Suspense, useEffect, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X } from 'lucide-react';
import { api, ApiError } from '@/lib/api';
import type { Category, StockStatus } from '@/lib/types';

const COLOR_SWATCHES = ['#a7f3d0', '#fca5a5', '#93c5fd', '#fde68a', '#111827'];

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
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    if (!fromProductId) return;
    api
      .getProduct(fromProductId)
      .then((product) => {
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
      })
      .catch(() => {});
  }, [fromProductId]);

  function addTag() {
    const value = tagInput.trim();
    if (value && !tags.includes(value)) setTags([...tags, value]);
    setTagInput('');
  }

  function addImage() {
    const value = imageUrlInput.trim();
    if (value && !images.includes(value)) setImages([...images, value]);
    setImageUrlInput('');
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
    'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary';
  const labelClass = 'mb-1 block text-sm font-medium text-gray-700';

  return (
    <form className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold text-gray-900">Add New Product</h2>
        <div className="flex gap-3">
          <button
            onClick={(e) => handleSave('DRAFT', e)}
            disabled={isSubmitting}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
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

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900">Basic Details</h3>
            <div>
              <label className={labelClass}>Product Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} placeholder="iPhone 15" />
            </div>
            <div>
              <label className={labelClass}>Product Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className={inputClass}
                placeholder="Describe the product..."
              />
            </div>
          </section>

          <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900">Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Product Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className={inputClass}
                  placeholder="999.89"
                />
              </div>
              <div>
                <label className={labelClass}>Discounted Price (Optional)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Tax Included</label>
              <div className="flex gap-4 text-sm text-gray-600">
                <label className="flex items-center gap-2">
                  <input type="radio" checked={taxIncluded} onChange={() => setTaxIncluded(true)} />
                  Yes
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" checked={!taxIncluded} onChange={() => setTaxIncluded(false)} />
                  No
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Expiration Start</label>
                <input
                  type="date"
                  value={expirationStart}
                  onChange={(e) => setExpirationStart(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Expiration End</label>
                <input
                  type="date"
                  value={expirationEnd}
                  onChange={(e) => setExpirationEnd(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900">Inventory</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Stock Quantity</label>
                <input
                  type="number"
                  min="0"
                  disabled={unlimitedStock}
                  value={stockQuantity}
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

            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={unlimitedStock} onChange={(e) => setUnlimitedStock(e.target.checked)} />
              Unlimited
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />
              Highlight this product in a featured section.
            </label>
          </section>
        </div>

        <div className="space-y-6">
          <section className="space-y-3 rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900">Upload Image</h3>
            <div className="flex gap-2">
              <input
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://... image URL"
                className={inputClass}
              />
              <button
                type="button"
                onClick={addImage}
                className="shrink-0 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Add
              </button>
            </div>
            <p className="text-xs text-gray-400">
              Real file upload is out of scope for this build — paste an image URL instead (documented in README).
            </p>
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {images.map((url) => (
                  <div key={url} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((i) => i !== url))}
                      className="absolute top-1 right-1 rounded-full bg-white/90 p-1 opacity-0 group-hover:opacity-100"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="space-y-4 rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-semibold text-gray-900">Categories</h3>
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
          </section>
        </div>
      </div>
    </form>
  );
}
