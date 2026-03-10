'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { LogOut, Settings, ShieldCheck, User as UserIcon, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';

const inputClass =
  'w-full rounded-md border border-border/50 bg-secondary px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary';

export function AccountOverview() {
  const { user, isAuthenticated, logout, updateProfile } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [line1, setLine1] = useState(user?.address?.line1 || '');
  const [line2, setLine2] = useState(user?.address?.line2 || '');
  const [city, setCity] = useState(user?.address?.city || '');
  const [state, setState] = useState(user?.address?.state || '');
  const [postalCode, setPostalCode] = useState(user?.address?.postalCode || '');
  const [country, setCountry] = useState(user?.address?.country || 'India');

  useEffect(() => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
    setLine1(user?.address?.line1 || '');
    setLine2(user?.address?.line2 || '');
    setCity(user?.address?.city || '');
    setState(user?.address?.state || '');
    setPostalCode(user?.address?.postalCode || '');
    setCountry(user?.address?.country || 'India');
  }, [user]);

  if (!isAuthenticated) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center lg:px-8">
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-foreground">
          Sign in to view your profile
        </h1>
        <p className="mt-3 text-sm text-foreground/50">
          You need to be logged in to access your account dashboard.
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

  const firstName = user?.name ? user.name.split(' ')[0] : 'There';

  async function handleSaveProfile(e) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsSaving(true);

    const result = await updateProfile({
      name,
      phone,
      address: {
        line1,
        line2,
        city,
        state,
        postalCode,
        country,
      },
    });

    setIsSaving(false);
    if (!result.ok) {
      setError(result.message || 'Failed to save profile');
      return;
    }

    setMessage('Profile updated successfully.');
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 lg:px-8">
      <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
            Account
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Hey, {firstName}
          </h1>
          <p className="mt-2 text-sm text-foreground/50">
            Manage your profile, security and orders in one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {user?.role === 'admin' && (
            <Button
              asChild
              variant="outline"
              className="border-primary/40 bg-primary/5 text-primary hover:bg-primary/10"
            >
              <Link href="/admin">
                <ShieldCheck className="mr-2 h-4 w-4" />
                Admin Dashboard
              </Link>
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            className="text-foreground/60 hover:text-destructive"
            onClick={logout}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr,3fr]">
        <section className="rounded-lg border border-border/40 bg-card p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <UserIcon className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Profile Details
              </h2>
              <p className="text-[11px] text-foreground/45">
                Update your personal and address information.
              </p>
            </div>
          </div>

          {!isAdmin ? (
            <form onSubmit={handleSaveProfile} className="space-y-3">
              <input className={inputClass} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              <input className={inputClass} placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <input className={inputClass} placeholder="Address line 1" value={line1} onChange={(e) => setLine1(e.target.value)} />
              <input className={inputClass} placeholder="Address line 2" value={line2} onChange={(e) => setLine2(e.target.value)} />
              <div className="grid gap-3 sm:grid-cols-2">
                <input className={inputClass} placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                <input className={inputClass} placeholder="State" value={state} onChange={(e) => setState(e.target.value)} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <input className={inputClass} placeholder="Postal code" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
                <input className={inputClass} placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
              </div>

              {error && (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-[12px] text-destructive">
                  {error}
                </p>
              )}
              {message && (
                <p className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-[12px] text-primary">
                  {message}
                </p>
              )}

              <Button type="submit" disabled={isSaving} className="bg-primary text-primary-foreground hover:bg-primary/90">
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </span>
                ) : (
                  'Save Details'
                )}
              </Button>
            </form>
          ) : (
            <dl className="space-y-3 text-sm text-foreground/80">
              <div className="flex justify-between gap-4">
                <dt className="text-foreground/45">Full name</dt>
                <dd className="text-right font-medium">{user?.name || '-'}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-foreground/45">Email</dt>
                <dd className="text-right font-medium break-all">{user?.email || '-'}</dd>
              </div>
            </dl>
          )}
        </section>

        <section className="rounded-lg border border-border/40 bg-card p-6">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-foreground/70">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">
                Account & Security
              </h2>
              <p className="text-[11px] text-foreground/45">
                Quick links to manage your account settings.
              </p>
            </div>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-md border border-border/40 bg-background/40 px-4 py-3">
              <div>
                <p className="font-medium text-foreground">
                  Login & Password
                </p>
                <p className="text-[11px] text-foreground/45">
                  Update your password and keep your account secure.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-border/60 text-[11px] uppercase tracking-[0.12em]"
              >
                <Link href="/auth/login">
                  Manage
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-between rounded-md border border-border/40 bg-background/40 px-4 py-3">
              <div>
                <p className="font-medium text-foreground">
                  Orders & Tracking
                </p>
                <p className="text-[11px] text-foreground/45">
                  View your order history and track deliveries.
                </p>
              </div>
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-border/60 text-[11px] uppercase tracking-[0.12em]"
              >
                <Link href="/my-orders">
                  Open
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
