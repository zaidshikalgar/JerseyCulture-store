'use client';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, Grid3X3, List, X } from 'lucide-react';
import { fetchProducts, products } from '@/lib/data';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, } from '@/components/ui/sheet';
const categories = ['all', 'club', 'national', 'retro'];
const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'newest', label: 'Newest First' },
];
const clubs = [
    'All Clubs',
    'FC Barcelona',
    'Real Madrid',
    'Manchester United',
    'Chelsea',
    'PSG',
    'AC Milan',
    'Liverpool FC',
    'Bayern Munich',
    'Ajax',
];
const nationalTeams = [
    'All Nations',
    'Argentina',
    'Brazil',
    'France',
    'Germany',
    'Portugal',
    'Spain',
    'Italy',
    'Netherlands',
    'India',
];
function FilterSidebar({ selectedCategory, setSelectedCategory, selectedTeam, setSelectedTeam, }) {
    return (<div className="flex flex-col gap-10">
      {/* Categories */}
      <div>
        <h3 className="mb-4 text-[9px] font-medium uppercase tracking-[0.25em] text-foreground/50">
          Category
        </h3>
        <div className="flex flex-col gap-0.5">
          {categories.map((cat) => (<button key={cat} onClick={() => setSelectedCategory(cat)} className={`cursor-target rounded-md px-3 py-2.5 text-left text-[12px] font-medium transition-colors ${selectedCategory === cat
                ? 'bg-primary/10 text-primary'
                : 'text-foreground/40 hover:text-foreground'}`}>
              {cat === 'all' ? 'All Jerseys' : `${cat.charAt(0).toUpperCase()}${cat.slice(1)} Kits`}
            </button>))}
        </div>
      </div>

      {/* Clubs */}
      <div>
        <h3 className="mb-4 text-[9px] font-medium uppercase tracking-[0.25em] text-foreground/50">
          Clubs
        </h3>
        <div className="flex flex-col gap-0.5">
          {clubs.map((club) => (<button key={club} onClick={() => setSelectedTeam(club === 'All Clubs' ? null : club)} className={`cursor-target rounded-md px-3 py-2.5 text-left text-[12px] font-medium transition-colors ${(club === 'All Clubs' && selectedTeam === null) || selectedTeam === club
                ? 'bg-primary/10 text-primary'
                : 'text-foreground/40 hover:text-foreground'}`}>
              {club}
            </button>))}
        </div>
      </div>

      {/* National Teams */}
      <div>
        <h3 className="mb-4 text-[9px] font-medium uppercase tracking-[0.25em] text-foreground/50">
          National Teams
        </h3>
        <div className="flex flex-col gap-0.5">
          {nationalTeams.map((nation) => (<button key={nation} onClick={() => setSelectedTeam(nation === 'All Nations' ? null : nation)} className={`cursor-target rounded-md px-3 py-2.5 text-left text-[12px] font-medium transition-colors ${(nation === 'All Nations' && selectedTeam === null) || selectedTeam === nation
                ? 'bg-primary/10 text-primary'
                : 'text-foreground/40 hover:text-foreground'}`}>
              {nation}
            </button>))}
        </div>
      </div>
    </div>);
}
export function ShopContent() {
    const searchParams = useSearchParams();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [sortBy, setSortBy] = useState('featured');
    const [viewMode, setViewMode] = useState('grid');
    const [productList, setProductList] = useState(products);
    // Sync with URL params after hydration
    useEffect(() => {
        const categoryParam = searchParams.get('category') || 'all';
        setSelectedCategory(categoryParam);
    }, [searchParams]);
    useEffect(() => {
        let isMounted = true;
        async function loadProducts() {
            const apiProducts = await fetchProducts();
            if (isMounted) {
                setProductList(apiProducts);
            }
        }
        loadProducts();
        return () => {
            isMounted = false;
        };
    }, []);
    const filteredProducts = useMemo(() => {
        let filtered = [...productList];
        if (selectedCategory !== 'all') {
            filtered = filtered.filter((p) => p.category === selectedCategory);
        }
        if (selectedTeam !== null) {
            filtered = filtered.filter((p) => p.team === selectedTeam);
        }
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filtered.sort((a, b) => (a.isNew === b.isNew ? 0 : a.isNew ? -1 : 1));
                break;
        }
        return filtered;
    }, [productList, selectedCategory, selectedTeam, sortBy]);
    const activeFilters = [
        ...(selectedCategory !== 'all' ? [selectedCategory] : []),
        ...(selectedTeam !== null ? [selectedTeam] : []),
    ];
    return (<div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
          {selectedCategory === 'all'
            ? 'All Jerseys'
            : `${selectedCategory.charAt(0).toUpperCase()}${selectedCategory.slice(1)} Kits`}
        </h1>
        <p className="mt-2 text-[12px] text-foreground/40">
          {filteredProducts.length} products found
        </p>
      </div>

      <div className="flex gap-10">
        {/* Desktop sidebar */}
        <aside className="hidden w-52 shrink-0 lg:block">
          <FilterSidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} selectedTeam={selectedTeam} setSelectedTeam={setSelectedTeam}/>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          {/* Toolbar */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Mobile filter trigger */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="border-border/50 text-[11px] font-medium uppercase tracking-wider text-foreground/60 lg:hidden">
                    <SlidersHorizontal className="mr-2 h-3.5 w-3.5"/>
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 border-border/50 bg-background p-8">
                  <SheetTitle className="mb-8 font-serif text-lg font-semibold text-foreground">
                    Filters
                  </SheetTitle>
                  <FilterSidebar selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} selectedTeam={selectedTeam} setSelectedTeam={setSelectedTeam}/>
                </SheetContent>
              </Sheet>

              {/* Active filters */}
              {activeFilters.length > 0 && (<div className="flex flex-wrap items-center gap-2">
                  {activeFilters.map((filter) => (<Badge key={filter} variant="secondary" className="gap-1.5 border border-border/50 bg-secondary text-[10px] font-medium uppercase tracking-wider text-secondary-foreground">
                      {filter}
                      <button onClick={() => {
                    if (categories.includes(filter)) {
                        setSelectedCategory('all');
                    }
                    else {
                        setSelectedTeam(null);
                    }
                }} aria-label={`Remove ${filter} filter`}>
                        <X className="h-3 w-3"/>
                      </button>
                    </Badge>))}
                </div>)}
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="rounded-md border border-border/50 bg-background px-3 py-1.5 text-[11px] text-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary" aria-label="Sort products">
                {sortOptions.map((opt) => (<option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>))}
              </select>

              {/* View toggle */}
              <div className="hidden items-center gap-0.5 md:flex">
                <Button variant="ghost" size="icon" className={viewMode === 'grid' ? 'text-primary' : 'text-foreground/30'} onClick={() => setViewMode('grid')} aria-label="Grid view">
                  <Grid3X3 className="h-4 w-4"/>
                </Button>
                <Button variant="ghost" size="icon" className={viewMode === 'list' ? 'text-primary' : 'text-foreground/30'} onClick={() => setViewMode('list')} aria-label="List view">
                  <List className="h-4 w-4"/>
                </Button>
              </div>
            </div>
          </div>

          {/* Products grid */}
          {filteredProducts.length > 0 ? (<div className={viewMode === 'grid'
                ? 'grid grid-cols-2 gap-5 md:grid-cols-3'
                : 'flex flex-col gap-5'}>
              {filteredProducts.map((product) => (<ProductCard key={product.id} product={product}/>))}
            </div>) : (<div className="flex flex-col items-center justify-center py-24 text-center">
              <p className="font-serif text-lg font-semibold text-foreground">
                No jerseys found
              </p>
              <p className="mt-2 text-[12px] text-foreground/40">
                Try adjusting your filters to find what you are looking for.
              </p>
              <Button variant="outline" className="mt-6 border-border/50 text-[11px] font-medium uppercase tracking-wider text-foreground/60" onClick={() => {
                setSelectedCategory('all');
                setSelectedTeam(null);
            }}>
                Clear Filters
              </Button>
            </div>)}
        </div>
      </div>
    </div>);
}
