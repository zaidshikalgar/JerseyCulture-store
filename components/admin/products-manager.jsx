'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Loader2, Pencil, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { apiRequest } from '@/lib/api';
import { Button } from '@/components/ui/button';

const inputClass =
  'w-full rounded-md border border-border/50 bg-secondary px-3 py-2 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary';

const initialForm = {
  id: '',
  name: '',
  slug: '',
  price: '',
  originalPrice: '',
  image: '',
  category: 'club',
  league: '',
  team: '',
  badge: '',
  sizes: '',
  description: '',
  features: '',
  isNew: false,
  isFeatured: false,
};

function toPayload(form) {
  const payload = {
    name: form.name.trim(),
    slug: form.slug.trim().toLowerCase(),
    price: Number(form.price),
    image: form.image.trim(),
    category: form.category,
    league: form.league.trim(),
    team: form.team.trim(),
    badge: form.badge.trim(),
    sizes: form.sizes
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    description: form.description.trim(),
    features: form.features
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean),
    isNew: form.isNew,
    isFeatured: form.isFeatured,
  };

  if (form.originalPrice !== '') {
    payload.originalPrice = Number(form.originalPrice);
  }

  return payload;
}

function fromProduct(product) {
  return {
    id: product._id,
    name: product.name || '',
    slug: product.slug || '',
    price: String(product.price ?? ''),
    originalPrice:
      product.originalPrice === undefined || product.originalPrice === null
        ? ''
        : String(product.originalPrice),
    image: product.image || '',
    category: product.category || 'club',
    league: product.league || '',
    team: product.team || '',
    badge: product.badge || '',
    sizes: Array.isArray(product.sizes) ? product.sizes.join(', ') : '',
    description: product.description || '',
    features: Array.isArray(product.features) ? product.features.join(', ') : '',
    isNew: Boolean(product.isNew),
    isFeatured: Boolean(product.isFeatured),
  };
}

