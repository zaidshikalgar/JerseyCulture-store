import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
const openings = [
    {
        title: 'Frontend Developer',
        type: 'Full-time',
        location: 'Remote / Bangalore',
        description: 'Build and maintain our e-commerce storefront using Next.js and React.',
    },
    {
        title: 'Social Media Manager',
        type: 'Full-time',
        location: 'Mumbai',
        description: 'Own our social media presence across Instagram, Twitter, and YouTube.',
    },
    {
        title: 'Warehouse Operations Lead',
        type: 'Full-time',
        location: 'Delhi NCR',
        description: 'Manage inventory, quality checks, and dispatch for all orders.',
    },
    {
        title: 'Customer Support Specialist',
        type: 'Part-time',
        location: 'Remote',
        description: 'Help our customers with queries on orders, sizing, returns, and more.',
    },
];
export default function CareersPage() {
    return (<div className="mx-auto max-w-4xl px-6 py-20 lg:px-8">
      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
        Join the Team
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground">
        Careers
      </h1>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-foreground/50">
        We are a small, passionate team building India&apos;s most loved
        football jersey brand. If you love football and want to be part of
        something exciting, we would love to hear from you.
      </p>

      <div className="mt-14 rounded-md border border-border/50 bg-card p-8">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.25em] text-foreground/50">
          Why Work With Us
        </h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {[
            'Competitive salary and benefits',
            'Remote-first culture',
            'Annual team retreats',
            'Employee jersey allowance',
            'Flexible working hours',
            'Growth-focused environment',
        ].map((perk) => (<li key={perk} className="flex items-center gap-3 text-sm text-foreground/50">
              <span className="h-1 w-1 shrink-0 rounded-full bg-primary"/>
              {perk}
            </li>))}
        </ul>
      </div>

      <div className="mt-14">
        <h2 className="text-[10px] font-medium uppercase tracking-[0.25em] text-foreground/50">
          Open Positions
        </h2>
        <div className="mt-6 flex flex-col gap-4">
          {openings.map((job) => (<div key={job.title} className="group flex flex-col justify-between gap-4 rounded-md border border-border/50 bg-card p-6 transition-colors hover:border-primary/30 md:flex-row md:items-center">
              <div className="flex-1">
                <h3 className="font-serif text-lg font-semibold text-foreground">
                  {job.title}
                </h3>
                <p className="mt-1 text-[12px] leading-relaxed text-foreground/40">
                  {job.description}
                </p>
                <div className="mt-3 flex gap-3">
                  <span className="text-[10px] text-foreground/30">
                    {job.type}
                  </span>
                  <span className="text-[10px] text-foreground/30">
                    {job.location}
                  </span>
                </div>
              </div>
              <Link href="#" className="inline-flex shrink-0 items-center gap-2 text-[11px] font-medium uppercase tracking-[0.1em] text-primary transition-colors hover:text-primary/80">
                Apply
                <ArrowRight className="h-3 w-3"/>
              </Link>
            </div>))}
        </div>
      </div>

      <div className="mt-14 rounded-md border border-primary/20 bg-primary/5 p-8 text-center">
        <p className="font-serif text-xl font-semibold text-foreground">
          Don&apos;t see a role that fits?
        </p>
        <p className="mt-2 text-[12px] text-foreground/40">
          Send us your resume at{' '}
          <span className="text-primary">careers@jerseyculture.in</span> and
          we&apos;ll keep you in mind.
        </p>
      </div>
    </div>);
}
