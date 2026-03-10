import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
const posts = [
    {
        slug: 'top-10-iconic-jerseys',
        title: 'Top 10 Most Iconic Football Jerseys of All Time',
        excerpt: 'From Brazil 1970 to AC Milan 1994, we count down the kits that defined football history.',
        image: '/images/category-retro.jpg',
        date: 'Feb 12, 2026',
        category: 'Culture',
    },
    {
        slug: 'new-season-kits-guide',
        title: 'Your Complete Guide to 2025/26 Season Kits',
        excerpt: 'Every major club has dropped their new kits. Here is everything you need to know.',
        image: '/images/category-clubs.jpg',
        date: 'Feb 8, 2026',
        category: 'New Arrivals',
    },
    {
        slug: 'jersey-care-tips',
        title: 'How to Care for Your Jersey: A Complete Guide',
        excerpt: 'Keep your jersey looking brand new with our expert washing and storage tips.',
        image: '/images/category-national.jpg',
        date: 'Jan 28, 2026',
        category: 'Guides',
    },
    {
        slug: 'rise-of-retro-kits',
        title: 'The Rise of Retro Kits: Why Nostalgia Sells',
        excerpt: 'Retro jerseys are outselling modern kits. We explore the trend reshaping football fashion.',
        image: '/images/hero-jersey.jpg',
        date: 'Jan 15, 2026',
        category: 'Culture',
    },
];
export default function BlogPage() {
    return (<div className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
        Journal
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground">
        The Culture Blog
      </h1>
      <p className="mt-4 max-w-lg text-sm leading-relaxed text-foreground/50">
        Stories, guides, and news from the world of football culture.
      </p>

      <div className="mt-14 grid gap-10 md:grid-cols-2">
        {posts.map((post) => (<article key={post.slug} className="group overflow-hidden rounded-md border border-border/50 bg-card">
            <div className="relative aspect-[16/10] overflow-hidden">
              <Image src={post.image} alt={post.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105"/>
              <div className="absolute inset-0 bg-background/20"/>
              <span className="absolute left-4 top-4 rounded-sm bg-primary px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em] text-primary-foreground">
                {post.category}
              </span>
            </div>
            <div className="p-6">
              <p className="text-[10px] text-foreground/30">{post.date}</p>
              <h2 className="mt-2 font-serif text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                {post.title}
              </h2>
              <p className="mt-3 text-[12px] leading-relaxed text-foreground/40">
                {post.excerpt}
              </p>
              <Link href="#" className="mt-5 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-primary transition-colors hover:text-primary/80">
                Read More
                <ArrowRight className="h-3 w-3"/>
              </Link>
            </div>
          </article>))}
      </div>
    </div>);
}
