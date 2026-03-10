'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { BarChart3, Package, ShieldCheck, Users } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

export function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();

  const isAdmin = useMemo(() => user?.role === 'admin', [user?.role]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center lg:px-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
          Admin access only
        </h1>
        <p className="mt-3 text-sm text-foreground/50">
          Sign in with an admin account to open the dashboard.
        </p>
        <Button
          asChild
          className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Link href="/auth/login">Go to Sign In</Link>
        </Button>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center lg:px-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
          You do not have access
        </h1>
        <p className="mt-3 text-sm text-foreground/50">
          This area is restricted to admin users. If you think this is a mistake,
          please contact support.
        </p>
        <Button
          asChild
          variant="outline"
          className="mt-8 border-border/60 text-foreground/70 hover:text-foreground"
        >
          <Link href="/">Back to homepage</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
            Admin
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Dashboard
          </h1>
          <p className="mt-2 text-sm text-foreground/50">
            High-level overview of store performance and management shortcuts.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary">
            <ShieldCheck className="mr-1.5 h-3.5 w-3.5" />
            Signed in as Admin
          </span>
        </div>
      </div>

      {/* Summary cards */}
      <section className="grid gap-5 md:grid-cols-3">
        <div className="rounded-lg border border-border/40 bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/45">
                Today&apos;s Orders
              </p>
              <p className="mt-3 font-serif text-2xl font-semibold text-foreground">
                24
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-[11px] text-foreground/45">
            Demo data — connect to your backend to show live numbers.
          </p>
        </div>

        <div className="rounded-lg border border-border/40 bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/45">
                Revenue (Today)
              </p>
              <p className="mt-3 font-serif text-2xl font-semibold text-foreground">
                Rs. 78,500
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <BarChart3 className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-[11px] text-foreground/45">
            Placeholder metric for design — wire this to analytics later.
          </p>
        </div>

        <div className="rounded-lg border border-border/40 bg-card p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-foreground/45">
                Active Customers
              </p>
              <p className="mt-3 font-serif text-2xl font-semibold text-foreground">
                312
              </p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-3 text-[11px] text-foreground/45">
            Representing users with at least one order in the last 90 days.
          </p>
        </div>
      </section>

      {/* Management shortcuts */}
      <section className="mt-8 grid gap-5 md:grid-cols-3">
        <div className="rounded-lg border border-border/40 bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">
            Orders
          </h2>
          <p className="mt-2 text-[12px] text-foreground/50">
            Review new orders, update statuses and handle returns.
          </p>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="mt-4 border-border/60 text-[11px] uppercase tracking-[0.14em]"
          >
            <Link href="/admin/orders">
              Open Orders
            </Link>
          </Button>
        </div>

        <div className="rounded-lg border border-border/40 bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">
            Products
          </h2>
          <p className="mt-2 text-[12px] text-foreground/50">
            Manage jersey catalog, pricing and availability.
          </p>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="mt-4 border-border/60 text-[11px] uppercase tracking-[0.14em]"
          >
            <Link href="/admin/products">
              Manage Products
            </Link>
          </Button>
        </div>

        <div className="rounded-lg border border-border/40 bg-card p-5">
          <h2 className="text-sm font-semibold text-foreground">
            Customers
          </h2>
          <p className="mt-2 text-[12px] text-foreground/50">
            View customer list and basic contact details.
          </p>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="mt-4 border-border/60 text-[11px] uppercase tracking-[0.14em]"
          >
            <Link href="/admin/customers">
              View Customers
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}

