import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function CtaBanner() {
    return (<section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="relative overflow-hidden rounded-lg border border-border/50 px-8 py-20 text-center md:px-20">
        {/* Background image */}
        <Image src="/images/cta-sale-bg.jpg" alt="Vintage jerseys hanging in a store window" fill sizes="(min-width: 1024px) 70vw, 100vw" className="pointer-events-none -z-20 object-cover object-[50%_40%]"/>

        {/* Dark overlay for readability */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-background/90 via-background/70 to-background/80"/>
        {/* Subtle decorative corner lines */}
        <div className="absolute left-8 top-8 h-12 w-12 border-l border-t border-primary/20"/>
        <div className="absolute bottom-8 right-8 h-12 w-12 border-b border-r border-primary/20"/>

        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
          Limited Time
        </p>
        <h2 className="mt-5 font-serif text-3xl font-semibold tracking-tight text-foreground md:text-5xl">
          Season Sale is Live
        </h2>
        <p className="mx-auto mt-5 max-w-md text-sm leading-relaxed text-foreground/40">
          Get up to 30% off on select club and national team jerseys.
          Limited stock available.
        </p>
        <Button asChild size="lg" className="mt-10 h-12 bg-primary px-8 text-[11px] font-medium uppercase tracking-[0.15em] text-primary-foreground hover:bg-primary/90">
          <Link href="/shop">
            Shop the Sale
            <ArrowRight className="ml-3 h-4 w-4"/>
          </Link>
        </Button>
      </div>
    </section>);
}
