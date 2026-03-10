'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag, Tag, Shield, Truck, RotateCcw } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
export function CartContent() {
    const { items, removeItem, updateQuantity, totalPrice } = useCart();
    const [coupon, setCoupon] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const discount = couponApplied ? Math.round(totalPrice * 0.1) : 0;
    const shipping = totalPrice - discount >= 1999 ? 0 : 149;
    const total = totalPrice - discount + shipping;
    if (items.length === 0) {
        return (<div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-32 text-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-border/30 bg-secondary">
          <ShoppingBag className="h-10 w-10 text-foreground/20"/>
        </div>
        <h1 className="mt-8 font-serif text-3xl font-semibold text-foreground">
          Your cart is empty
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-foreground/40">
          Looks like you haven&apos;t added any jerseys yet. Explore our collection and find your perfect kit.
        </p>
        <Button asChild className="mt-8 h-12 gap-2 bg-primary px-10 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-foreground hover:bg-primary/90">
          <Link href="/shop">
            Browse Collection
            <ArrowLeft className="h-3.5 w-3.5 rotate-180"/>
          </Link>
        </Button>
      </div>);
    }
    return (<div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-[11px] text-foreground/30">
        <Link href="/" className="transition-colors hover:text-foreground/60">Home</Link>
        <span>/</span>
        <Link href="/shop" className="transition-colors hover:text-foreground/60">Shop</Link>
        <span>/</span>
        <span className="text-foreground/60">Cart</span>
      </div>

      {/* Header with item count */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
            Shopping Cart
          </h1>
          <p className="mt-1.5 text-sm text-foreground/40">
            {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>
        <Link href="/shop" className="hidden items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/40 transition-colors hover:text-primary md:inline-flex">
          <ArrowLeft className="h-3.5 w-3.5"/>
          Continue Shopping
        </Link>
      </div>

      <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
        {/* Cart items */}
        <div className="lg:col-span-2">
          {/* Column headers */}
          <div className="mb-4 hidden border-b border-border/30 pb-3 md:grid md:grid-cols-[1fr_120px_120px_40px]">
            <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/30">Product</span>
            <span className="text-center text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/30">Quantity</span>
            <span className="text-right text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/30">Total</span>
            <span />
          </div>

          <div className="flex flex-col gap-4">
            {items.map((item) => (<div key={`${item.product.id}-${item.size}`} className="group rounded-lg border border-border/30 bg-card p-4 transition-colors hover:border-border/60 md:grid md:grid-cols-[1fr_120px_120px_40px] md:items-center md:gap-4 md:p-5">
                {/* Product info */}
                <div className="flex gap-4">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-secondary">
                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="80px"/>
                  </div>
                  <div className="flex flex-col justify-center">
                    <Link href={`/product/${item.product.slug}`} className="text-sm font-medium text-foreground transition-colors hover:text-primary">
                      {item.product.name}
                    </Link>
                    <p className="mt-1 text-[11px] text-foreground/40">
                      {item.product.team} &middot; Size {item.size}
                    </p>
                    <p className="mt-1 text-[12px] font-medium text-foreground/60 md:hidden">
                      {'Rs.'}
                      {item.product.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Quantity - mobile has different layout */}
                <div className="mt-4 flex items-center justify-between md:mt-0 md:justify-center">
                  <div className="inline-flex items-center rounded-md border border-border/40">
                    <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)} className="flex h-8 w-8 items-center justify-center text-foreground/40 transition-colors hover:text-foreground" aria-label="Decrease quantity">
                      <Minus className="h-3 w-3"/>
                    </button>
                    <span className="flex h-8 w-8 items-center justify-center border-x border-border/40 text-[12px] font-medium text-foreground">
                      {item.quantity}
                    </span>
                    <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)} className="flex h-8 w-8 items-center justify-center text-foreground/40 transition-colors hover:text-foreground" aria-label="Increase quantity">
                      <Plus className="h-3 w-3"/>
                    </button>
                  </div>

                  {/* Mobile price + remove */}
                  <div className="flex items-center gap-3 md:hidden">
                    <p className="text-sm font-semibold text-primary">
                      {'Rs.'}
                      {(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                    <button onClick={() => removeItem(item.product.id, item.size)} className="text-foreground/20 transition-colors hover:text-destructive" aria-label={`Remove ${item.product.name}`}>
                      <Trash2 className="h-4 w-4"/>
                    </button>
                  </div>
                </div>

                {/* Desktop total */}
                <p className="hidden text-right text-sm font-semibold text-primary md:block">
                  {'Rs.'}
                  {(item.product.price * item.quantity).toLocaleString('en-IN')}
                </p>

                {/* Desktop remove */}
                <button onClick={() => removeItem(item.product.id, item.size)} className="hidden text-foreground/20 transition-colors hover:text-destructive md:block" aria-label={`Remove ${item.product.name}`}>
                  <Trash2 className="h-4 w-4"/>
                </button>
              </div>))}
          </div>
        </div>

        {/* Order summary sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-36 space-y-5">
            <div className="rounded-lg border border-border/30 bg-card p-6">
              <h2 className="text-[10px] font-medium uppercase tracking-[0.25em] text-foreground/40">
                Order Summary
              </h2>

              {/* Coupon */}
              <div className="mt-5">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-foreground/20"/>
                    <input type="text" value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="Coupon code" className="w-full rounded-md border border-border/40 bg-secondary py-2.5 pl-9 pr-3 text-[12px] text-foreground placeholder:text-foreground/25 focus:outline-none focus:ring-1 focus:ring-primary"/>
                  </div>
                  <button onClick={() => {
            if (coupon.trim())
                setCouponApplied(true);
        }} className="rounded-md border border-primary/50 bg-primary/10 px-4 text-[11px] font-medium text-primary transition-colors hover:bg-primary/20">
                    Apply
                  </button>
                </div>
                {couponApplied && (<p className="mt-2 text-[11px] text-green-500">
                    Coupon applied! 10% discount.
                  </p>)}
              </div>

              <div className="my-5 h-px bg-border/30"/>

              {/* Price breakdown */}
              <div className="flex flex-col gap-3">
                <div className="flex justify-between text-[12px]">
                  <span className="text-foreground/40">Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="font-medium text-foreground">
                    {'Rs.'}
                    {totalPrice.toLocaleString('en-IN')}
                  </span>
                </div>
                {couponApplied && (<div className="flex justify-between text-[12px]">
                    <span className="text-green-500">Discount (10%)</span>
                    <span className="font-medium text-green-500">
                      -Rs.{discount.toLocaleString('en-IN')}
                    </span>
                  </div>)}
                <div className="flex justify-between text-[12px]">
                  <span className="text-foreground/40">Shipping</span>
                  <span className="font-medium text-foreground">
                    {shipping === 0 ? (<span className="text-green-500">FREE</span>) : (`Rs.${shipping}`)}
                  </span>
                </div>
                {shipping > 0 && (<div className="rounded-md bg-primary/5 px-3 py-2">
                    <p className="text-[11px] text-primary">
                      Add Rs.{(1999 - (totalPrice - discount)).toLocaleString('en-IN')} more for free shipping
                    </p>
                  </div>)}
              </div>

              <div className="my-5 h-px bg-border/30"/>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground/60">Total</span>
                <span className="font-serif text-2xl font-bold text-primary">
                  {'Rs.'}
                  {total.toLocaleString('en-IN')}
                </span>
              </div>

              <Button asChild size="lg" className="mt-6 h-12 w-full bg-primary text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-foreground hover:bg-primary/90">
                <Link href="/checkout">Proceed to Checkout</Link>
              </Button>

              <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-foreground/30">
                <Shield className="h-3 w-3"/>
                Secure checkout powered by Razorpay
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3">
              <div className="flex flex-col items-center gap-2 rounded-lg border border-border/20 bg-card p-3 text-center">
                <Truck className="h-4 w-4 text-primary"/>
                <span className="text-[10px] text-foreground/40">Free Shipping<br />above Rs.1999</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border border-border/20 bg-card p-3 text-center">
                <RotateCcw className="h-4 w-4 text-primary"/>
                <span className="text-[10px] text-foreground/40">Easy Returns<br />7-day window</span>
              </div>
              <div className="flex flex-col items-center gap-2 rounded-lg border border-border/20 bg-card p-3 text-center">
                <Shield className="h-4 w-4 text-primary"/>
                <span className="text-[10px] text-foreground/40">100% Authentic<br />Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
