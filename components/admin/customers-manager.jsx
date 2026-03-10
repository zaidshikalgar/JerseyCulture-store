'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { apiRequest } from '@/lib/api';
import { Button } from '@/components/ui/button';

function buildCustomers(users, orders) {
  const map = new Map();

  users.forEach((user) => {
    const email = String(user.email || '').toLowerCase();
    if (!email) return;
    map.set(email, {
      name: user.name || 'Unknown',
      email,
      phone: user.phone || '',
      totalOrders: 0,
      totalSpent: 0,
      latestOrderAt: null,
      createdAt: user.createdAt,
    });
  });

  orders.forEach((order) => {
    const email = String(order.customer?.email || '').toLowerCase();
    if (!email) return;

    const existing = map.get(email) || {
      name: order.customer?.name || 'Unknown',
      email,
      phone: order.customer?.phone || '',
      totalOrders: 0,
      totalSpent: 0,
      latestOrderAt: null,
      createdAt: order.createdAt,
    };

    existing.totalOrders += 1;
    existing.totalSpent += Number(order.totalAmount || 0);
    if (!existing.latestOrderAt || new Date(order.createdAt) > new Date(existing.latestOrderAt)) {
      existing.latestOrderAt = order.createdAt;
    }
    map.set(email, existing);
  });

  return Array.from(map.values()).sort((a, b) => {
    const aDate = a.latestOrderAt || a.createdAt || 0;
    const bDate = b.latestOrderAt || b.createdAt || 0;
    return new Date(bDate) - new Date(aDate);
  });
}

export function CustomersManager() {
  const { user, token, isAuthenticated } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isAdmin = useMemo(() => user?.role === 'admin', [user?.role]);

  useEffect(() => {
    if (!isAuthenticated || !token || !isAdmin) {
      setIsLoading(false);
      return;
    }

    let mounted = true;
    async function loadCustomers() {
      try {
        setError(null);
        const [users, orders] = await Promise.all([
          apiRequest('/auth/users', {}, token),
          apiRequest('/orders', {}, token),
        ]);
        if (mounted) {
          setCustomers(buildCustomers(users, orders));
        }
      } catch (requestError) {
        if (mounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Failed to load customers.'
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadCustomers();
    return () => {
      mounted = false;
    };
  }, [isAuthenticated, isAdmin, token]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center lg:px-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
          Admin access only
        </h1>
        <p className="mt-3 text-sm text-foreground/50">
          Sign in with an admin account to view customers.
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
      <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
        Customers
      </h1>
      <p className="mt-2 text-sm text-foreground/50">
        Customers derived from order history.
      </p>

      {isLoading && (
        <div className="mt-6 flex items-center gap-2 text-sm text-foreground/60">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading customers...
        </div>
      )}

      {error && !isLoading && (
        <p className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {!isLoading && !error && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border/40 bg-card p-4">
          <table className="w-full text-left text-sm">
            <thead className="text-foreground/50">
              <tr>
                <th className="pb-3 pr-3">Name</th>
                <th className="pb-3 pr-3">Email</th>
                <th className="pb-3 pr-3">Phone</th>
                <th className="pb-3 pr-3">Orders</th>
                <th className="pb-3 pr-3">Total Spent</th>
                <th className="pb-3">Latest Order</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.email} className="border-t border-border/30">
                  <td className="py-3 pr-3">{customer.name}</td>
                  <td className="py-3 pr-3">{customer.email}</td>
                  <td className="py-3 pr-3">{customer.phone || '-'}</td>
                  <td className="py-3 pr-3">{customer.totalOrders}</td>
                  <td className="py-3 pr-3">Rs.{customer.totalSpent.toLocaleString('en-IN')}</td>
                  <td className="py-3">
                    {customer.latestOrderAt
                      ? new Date(customer.latestOrderAt).toLocaleDateString('en-IN')
                      : '-'}
                  </td>
                </tr>
              ))}
              {customers.length === 0 && (
                <tr>
                  <td className="py-4 text-foreground/50" colSpan={6}>
                    No customers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
