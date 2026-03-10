'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Minus, Plus, ShoppingBag, Truck, Shield, RefreshCw, Check, } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ProductCard } from '@/components/product-card';
export function ProductDetail({ product, relatedProducts, }) {
    const { addItem } = useCart();
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;
    function handleAddToCart() {
        if (!selectedSize)
            return;
        addItem(product, selectedSize, quantity);
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
    }
    return (<div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      {/* Breadcrumb */}
      <Link href="/shop" className="mb-10 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/40 transition-colors hover:text-primary">
        <ArrowLeft className="h-3.5 w-3.5"/>
        Back to Shop
      </Link>

      <div className="grid gap-14 lg:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary">
          <Image src={product.image} alt={product.name} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 50vw"/>
          {product.badge && (<Badge className="absolute left-4 top-4 border-0 bg-primary/90 text-[9px] font-medium uppercase tracking-wider text-primary-foreground backdrop-blur-sm">
              {product.badge}
            </Badge>)}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
            {product.team}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mt-5 flex items-baseline gap-3">
            <span className="font-serif text-3xl font-semibold text-primary">
              {'Rs.'}
              {product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice && (<>
                <span className="text-sm text-foreground/30 line-through">
                  {'Rs.'}
                  {product.originalPrice.toLocaleString('en-IN')}
                </span>
                <Badge className="border-0 bg-destructive/90 text-[9px] font-medium uppercase tracking-wider text-destructive-foreground">
                  {`${discount}% OFF`}
                </Badge>
              </>)}
          </div>

          <p className="mt-5 text-[13px] leading-relaxed text-foreground/50">
            {product.description}
          </p>

          {/* Divider */}
          <div className="my-8 h-px bg-border/50"/>

          {/* Size selector */}
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-foreground/60">
                Select Size
              </p>
              <button className="text-[10px] font-medium uppercase tracking-[0.15em] text-primary hover:underline">
                Size Guide
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.sizes.map((size) => (<button key={size} onClick={() => setSelectedSize(size)} className={`flex h-11 w-14 items-center justify-center rounded-md border text-[12px] font-medium transition-all duration-200 ${selectedSize === size
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border/50 text-foreground/60 hover:border-foreground/30 hover:text-foreground'}`}>
                  {size}
                </button>))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-6">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.25em] text-foreground/60">
              Quantity
            </p>
            <div className="inline-flex items-center rounded-md border border-border/50">
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="flex h-10 w-10 items-center justify-center text-foreground/40 transition-colors hover:text-foreground" aria-label="Decrease quantity">
                <Minus className="h-3.5 w-3.5"/>
              </button>
              <span className="flex h-10 w-12 items-center justify-center text-[13px] font-medium text-foreground">
                {quantity}
              </span>
              <button onClick={() => setQuantity(quantity + 1)} className="flex h-10 w-10 items-center justify-center text-foreground/40 transition-colors hover:text-foreground" aria-label="Increase quantity">
                <Plus className="h-3.5 w-3.5"/>
              </button>
            </div>
          </div>

          {/* Add to cart */}
          <Button size="lg" className="mt-8 h-12 w-full bg-primary text-[11px] font-medium uppercase tracking-[0.15em] text-primary-foreground hover:bg-primary/90 disabled:opacity-40" onClick={handleAddToCart} disabled={!selectedSize}>
            {added ? (<span className="flex items-center gap-2">
                <Check className="h-4 w-4"/>
                Added to Cart
              </span>) : (<span className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4"/>
                Add to Cart
              </span>)}
          </Button>

          {/* Features */}
          <div className="mt-8 rounded-lg border border-border/50 p-6">
            <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.25em] text-foreground/60">
              Key Features
            </p>
            <ul className="flex flex-col gap-3">
              {product.features.map((f) => (<li key={f} className="flex items-center gap-3 text-[12px] text-foreground/50">
                  <Check className="h-3 w-3 text-primary"/>
                  {f}
                </li>))}
            </ul>
          </div>

          {/* Trust badges */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
            { icon: Truck, label: 'Free Delivery' },
            { icon: Shield, label: '100% Authentic' },
            { icon: RefreshCw, label: 'Easy Returns' },
        ].map((item) => (<div key={item.label} className="flex flex-col items-center gap-2 rounded-lg border border-border/30 p-4 text-center">
                <item.icon className="h-4 w-4 text-primary/70"/>
                <span className="text-[9px] font-medium uppercase tracking-wider text-foreground/40">
                  {item.label}
                </span>
              </div>))}
          </div>
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (<section className="mt-24">
          <div className="mb-10 h-px bg-border/50"/>
          <h2 className="mb-8 font-serif text-2xl font-semibold tracking-tight text-foreground">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {relatedProducts.map((p) => (<ProductCard key={p.id} product={p}/>))}
          </div>
        </section>)}
    </div>);
}
