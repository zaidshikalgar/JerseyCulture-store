'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { CircleCheck, Clock3, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { apiRequest } from '@/lib/api';
import { Button } from '@/components/ui/button';

const statusLabel = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  shipped: 'In Transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

function renderStatus(orderStatus) {
  if (orderStatus === 'confirmed') {
    return (
      <span className="inline-flex items-center gap-1.5 text-emerald-400">
        <CircleCheck className="h-3.5 w-3.5" />
        Confirmed
      </span>
    );
  }

  if (orderStatus === 'pending') {
    return (
      <span className="inline-flex items-center gap-1.5 text-amber-300">
        <Clock3 className="h-3.5 w-3.5" />
        Pending
      </span>
    );
  }

  return statusLabel[orderStatus] || orderStatus;
}

export function OrdersManager() {
  const { user, token, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionOrderNumber, setActionOrderNumber] = useState(null);
  const [deleteOrderNumber, setDeleteOrderNumber] = useState(null);
  const [error, setError] = useState(null);

  const isAdmin = useMemo(() => user?.role === 'admin', [user?.role]);

  useEffect(() => {
    if (!isAuthenticated || !token || !isAdmin) {
      setIsLoading(false);
      return;
    }

    let mounted = true;
    async function loadOrders() {
      try {
        setError(null);
        const data = await apiRequest('/orders', {}, token);
        if (mounted) {
          setOrders(data);
        }
      } catch (requestError) {
        if (mounted) {
          setError(
            requestError instanceof Error
              ? requestError.message
              : 'Failed to load orders.'
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadOrders();
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
          Sign in with an admin account to view orders.
        </p>
        <Button asChild className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/auth/login">Go to Sign In</Link>
        </Button>
      </div>
    );
  }

  async function handleConfirmOrder(orderNumber) {
    if (!token) return;
    try {
      setActionOrderNumber(orderNumber);
      setError(null);
      const updated = await apiRequest(
        `/orders/confirm/${encodeURIComponent(orderNumber)}`,
        { method: 'POST' },
        token
      );
      setOrders((prev) =>
        prev.map((order) =>
          order.orderNumber === orderNumber ? updated : order
        )
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Failed to confirm order.'
      );
    } finally {
      setActionOrderNumber(null);
    }
  }

  async function handleDeleteOrder(orderNumber) {
    if (!token) return;

    const confirmed = window.confirm(
      `Delete order ${orderNumber}? This action cannot be undone.`
    );
    if (!confirmed) {
      return;
    }

    try {
      setDeleteOrderNumber(orderNumber);
      setError(null);
      await apiRequest(
        `/orders/${encodeURIComponent(orderNumber)}`,
        { method: 'DELETE' },
        token
      );
      setOrders((prev) =>
        prev.filter((order) => order.orderNumber !== orderNumber)
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Failed to delete order.'
      );
    } finally {
      setDeleteOrderNumber(null);
    }
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
        Orders
      </h1>
      <p className="mt-2 text-sm text-foreground/50">
        All customer orders from your store.
      </p>

      {isLoading && (
        <div className="mt-6 flex items-center gap-2 text-sm text-foreground/60">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading orders...
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
                <th className="pb-3 pr-3">Order</th>
                <th className="pb-3 pr-3">Customer</th>
                <th className="pb-3 pr-3">Status</th>
                <th className="pb-3 pr-3">Payment</th>
                <th className="pb-3 pr-3">Total</th>
                <th className="pb-3">Date</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t border-border/30">
                  <td className="py-3 pr-3">{order.orderNumber}</td>
                  <td className="py-3 pr-3">
                    <div>{order.customer?.name}</div>
                    <div className="text-xs text-foreground/50">{order.customer?.email}</div>
                  </td>
                  <td className="py-3 pr-3">{renderStatus(order.status)}</td>
                  <td className="py-3 pr-3 uppercase">{order.paymentMethod}</td>
                  <td className="py-3 pr-3">Rs.{Number(order.totalAmount || 0).toLocaleString('en-IN')}</td>
                  <td className="py-3">{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="py-3">
                    <div className="grid w-[180px] grid-cols-2 gap-2">
                      {order.status === 'pending' && (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => handleConfirmOrder(order.orderNumber)}
                          disabled={actionOrderNumber === order.orderNumber}
                        >
                          {actionOrderNumber === order.orderNumber
                            ? 'Confirming...'
                            : 'Confirm'}
                        </Button>
                      )}
                      {order.status !== 'pending' && <span />}
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteOrder(order.orderNumber)}
                        disabled={deleteOrderNumber === order.orderNumber}
                      >
                        {deleteOrderNumber === order.orderNumber
                          ? 'Deleting...'
                          : 'Delete'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td className="py-4 text-foreground/50" colSpan={7}>
                    No orders found.
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
