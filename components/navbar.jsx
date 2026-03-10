'use client';

// Importing necessary hooks and components
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu, X, Search, User } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { NavBar as TubelightNavBar } from '@/components/ui/tubelight-navbar';

// Navigation links array - could be moved to a config file later
const navLinks = [
    { href: '/shop', label: 'Shop' },
    { href: '/shop?category=club', label: 'Clubs' },
    { href: '/shop?category=national', label: 'National' },
    { href: '/shop?category=retro', label: 'Retro' },
];
// Main Navbar component
export function Navbar() {
    const { totalItems } = useCart();
    const { isAuthenticated, logout } = useAuth();
    const pathname = usePathname();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const shouldHideShopTabs = pathname === '/auth/login' || pathname.startsWith('/admin') || pathname.startsWith('/account') || pathname.startsWith('/my-orders');
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Rendering the navbar structure
    return (<header className="sticky top-0 z-50">
      {/* Main nav */}
      <nav className="border-b border-border/30 bg-background">
        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6 lg:px-10">
          {/* Mobile menu (client-only to avoid hydration id mismatch from Radix Sheet) */}
          {isMounted && (<div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-foreground hover:bg-transparent hover:text-primary" aria-label="Open menu">
                    <Menu className="h-5 w-5"/>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 border-border/30 bg-background p-8">
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                  <div className="mb-10">
                    <Link href="/" className="font-serif text-xl tracking-wider text-foreground">
                      JERSEY
                      <span className="block text-[11px] font-sans font-bold tracking-[0.35em] text-primary">
                        CULTURE
                      </span>
                    </Link>
                  </div>
                  <nav className="flex flex-col gap-1">
                    {!shouldHideShopTabs && navLinks.map((link) => (<Link key={link.href} href={link.href} className="cursor-target border-b border-border/20 py-4 text-sm font-medium uppercase tracking-[0.15em] text-foreground/80 transition-colors hover:text-primary">
                        {link.label}
                      </Link>))}
                    <div className="mt-8 flex flex-col gap-1">
                      {!isAuthenticated ? (<>
                          <Link href="/auth/login" className="py-3 text-sm font-medium uppercase tracking-[0.1em] text-foreground/50 transition-colors hover:text-foreground">
                            Sign In
                          </Link>
                          <Link href="/auth/register" className="py-3 text-sm font-medium uppercase tracking-[0.1em] text-foreground/50 transition-colors hover:text-foreground">
                            Create Account
                          </Link>
                        </>) : (<>
                          <Link href="/my-orders" className="py-3 text-sm font-medium uppercase tracking-[0.1em] text-foreground/50 transition-colors hover:text-foreground">
                            My Orders
                          </Link>
                          <button onClick={logout} className="py-3 text-left text-sm font-medium uppercase tracking-[0.1em] text-foreground/50 transition-colors hover:text-foreground">
                            Sign Out
                          </button>
                        </>)}
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>)}

          {/* Left logo */}
          <Link href="/" className="text-center lg:text-left">
            <span className="font-serif text-2xl font-bold tracking-[0.05em] text-foreground">
              JERSEY
            </span>
            <span className="block text-[10px] font-sans font-bold tracking-[0.35em] text-primary">
              CULTURE
            </span>
          </Link>

          {/* Centered nav - Tubelight navbar */}
          {!shouldHideShopTabs && (<div className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 -mt-2 items-center lg:flex">
            <TubelightNavBar items={[
            { name: 'Shop', url: '/shop', icon: ShoppingBag },
            { name: 'Clubs', url: '/shop?category=club', icon: ShoppingBag },
            { name: 'National', url: '/shop?category=national', icon: ShoppingBag },
            { name: 'Retro', url: '/shop?category=retro', icon: ShoppingBag },
        ]} className="static top-auto left-auto translate-x-0 mb-0 pt-0"/>
          </div>)}

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <Button variant="ghost" size="icon" className="text-foreground/80 hover:bg-transparent hover:text-foreground" onClick={() => setIsSearchOpen(!isSearchOpen)} aria-label="Search">
              <Search className="h-7 w-7"/>
            </Button>

            <Link href={isAuthenticated ? '/account' : '/auth/login'}>
              <Button variant="ghost" size="icon" className="hidden text-foreground/80 hover:bg-transparent hover:text-foreground lg:flex" aria-label={isAuthenticated ? 'Account' : 'Sign in'}>
                <User className="h-7 w-7"/>
              </Button>
            </Link>

            <Link href="/cart" className="relative">
              <Button variant="ghost" size="icon" className="text-foreground/80 hover:bg-transparent hover:text-foreground" aria-label={`Cart with ${totalItems} items`}>
                <ShoppingBag className="h-7 w-7"/>
                {totalItems > 0 && (<span className="absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                    {totalItems}
                  </span>)}
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Search overlay */}
      {isSearchOpen && (<div className="border-b border-border/30 bg-background px-6 py-5">
          <div className="mx-auto flex max-w-2xl items-center gap-4">
            <Search className="h-4 w-4 text-foreground/40"/>
            <input type="text" placeholder="Search jerseys, teams, leagues..." className="flex-1 bg-transparent text-sm text-foreground placeholder:text-foreground/30 focus:outline-none" autoFocus/>
            <button onClick={() => setIsSearchOpen(false)} className="text-foreground/40 transition-colors hover:text-foreground" aria-label="Close search">
              <X className="h-4 w-4"/>
            </button>
          </div>
        </div>)}
    </header>);
}
