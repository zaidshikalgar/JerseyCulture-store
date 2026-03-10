import { Shirt, Users, Globe, Trophy } from 'lucide-react';
export default function AboutPage() {
    return (<div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
        Our Story
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground">
        About JerseyCulture
      </h1>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-foreground/50">
        Born from a deep love for the beautiful game, JerseyCulture is
        India&apos;s premier destination for authentic football jerseys. We
        believe every jersey tells a story -- of a match, a moment, a memory
        that stays with you forever.
      </p>

      <div className="mt-16 grid gap-12 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Our Mission
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-foreground/40">
            We set out to make premium, authentic football jerseys accessible to
            every fan in India. No more settling for poor replicas or paying
            inflated prices. Every jersey we sell is sourced directly through
            verified channels, ensuring quality that matches the passion of
            the fans who wear them.
          </p>
        </div>
        <div>
          <h2 className="font-serif text-2xl font-semibold text-foreground">
            Why Choose Us
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-foreground/40">
            With over 5,000 happy customers across India, we have built a
            reputation for authenticity, speed, and customer care. Every order is
            hand-checked for quality, carefully packaged, and shipped with
            tracking so your jersey arrives in perfect condition.
          </p>
        </div>
      </div>

      <div className="mt-20 grid grid-cols-2 gap-8 md:grid-cols-4">
        {[
            { icon: Shirt, label: '8,000+', sub: 'Jerseys Sold' },
            { icon: Users, label: '5,000+', sub: 'Happy Customers' },
            { icon: Globe, label: '500+', sub: 'Cities Delivered' },
            { icon: Trophy, label: '100+', sub: 'Teams Available' },
        ].map((stat) => (<div key={stat.label} className="flex flex-col items-center rounded-md border border-border/50 bg-card p-8 text-center">
            <stat.icon className="h-5 w-5 text-primary"/>
            <p className="mt-4 font-serif text-2xl font-semibold text-foreground">
              {stat.label}
            </p>
            <p className="mt-1 text-[11px] text-foreground/40">{stat.sub}</p>
          </div>))}
      </div>

      <div className="mt-20 rounded-md border border-border/50 bg-card p-10">
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          Our Promise
        </h2>
        <ul className="mt-6 flex flex-col gap-4">
          {[
            '100% authentic jerseys -- always verified, never counterfeit.',
            'Free shipping on every order above Rs.1,999.',
            '7-day hassle-free returns and exchanges.',
            'Secure payments via UPI, cards, and Cash on Delivery.',
            'Dedicated customer support team, 7 days a week.',
        ].map((item) => (<li key={item} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/50">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary"/>
              {item}
            </li>))}
        </ul>
      </div>
    </div>);
}
