import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
const categories = [
    {
        title: 'Club Kits',
        description: 'La Liga, Premier League, Serie A & more',
        image: '/images/category-clubs.jpg',
        href: '/shop?category=club',
        imageClassName: 'object-[60%_35%]',
    },
    {
        title: 'National Teams',
        description: 'World Cup & continental tournament jerseys',
        image: '/images/category-national.jpg',
        href: '/shop?category=national',
    },
    {
        title: 'Retro Collection',
        description: 'Iconic kits from football history',
        image: '/images/category-retro.jpg',
        href: '/shop?category=retro',
    },
];
export function Categories() {
    return (<section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
            Collections
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Shop by Category
          </h2>
        </div>
        <Link href="/shop" className="hidden text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/40 transition-colors hover:text-primary md:block">
          View All
        </Link>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        {categories.map((cat) => (<Link key={cat.title} href={cat.href} className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-lg">
            <Image src={cat.image} alt={cat.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className={`object-cover transition-transform duration-700 group-hover:scale-105 group-hover:brightness-110 ${cat.imageClassName ?? ''}`}/>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"/>
            <div className="absolute inset-0 border border-foreground/5 rounded-lg"/>
            <div className="relative z-10 p-7">
              <div className="flex items-end justify-between">
                <div>
                  <h3 className="font-serif text-2xl font-semibold text-foreground">
                    {cat.title}
                  </h3>
                  <p className="mt-1 text-[12px] text-foreground/40">
                    {cat.description}
                  </p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/10 text-foreground/40 transition-all duration-300 group-hover:border-primary group-hover:text-primary">
                  <ArrowUpRight className="h-4 w-4"/>
                </div>
              </div>
            </div>
          </Link>))}
      </div>
    </section>);
}
