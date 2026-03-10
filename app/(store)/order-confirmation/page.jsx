'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
export default function OrderConfirmationPage() {
    const [orderNumber, setOrderNumber] = useState('');
    const [email, setEmail] = useState('');
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const numberFromQuery = params.get('orderNumber');
        const emailFromQuery = params.get('email');
        if (numberFromQuery) {
            setOrderNumber(numberFromQuery);
        } else {
            setOrderNumber(`JC-${Date.now().toString(36).toUpperCase()}`);
        }
        if (emailFromQuery) {
            setEmail(emailFromQuery);
        }
    }, []);
    return (<div className="mx-auto flex max-w-md flex-col items-center justify-center px-6 py-32 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-primary/30">
        <CheckCircle className="h-8 w-8 text-primary"/>
      </div>
      <h1 className="mt-8 font-serif text-3xl font-semibold tracking-tight text-foreground">
        Order Placed
      </h1>
      <p className="mt-3 text-[12px] leading-relaxed text-foreground/40">
        Thank you for your order. You will receive a confirmation email
        shortly with your tracking details.
      </p>
      <div className="mt-8 rounded-md border border-border/50 bg-secondary px-8 py-4">
        <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-foreground/40">Order ID</p>
        <p className="mt-1 font-serif text-lg font-semibold tracking-wider text-foreground">
          {orderNumber || 'JC-PENDING'}
        </p>
      </div>
      <div className="mt-10 flex gap-4">
        <Button asChild className="h-11 bg-primary px-6 text-[11px] font-medium uppercase tracking-[0.15em] text-primary-foreground hover:bg-primary/90">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
        <Button asChild variant="outline" className="h-11 border-border/50 px-6 text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/60 hover:text-foreground">
          <Link href={`/track-order?orderNumber=${encodeURIComponent(orderNumber)}${email ? `&email=${encodeURIComponent(email)}` : ''}`}>
            Track Order
          </Link>
        </Button>
      </div>
    </div>);
}
