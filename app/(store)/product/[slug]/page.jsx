import { notFound } from 'next/navigation'
import { fetchProductBySlug, fetchProducts } from '@/lib/data'
import { ProductDetail } from '@/components/product/product-detail'

export async function generateMetadata({ params }) {
  const { slug } = await params
  const product = await fetchProductBySlug(slug)
  if (!product) return { title: 'Product Not Found' }
  return {
    title: `${product.name} | JerseyCulture`,
    description: product.description,
  }
}

export async function generateStaticParams() {
  const allProducts = await fetchProducts()
  return allProducts.map((p) => ({ slug: p.slug }))
}

export default async function ProductPage({ params }) {
  const { slug } = await params
  const product = await fetchProductBySlug(slug)
  if (!product) notFound()

  const allProducts = await fetchProducts()
  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category === product.category || p.team === product.team)
    )
    .slice(0, 4)

  return <ProductDetail product={product} relatedProducts={relatedProducts} />
}
