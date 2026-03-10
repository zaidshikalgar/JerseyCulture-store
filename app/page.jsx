import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/home/hero';
import { Categories } from '@/components/home/categories';
import { FeaturedProducts } from '@/components/home/featured-products';
import { CtaBanner } from '@/components/home/cta-banner';
import { Footer } from '@/components/footer';
export default function HomePage() {
    return (<div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturedProducts />
        <Categories />
        <CtaBanner />
      </main>
      <Footer />
    </div>);
}
