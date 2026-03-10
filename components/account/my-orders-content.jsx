'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2, PackageSearch } from 'lucide-react';
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
const statusClassMap = {
    pending: 'bg-amber-500/15 text-amber-300 border border-amber-500/35',
    confirmed: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/35',
    shipped: 'bg-primary/10 text-primary border border-primary/35',
    delivered: 'bg-green-600/15 text-green-300 border border-green-600/35',
    cancelled: 'bg-secondary text-foreground/70 border border-border/40',
};
const quickSizes = ['S', 'M', 'L', 'XL', 'XXL'];
export function MyOrdersContent() {
    const router = useRouter();
    const { token, user, isAuthenticated } = useAuth();
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoadingOrderId, setActionLoadingOrderId] = useState(null);
    const [saveLoadingOrderId, setSaveLoadingOrderId] = useState(null);
    const [editingOrderId, setEditingOrderId] = useState(null);
    const [draftItems, setDraftItems] = useState([]);
    useEffect(() => {
        if (!isAuthenticated || !token) {
            setIsLoading(false);
            return;
        }
        let mounted = true;
        async function loadOrders() {
            try {
                setError(null);
                const data = await apiRequest('/orders/my-orders', {}, token);
                if (mounted) {
                    setOrders(data.filter((order) => order.status !== 'cancelled'));
                }
            }
            catch (requestError) {
                if (mounted) {
                    setError(requestError instanceof Error
                        ? requestError.message
                        : 'Failed to load your orders.');
                }
            }
            finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        }
        loadOrders();
        return () => {
            mounted = false;
        };
    }, [isAuthenticated, token]);
    const title = useMemo(() => {
        if (user?.name)
            return `${user.name.split(' ')[0]}'s Orders`;
        return 'My Orders';
    }, [user?.name]);
    async function handleCancelOrder(orderNumber, orderId) {
        const confirmed = window.confirm('Are you sure you want to cancel this order?');
        if (!confirmed) {
            return;
        }
        try {
            setActionLoadingOrderId(orderId);
            setError(null);
            const updated = await apiRequest(`/orders/cancel/${encodeURIComponent(orderNumber)}`, {
                method: 'POST',
                body: JSON.stringify({ email: user?.email || '' }),
            }, token);
            if (updated.status === 'cancelled') {
                setOrders((prev) => prev.filter((item) => item._id !== orderId));
            }
            else {
                setOrders((prev) => prev.map((item) => item._id === orderId ? updated : item));
            }
        }
        catch (requestError) {
            setError(requestError instanceof Error
                ? requestError.message
                : 'Failed to cancel order.');
        }
        finally {
            setActionLoadingOrderId(null);
        }
    }
    function handleStartEdit(order) {
        setError(null);
        setEditingOrderId(order._id);
        setDraftItems(order.items.map((item) => ({
            size: item.size,
            quantity: item.quantity,
        })));
    }
    function handleCancelEdit() {
        setEditingOrderId(null);
        setDraftItems([]);
    }
    function updateDraftItem(index, patch) {
        setDraftItems((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)));
    }
    async function handleSaveEdit(order) {
        try {
            setSaveLoadingOrderId(order._id);
            setError(null);
            const updated = await apiRequest(`/orders/update-items/${encodeURIComponent(order.orderNumber)}`, {
                method: 'POST',
                body: JSON.stringify({
                    email: user?.email || '',
                    items: draftItems,
                }),
            }, token);
            setOrders((prev) => prev.map((item) => item._id === order._id ? updated : item));
            handleCancelEdit();
        }
        catch (requestError) {
            setError(requestError instanceof Error
                ? requestError.message
                : 'Failed to update order.');
        }
        finally {
            setSaveLoadingOrderId(null);
        }
    }
    if (!isAuthenticated) {
        return (<div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center lg:px-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
          Sign in to view your orders
        </h1>
        <p className="mt-3 text-sm text-foreground/50">
          You need to be logged in to access order history.
        </p>
        <Button asChild className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90">
          <Link href="/auth/login">Go to Sign In</Link>
        </Button>
      </div>);
    }
    return (<div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
      <div className="mb-10">
        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
          Account
        </p>
        <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {title}
        </h1>
      </div>

      {isLoading && (<div className="flex items-center gap-3 rounded-lg border border-border/40 bg-card px-5 py-4 text-sm text-foreground/60">
          <Loader2 className="h-4 w-4 animate-spin"/>
          Loading your orders...
        </div>)}

      {!isLoading && error && (<div className="rounded-lg border border-destructive/30 bg-destructive/10 px-5 py-4 text-sm text-destructive">
          {error}
        </div>)}

      {!isLoading && !error && orders.length === 0 && (<div className="flex flex-col items-center rounded-lg border border-border/40 bg-card px-6 py-14 text-center">
          <PackageSearch className="h-10 w-10 text-foreground/30"/>
          <h2 className="mt-4 font-serif text-xl font-semibold text-foreground">
            No orders yet
          </h2>
          <p className="mt-2 text-sm text-foreground/45">
            Place your first order to see it here.
          </p>
          <Button onClick={() => router.push('/shop')} className="mt-6 bg-primary text-primary-foreground hover:bg-primary/90">
            Start Shopping
          </Button>
        </div>)}

      {!isLoading && !error && orders.length > 0 && (<div className="flex flex-col gap-4">
          {orders.map((order) => (<article key={order._id} className="rounded-lg border border-border/40 bg-card p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/40">
                    Order Number
                  </p>
                  <p className="mt-1 font-serif text-lg font-semibold text-foreground">
                    {order.orderNumber}
                  </p>
                </div>
                <span className={`rounded-sm px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${statusClassMap[order.status] || 'bg-secondary text-foreground/70 border border-border/40'}`}>
                  {statusLabel[order.status]}
                </span>
              </div>

              <div className="mt-4 grid gap-2 text-[12px] text-foreground/55 md:grid-cols-3">
                <p>
                  Date: {new Date(order.createdAt).toLocaleDateString('en-IN')}
                </p>
                <p>
                  Items: {order.items.reduce((sum, item) => sum + item.quantity, 0)}
                </p>
                <p className="md:text-right">
                  Total: Rs.{order.totalAmount.toLocaleString('en-IN')}
                </p>
              </div>

              <div className="mt-4 h-px bg-border/40"/>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-2 text-[11px] text-foreground/45">
                  {order.items.slice(0, 4).map((item, index) => (<span key={`${order._id}-${item.name}-${index}`} className="rounded-md border border-border/40 px-2.5 py-1">
                      {item.name} x{item.quantity} ({item.size})
                    </span>))}
                  {order.items.length > 4 && (<span className="rounded-md border border-border/40 px-2.5 py-1">
                      +{order.items.length - 4} more items
                    </span>)}
                </div>
                {order.status === 'pending' && (<Button variant="outline" size="sm" onClick={() => handleStartEdit(order)} disabled={editingOrderId === order._id}>
                    {editingOrderId === order._id ? 'Editing...' : 'Edit Order'}
                  </Button>)}
              </div>

              {editingOrderId === order._id && (<div className="mt-4 rounded-md border border-border/40 p-3">
                  <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-foreground/50">
                    Edit Jersey Details
                  </p>
                  <div className="flex flex-col gap-3">
                    {order.items.map((item, index) => (<div key={`${order._id}-edit-${index}`} className="grid gap-2 md:grid-cols-[1.5fr,1fr,1fr]">
                        <div className="text-[12px] text-foreground/70">
                          {item.name}
                        </div>
                        <select className="rounded-md border border-border/40 bg-secondary px-2 py-1.5 text-[12px]" value={draftItems[index]?.size || item.size} onChange={(e) => updateDraftItem(index, { size: e.target.value })}>
                          {quickSizes.map((size) => (<option key={size} value={size}>
                              {size}
                            </option>))}
                          {!quickSizes.includes(item.size) && (<option value={item.size}>{item.size}</option>)}
                        </select>
                        <input type="number" min={1} className="rounded-md border border-border/40 bg-secondary px-2 py-1.5 text-[12px]" value={draftItems[index]?.quantity || item.quantity} onChange={(e) => updateDraftItem(index, { quantity: Math.max(1, Number(e.target.value || 1)) })}/>
                      </div>))}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" disabled={saveLoadingOrderId === order._id} onClick={() => handleSaveEdit(order)}>
                      {saveLoadingOrderId === order._id ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>)}

              <div className="mt-5">
                <div className="flex flex-wrap gap-2">
                  {['confirmed', 'shipped', 'delivered'].includes(order.status) && (<Button asChild variant="outline" className="border-border/50 text-foreground/70 hover:text-foreground">
                      <Link href={`/track-order?orderNumber=${encodeURIComponent(order.orderNumber)}&email=${encodeURIComponent(user?.email || '')}`}>
                        Track This Order
                      </Link>
                    </Button>)}
                  {order.status === 'pending' && (<Button variant="destructive" disabled={actionLoadingOrderId === order._id} onClick={() => handleCancelOrder(order.orderNumber, order._id)}>
                      {actionLoadingOrderId === order._id ? 'Cancelling...' : 'Cancel Order'}
                    </Button>)}
                </div>
              </div>
            </article>))}
        </div>)}
    </div>);
}
