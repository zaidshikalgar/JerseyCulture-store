'use client';
import { useEffect, useMemo, useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/api';
const statusLabel = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    shipped: 'In Transit',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};
export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState('');
    const [email, setEmail] = useState('');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const initialOrder = params.get('orderNumber') || '';
        const initialEmail = params.get('email') || '';
        if (initialOrder) {
            setOrderId(initialOrder);
        }
        if (initialEmail) {
            setEmail(initialEmail);
        }
    }, []);
    const timeline = useMemo(() => {
        const steps = [
            { key: 'pending', label: 'Order Placed', icon: CheckCircle },
            { key: 'confirmed', label: 'Confirmed', icon: Package },
            { key: 'shipped', label: 'In Transit', icon: Truck },
            { key: 'delivered', label: 'Delivered', icon: Clock },
        ];
        const currentIndex = order
            ? steps.findIndex((step) => step.key === order.status)
            : -1;
        return steps.map((step, index) => ({
            ...step,
            done: currentIndex >= index,
        }));
    }, [order]);
    async function handleTrack(e) {
        e.preventDefault();
        if (!orderId.trim() || !email.trim()) {
            setError('Please enter both order ID and email.');
            return;
        }
        setLoading(true);
        setError(null);
        setInfo(null);
        try {
            const data = await apiRequest(`/orders/track/${encodeURIComponent(orderId.trim())}?email=${encodeURIComponent(email.trim())}`);
            setOrder(data);
        }
        catch (trackError) {
            setOrder(null);
            setError(trackError instanceof Error ? trackError.message : 'Unable to track this order.');
        }
        finally {
            setLoading(false);
        }
    }
    async function handleCancelOrder() {
        if (!order)
            return;
        const confirmed = window.confirm('Are you sure you want to cancel this order?');
        if (!confirmed)
            return;
        setIsCancelling(true);
        setError(null);
        setInfo(null);
        try {
            const updated = await apiRequest(`/orders/cancel/${encodeURIComponent(order.orderNumber)}`, {
                method: 'POST',
                body: JSON.stringify({ email: email.trim() }),
            });
            setOrder(updated);
            setInfo('Order cancelled successfully.');
        }
        catch (cancelError) {
            setError(cancelError instanceof Error ? cancelError.message : 'Unable to cancel this order.');
        }
        finally {
            setIsCancelling(false);
        }
    }
    return (<div className="mx-auto max-w-2xl px-6 py-20 lg:px-8">
      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
        Order Status
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground">
        Track Your Order
      </h1>
      <p className="mt-6 text-sm leading-relaxed text-foreground/50">
        Enter your order ID and the email used during checkout to check the latest status.
      </p>

      <form onSubmit={handleTrack} className="mt-10 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/30"/>
          <input type="text" placeholder="e.g. JC-M1X2Y3Z" value={orderId} onChange={(e) => {
            setOrderId(e.target.value);
            setOrder(null);
        }} className="w-full rounded-md border border-border/50 bg-card py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:ring-1 focus:ring-primary"/>
        </div>
        <input type="email" placeholder="you@example.com" value={email} onChange={(e) => {
            setEmail(e.target.value);
            setOrder(null);
        }} className="w-full rounded-md border border-border/50 bg-card px-4 py-3.5 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:ring-1 focus:ring-primary md:w-64"/>
        <Button type="submit" disabled={loading} className="h-auto bg-primary px-8 text-[11px] font-medium uppercase tracking-[0.15em] text-primary-foreground hover:bg-primary/90 disabled:opacity-60">
          {loading ? (<span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin"/>
              Tracking
            </span>) : ('Track')}
        </Button>
      </form>

      {error && (<div className="mt-6 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-[12px] text-destructive">
          {error}
        </div>)}

      {info && (<div className="mt-6 rounded-md border border-primary/30 bg-primary/10 p-3 text-[12px] text-primary">
          {info}
        </div>)}

      {order && (<div className="mt-12">
          <div className="rounded-md border border-border/50 bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/40">
                  Order ID
                </p>
                <p className="mt-1 font-serif text-lg font-semibold text-foreground">
                  {order.orderNumber}
                </p>
              </div>
              <span className="rounded-sm bg-primary/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                {statusLabel[order.status]}
              </span>
            </div>
            <p className="mt-3 text-[11px] text-foreground/35">
              Total: Rs.{order.totalAmount.toLocaleString('en-IN')} . Items: {order.items.length}
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-0">
            {timeline.map((step, i, arr) => (<div key={step.label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${step.done
                    ? 'border-primary bg-primary/10'
                    : 'border-border/50 bg-card'}`}>
                    <step.icon className={`h-4 w-4 ${step.done ? 'text-primary' : 'text-foreground/25'}`}/>
                  </div>
                  {i < arr.length - 1 && (<div className={`h-12 w-px ${step.done ? 'bg-primary/30' : 'bg-border/50'}`}/>)}
                </div>
                <div className="pb-12">
                  <p className={`text-sm font-medium ${step.done ? 'text-foreground' : 'text-foreground/30'}`}>
                    {step.label}
                  </p>
                  <p className="mt-0.5 text-[11px] text-foreground/30">
                    {new Date(order.createdAt).toLocaleString('en-IN')}
                  </p>
                </div>
              </div>))}
          </div>

          {order.status === 'pending' && (<div className="mt-4">
              <Button variant="destructive" disabled={isCancelling} onClick={handleCancelOrder}>
                {isCancelling ? (<span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin"/>
                    Cancelling...
                  </span>) : ('Cancel Order')}
              </Button>
            </div>)}
        </div>)}

      {!order && !error && (<div className="mt-14 rounded-md border border-border/50 bg-card p-8">
          <h2 className="font-serif text-lg font-semibold text-foreground">
            Where to find your Order ID
          </h2>
          <ul className="mt-4 flex flex-col gap-3">
            {[
                'Check the order confirmation email sent to your registered email.',
                'Log into your account and go to Order History.',
                'Look for a message starting with "JC-" in your SMS inbox.',
            ].map((item) => (<li key={item} className="flex items-start gap-3 text-[12px] leading-relaxed text-foreground/40">
                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary"/>
                {item}
              </li>))}
          </ul>
        </div>)}
    </div>);
}
