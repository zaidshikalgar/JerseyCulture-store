import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
export function Hero() {
    return (<section className="relative flex min-h-[85vh] items-center overflow-hidden lg:min-h-[90vh]">
      {/* Background image */}
      <Image src="/images/hero-jersey.jpg" alt="Football player walking onto stadium pitch" fill priority sizes="100vw" className="object-cover object-[30%_50%]"/>

      {/* Dark overlay with strong left fade for text readability */}
      <div className="absolute inset-0 bg-background/50"/>
      <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-transparent"/>
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/30"/>

      <div className="relative z-10 w-full px-6 py-20 lg:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="max-w-3xl">
            {/* Season tag */}
            <p className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-primary md:text-sm">
              New Season 2025/26
            </p>

            {/* Main headline */}
            <h1 className="font-serif text-4xl font-bold italic leading-[1.05] text-foreground md:text-5xl lg:text-6xl">
              Wear Your
              <br />
              <span className="text-primary">Passion.</span>
              <br />
              Rep Your Culture.
            </h1>

            {/* Subtext */}
            <p className="mt-8 max-w-md text-sm leading-relaxed text-foreground/50 md:text-base">
              {"India's premier destination for authentic football jerseys. From club kits to national team classics."}
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg" className="h-13 rounded-none bg-primary px-10 text-xs font-bold uppercase tracking-[0.15em] text-primary-foreground hover:bg-primary/90">
                <Link href="/shop">
                  Shop Collection
                  <ArrowRight className="ml-3 h-4 w-4"/>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-13 rounded-none border-foreground/30 bg-transparent px-10 text-xs font-bold uppercase tracking-[0.15em] text-foreground hover:border-foreground hover:bg-foreground/5 hover:text-foreground">
                <Link href="/shop?category=national">National Teams</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>);
}
