'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
export function ProductCard({ product }) {
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null;
    return (<Link href={`/product/${product.slug}`} className="cursor-target group relative flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-all duration-300 hover:border-primary/20">
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        <Image src={product.image} alt={product.name} fill loading="eager" className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw"/>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badge && (<Badge className="border-0 bg-primary/90 text-[9px] font-medium uppercase tracking-wider text-primary-foreground backdrop-blur-sm">
              {product.badge}
            </Badge>)}
          {product.isNew && (<Badge className="border-0 bg-foreground/80 text-[9px] font-medium uppercase tracking-wider text-background backdrop-blur-sm">
              New
            </Badge>)}
          {discount && (<Badge className="border-0 bg-destructive/90 text-[9px] font-medium uppercase tracking-wider text-destructive-foreground backdrop-blur-sm">
              {`-${discount}%`}
            </Badge>)}
        </div>

        {/* Quick view */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center bg-background/80 p-3 backdrop-blur-sm transition-transform duration-300 group-hover:translate-y-0">
          <span className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.15em] text-foreground">
            <ShoppingBag className="h-3.5 w-3.5"/>
            Quick View
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col p-4">
        <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-foreground/40">
          {product.team}
        </p>
        <h3 className="mt-1.5 line-clamp-2 text-[13px] font-medium leading-snug text-foreground">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-4">
          <span className="text-sm font-semibold text-primary">
            {'Rs.'}
            {product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (<span className="text-[11px] text-foreground/30 line-through">
              {'Rs.'}
              {product.originalPrice.toLocaleString('en-IN')}
            </span>)}
        </div>
      </div>
    </Link>);
}
