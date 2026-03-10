export const products = [
    {
        id: '1',
        name: 'FC Barcelona Home Kit 2025/26',
        slug: 'fc-barcelona-home-2025',
        price: 2499,
        originalPrice: 3499,
        image: '/images/products/jersey-1.jpg',
        category: 'club',
        league: 'La Liga',
        team: 'FC Barcelona',
        badge: 'Best Seller',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'The iconic blaugrana stripes return in this premium home kit. Engineered with advanced moisture-wicking fabric for peak performance on and off the pitch.',
        features: [
            'Dri-FIT ADV technology',
            'Recycled polyester fabric',
            'Authentic club crest',
            'Ventilation zones',
        ],
        isFeatured: true,
        isNew: true,
    },
    {
        id: '2',
        name: 'Real Madrid Home Kit 2025/26',
        slug: 'real-madrid-home-2025',
        price: 2499,
        originalPrice: 3299,
        image: '/images/products/jersey-2.jpg',
        category: 'club',
        league: 'La Liga',
        team: 'Real Madrid',
        badge: 'Popular',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'A timeless all-white design elevated with golden accents. The pinnacle of football elegance for Los Blancos faithful.',
        features: [
            'AEROREADY technology',
            'Premium breathable mesh',
            'Embroidered club badge',
            'Slim athletic fit',
        ],
        isFeatured: true,
    },
    {
        id: '3',
        name: 'Manchester United Home Kit 2025/26',
        slug: 'manchester-united-home-2025',
        price: 2299,
        originalPrice: 2999,
        image: '/images/products/jersey-3.jpg',
        category: 'club',
        league: 'Premier League',
        team: 'Manchester United',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'The legendary Red Devils home jersey. Bold, iconic, and built for those who never stop believing.',
        features: [
            'Dri-FIT technology',
            'Woven team crest',
            'Tagless neck label',
            'Standard fit',
        ],
        isFeatured: true,
        isNew: true,
    },
    {
        id: '4',
        name: 'Paris Saint-Germain Home Kit 2025/26',
        slug: 'psg-home-2025',
        price: 2699,
        image: '/images/products/jersey-4.jpg',
        category: 'club',
        league: 'Ligue 1',
        team: 'PSG',
        badge: 'Premium',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'Parisian luxury meets elite sport. The signature navy with a bold red stripe defines the modern era of Le Parc.',
        features: [
            'Vapor Match technology',
            'Authentic player version',
            'Heat-applied crest',
            'Engineered fit',
        ],
        isFeatured: true,
    },
    {
        id: '5',
        name: 'Argentina Home Kit 2025',
        slug: 'argentina-home-2025',
        price: 2799,
        originalPrice: 3499,
        image: '/images/products/jersey-5.jpg',
        category: 'national',
        team: 'Argentina',
        badge: 'World Champions',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'Worn by champions. The legendary Albiceleste stripes carry the weight of three World Cup titles.',
        features: [
            'HEAT.RDY technology',
            'Three-star crest',
            'Recycled materials',
            'Authentic design',
        ],
        isNew: true,
        isFeatured: true,
    },
    {
        id: '6',
        name: 'AC Milan Home Kit 2025/26',
        slug: 'ac-milan-home-2025',
        price: 2399,
        image: '/images/products/jersey-6.jpg',
        category: 'club',
        league: 'Serie A',
        team: 'AC Milan',
        sizes: ['S', 'M', 'L', 'XL'],
        description: 'The Rossoneri heritage continues. Classic red and black stripes redefine Italian football style.',
        features: [
            'Dri-FIT technology',
            'Embroidered badge',
            'Mesh ventilation panels',
            'Regular fit',
        ],
    },
    {
        id: '7',
        name: 'India National Team Home Kit 2025',
        slug: 'india-home-2025',
        price: 1999,
        originalPrice: 2499,
        image: '/images/products/jersey-7.jpg',
        category: 'national',
        team: 'India',
        badge: 'Desh Ka Kit',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'Wear the blue of the Blue Tigers. Built for Indian football, designed for Indian passion.',
        features: [
            'Moisture-wicking fabric',
            'AIFF official badge',
            'Lightweight construction',
            'True-to-size fit',
        ],
        isNew: true,
        isFeatured: true,
    },
    {
        id: '8',
        name: 'Liverpool FC Home Kit 2025/26',
        slug: 'liverpool-home-2025',
        price: 2399,
        originalPrice: 2999,
        image: '/images/products/jersey-8.jpg',
        category: 'club',
        league: 'Premier League',
        team: 'Liverpool FC',
        badge: 'YNWA',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        description: 'Anfield Red. The colour that strikes fear in opponents and ignites passion in millions.',
        features: [
            'Dri-FIT ADV technology',
            'Liverbird crest',
            'YNWA collar detail',
            'Engineered mesh zones',
        ],
        isFeatured: true,
    },
];
export function getProductBySlug(slug) {
    return products.find((p) => p.slug === slug);
}
export function getFeaturedProducts() {
    return products.filter((p) => p.isFeatured);
}
export function getNewArrivals() {
    return products.filter((p) => p.isNew);
}
export function getProductsByCategory(category) {
    return products.filter((p) => p.category === category);
}
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:5000/api';
function normalizeProduct(product) {
    return {
        ...product,
        id: product.id || product._id || product.slug,
    };
}
async function fetchFromApi(path, init) {
    try {
        const response = await fetch(`${API_BASE_URL}${path}`, {
            ...init,
            next: { revalidate: 60 },
        });
        if (!response.ok) {
            return null;
        }
        return (await response.json());
    }
    catch {
        return null;
    }
}
export async function fetchProducts(query) {
    const search = new URLSearchParams();
    if (query?.category)
        search.set('category', query.category);
    if (query?.featured)
        search.set('featured', 'true');
    if (query?.isNew)
        search.set('new', 'true');
    const queryString = search.toString();
    const data = await fetchFromApi(`/products${queryString ? `?${queryString}` : ''}`);
    if (!data) {
        let fallback = [...products];
        if (query?.category)
            fallback = fallback.filter((p) => p.category === query.category);
        if (query?.featured)
            fallback = fallback.filter((p) => p.isFeatured);
        if (query?.isNew)
            fallback = fallback.filter((p) => p.isNew);
        return fallback;
    }
    return data.map(normalizeProduct);
}
export async function fetchProductBySlug(slug) {
    const data = await fetchFromApi(`/products/${slug}`);
    if (!data)
        return getProductBySlug(slug) || null;
    return normalizeProduct(data);
}
export async function fetchFeaturedProducts() {
    return fetchProducts({ featured: true });
}
