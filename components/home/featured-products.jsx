import Link from 'next/link';
import { fetchFeaturedProducts } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
export async function FeaturedProducts() {
    const products = await fetchFeaturedProducts();
    return (<section className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
      <div className="mb-12 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
            Curated Selection
          </p>
          <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Featured Kits
          </h2>
        </div>
        <Link href="/shop" className="text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/40 transition-colors hover:text-primary">
          See All
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {products.slice(0, 8).map((product) => (<ProductCard key={product.id} product={product}/>))}
      </div>
    </section>);
}