export function ProductsManager() {
  const { user, token, isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const isAdmin = useMemo(() => user?.role === 'admin', [user?.role]);
  const isEdit = Boolean(form.id);

  useEffect(() => {
    let mounted = true;

    async function loadProducts() {
      try {
        setError(null);
        const data = await apiRequest('/products');
        if (mounted) {
          setProducts(data);
        }
      } catch (requestError) {
        if (mounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Failed to load products.'
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();
    return () => {
      mounted = false;
    };
  }, []);

  async function refreshProducts() {
    const data = await apiRequest('/products');
    setProducts(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!token) {
      setError('Please login as admin first.');
      return;
    }

    const payload = toPayload(form);
    if (!payload.name || !payload.slug || !payload.team || !payload.description || !payload.image) {
      setError('Please fill all required fields.');
      return;
    }

    setIsSaving(true);
    try {
      if (isEdit) {
        await apiRequest(
          `/products/${encodeURIComponent(form.id)}`,
          {
            method: 'PUT',
            body: JSON.stringify(payload),
          },
          token
        );
        setMessage('Product updated successfully.');
      } else {
        await apiRequest(
          '/products',
          {
            method: 'POST',
            body: JSON.stringify(payload),
          },
          token
        );
        setMessage('Product created successfully.');
      }

      setForm(initialForm);
      await refreshProducts();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Failed to save product.'
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(productId) {
    if (!token) {
      setError('Please login as admin first.');
      return;
    }

    const confirmed = window.confirm('Delete this product?');
    if (!confirmed) {
      return;
    }

    setError(null);
    setMessage(null);
    try {
      await apiRequest(
        `/products/${encodeURIComponent(productId)}`,
        { method: 'DELETE' },
        token
      );
      if (form.id === productId) {
        setForm(initialForm);
      }
      setMessage('Product deleted successfully.');
      await refreshProducts();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Failed to delete product.'
      );
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center lg:px-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
          Admin access only
        </h1>
        <p className="mt-3 text-sm text-foreground/50">
          Sign in with an admin account to manage products.
        </p>
        <Button asChild className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/auth/login">Go to Sign In</Link>
        </Button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center lg:px-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
          You do not have access
        </h1>
        <p className="mt-3 text-sm text-foreground/50">
          This area is restricted to admin users.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
            Admin
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-foreground">
            Product CRUD Panel
          </h1>
        </div>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
          <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
          Admin
        </span>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <section className="rounded-lg border border-border/40 bg-card p-5 lg:col-span-2">
          <h2 className="text-sm font-semibold text-foreground">
            {isEdit ? 'Edit Product' : 'Create Product'}
          </h2>
          <form className="mt-4 flex flex-col gap-3" onSubmit={handleSubmit}>
            <input className={inputClass} placeholder="Name" value={form.name} onChange={(e) => setForm((s) => ({ ...s, name: e.target.value }))} />
            <input className={inputClass} placeholder="Slug" value={form.slug} onChange={(e) => setForm((s) => ({ ...s, slug: e.target.value }))} />
            <div className="grid grid-cols-2 gap-3">
              <input className={inputClass} placeholder="Price" type="number" min="0" value={form.price} onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))} />
              <input className={inputClass} placeholder="Original Price" type="number" min="0" value={form.originalPrice} onChange={(e) => setForm((s) => ({ ...s, originalPrice: e.target.value }))} />
            </div>
            <input className={inputClass} placeholder="Image URL" value={form.image} onChange={(e) => setForm((s) => ({ ...s, image: e.target.value }))} />
            <select className={inputClass} value={form.category} onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}>
              <option value="club">club</option>
              <option value="national">national</option>
              <option value="retro">retro</option>
            </select>
            <input className={inputClass} placeholder="League" value={form.league} onChange={(e) => setForm((s) => ({ ...s, league: e.target.value }))} />
            <input className={inputClass} placeholder="Team" value={form.team} onChange={(e) => setForm((s) => ({ ...s, team: e.target.value }))} />
            <input className={inputClass} placeholder="Badge" value={form.badge} onChange={(e) => setForm((s) => ({ ...s, badge: e.target.value }))} />
            <input className={inputClass} placeholder="Sizes (comma separated)" value={form.sizes} onChange={(e) => setForm((s) => ({ ...s, sizes: e.target.value }))} />
            <input className={inputClass} placeholder="Features (comma separated)" value={form.features} onChange={(e) => setForm((s) => ({ ...s, features: e.target.value }))} />
            <textarea className={inputClass} placeholder="Description" value={form.description} onChange={(e) => setForm((s) => ({ ...s, description: e.target.value }))} rows={4} />
            <label className="flex items-center gap-2 text-xs text-foreground/70">
              <input type="checkbox" checked={form.isNew} onChange={(e) => setForm((s) => ({ ...s, isNew: e.target.checked }))} />
              Is New
            </label>
            <label className="flex items-center gap-2 text-xs text-foreground/70">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((s) => ({ ...s, isFeatured: e.target.checked }))} />
              Is Featured
            </label>
            <div className="mt-2 flex gap-2">
              <Button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                {isEdit ? 'Update' : 'Create'}
              </Button>
              {isEdit && (
                <Button type="button" variant="outline" onClick={() => setForm(initialForm)}>
                  Cancel Edit
                </Button>
              )}
            </div>
          </form>
          {message && <p className="mt-3 text-xs text-primary">{message}</p>}
          {error && <p className="mt-3 text-xs text-destructive">{error}</p>}
        </section>

        <section className="rounded-lg border border-border/40 bg-card p-5 lg:col-span-3">
          <h2 className="text-sm font-semibold text-foreground">Products</h2>
          {isLoading ? (
            <div className="mt-4 flex items-center gap-2 text-sm text-foreground/60">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading products...
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-foreground/50">
                  <tr>
                    <th className="pb-3 pr-3">Name</th>
                    <th className="pb-3 pr-3">Category</th>
                    <th className="pb-3 pr-3">Price</th>
                    <th className="pb-3 pr-3">Team</th>
                    <th className="pb-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-t border-border/30">
                      <td className="py-3 pr-3">{product.name}</td>
                      <td className="py-3 pr-3">{product.category}</td>
                      <td className="py-3 pr-3">Rs.{Number(product.price || 0).toLocaleString('en-IN')}</td>
                      <td className="py-3 pr-3">{product.team}</td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <Button type="button" size="sm" variant="outline" onClick={() => setForm(fromProduct(product))}>
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button type="button" size="sm" variant="destructive" onClick={() => handleDelete(product._id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td className="py-4 text-foreground/50" colSpan={5}>
                        No products found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
