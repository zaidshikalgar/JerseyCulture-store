import Link from 'next/link';
import { Truck, Shield, RefreshCw, Headphones } from 'lucide-react';
const footerLinks = {
    Shop: [
        { label: 'Club Kits', href: '/shop?category=club' },
        { label: 'National Teams', href: '/shop?category=national' },
        { label: 'Retro Collection', href: '/shop?category=retro' },
        { label: 'New Arrivals', href: '/shop' },
        { label: 'Best Sellers', href: '/shop' },
    ],
    Support: [
        { label: 'Size Guide', href: '/size-guide' },
        { label: 'Shipping Info', href: '/shipping' },
        { label: 'Returns & Exchange', href: '/returns' },
        { label: 'Track Order', href: '/track-order' },
        { label: 'Contact Us', href: '/contact' },
    ],
    Company: [
        { label: 'About Us', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Careers', href: '/careers' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
    ],
};

const trustBadges = [
    { icon: Truck, label: 'Free Shipping', sub: 'Orders above Rs.1,999' },
    { icon: Shield, label: '100% Authentic', sub: 'Guaranteed original' },
    { icon: RefreshCw, label: 'Easy Returns', sub: '7-day return policy' },
    { icon: Headphones, label: '24/7 Support', sub: 'We are here to help' },
];

export function Footer() {
    return (<footer className="border-t border-border/50 bg-card">
      {/* Trust badges */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-14 lg:grid-cols-4 lg:px-8">
        {trustBadges.map((badge) => (<div key={badge.label} className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border/50">
              <badge.icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-[14px] font-medium text-foreground">
                {badge.label}
              </p>
              <p className="text-[12px] text-foreground/40">{badge.sub}</p>
            </div>
          </div>))}
      </div>

      <div className="border-t border-border/50">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-4">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="font-serif text-xl font-semibold tracking-[0.15em] text-foreground">
                JERSEY<span className="text-primary">CULTURE</span>
              </Link>
              <p className="mt-5 text-[13px] leading-relaxed text-foreground/40">
                India&apos;s premier destination for authentic football jerseys.
                From club legends to national pride, wear what you love.
              </p>
              <div className="mt-8">
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-foreground/40">
                  Newsletter
                </p>
                <div className="mt-3 flex gap-2">
                  <input type="email" placeholder="Your email" className="flex-1 rounded-md border border-border/50 bg-background px-4 py-2.5 text-[12px] text-foreground placeholder:text-foreground/25 focus:outline-none focus:ring-1 focus:ring-primary"/>
                  <button className="rounded-md bg-primary px-5 py-2.5 text-[11px] font-medium uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90">
                    Join
                  </button>
                </div>
              </div>
            </div>

            {/* Link columns */}
            {Object.entries(footerLinks).map(([title, links]) => (<div key={title}>
                <h3 className="text-[11px] font-medium uppercase tracking-[0.25em] text-foreground/50">
                  {title}
                </h3>
                <ul className="mt-5 flex flex-col gap-3">
                  {links.map((link) => (<li key={link.label}>
                      <Link href={link.href} className="text-[13px] text-foreground/40 transition-colors hover:text-primary">
                        {link.label}
                      </Link>
                    </li>))}
                </ul>
              </div>))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 lg:flex-row lg:px-8">
          <p className="text-[12px] text-foreground/30">
            2025 JerseyCulture. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {['VISA', 'UPI', 'COD', 'PAYTM'].map((method) => (<span key={method} className="rounded border border-border/50 px-2.5 py-1 text-[10px] font-medium tracking-wider text-foreground/30">
                {method}
              </span>))}
          </div>
        </div>
      </div>
    </footer>);
}
