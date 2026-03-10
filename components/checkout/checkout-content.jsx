'use client';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CreditCard, Smartphone, Banknote, Check, Shield, Lock, Loader2, } from 'lucide-react';
import { useCart } from '@/lib/cart-context';
import { useAuth } from '@/lib/auth-context';
import { apiRequest } from '@/lib/api';
import { Button } from '@/components/ui/button';
const paymentMethods = [
    { id: 'upi', label: 'UPI', icon: Smartphone, sub: 'GPay, PhonePe, Paytm' },
    { id: 'card', label: 'Credit / Debit Card', icon: CreditCard, sub: 'Visa, Mastercard, RuPay' },
    { id: 'cod', label: 'Cash on Delivery', icon: Banknote, sub: 'Pay when delivered' },
];
const CASHFREE_MODE = (process.env.NEXT_PUBLIC_CASHFREE_ENV || 'sandbox').toLowerCase() === 'production'
    ? 'production'
    : 'sandbox';
const CASHFREE_SDK_URL = 'https://sdk.cashfree.com/js/v3/cashfree.js';
let cashfreeInstancePromise = null;
function loadCashfreeInstance() {
    if (typeof window === 'undefined') {
        return Promise.reject(new Error('Cashfree SDK can only run in browser'));
    }
    if (cashfreeInstancePromise) {
        return cashfreeInstancePromise;
    }
    cashfreeInstancePromise = new Promise((resolve, reject) => {
        if (window.Cashfree) {
            resolve(window.Cashfree({ mode: CASHFREE_MODE }));
            return;
        }
        const existingScript = document.querySelector(`script[src="${CASHFREE_SDK_URL}"]`);
        const onLoad = () => {
            if (!window.Cashfree) {
                reject(new Error('Cashfree SDK did not initialize correctly'));
                return;
            }
            resolve(window.Cashfree({ mode: CASHFREE_MODE }));
        };
        const onError = () => reject(new Error('Failed to load Cashfree SDK'));
        if (existingScript) {
            existingScript.addEventListener('load', onLoad, { once: true });
            existingScript.addEventListener('error', onError, { once: true });
            return;
        }
        const script = document.createElement('script');
        script.src = CASHFREE_SDK_URL;
        script.async = true;
        script.onload = onLoad;
        script.onerror = onError;
        document.body.appendChild(script);
    });
    return cashfreeInstancePromise;
}
const inputClass = 'w-full rounded-md border border-border/40 bg-secondary px-4 py-3.5 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:ring-1 focus:ring-primary transition-colors';
const steps = ['Cart', 'Information', 'Payment'];
export function CheckoutContent() {
    const { items, totalPrice, clearCart } = useCart();
    const { token, user } = useAuth();
    const router = useRouter();
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [step, setStep] = useState(0);
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [line1, setLine1] = useState('');
    const [line2, setLine2] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const shipping = totalPrice >= 1999 ? 0 : 149;
    const total = totalPrice + shipping;
    const isAdmin = user?.role === 'admin';
    const isLoggedIn = Boolean(token);
    useEffect(() => {
        if (step === 1 && paymentMethod !== 'cod') {
            loadCashfreeInstance().catch(() => { });
        }
    }, [step, paymentMethod]);
    const hasRequiredInfo = useMemo(() => {
        return (fullName.trim().length > 1 &&
            email.includes('@') &&
            line1.trim().length > 3 &&
            city.trim().length > 1 &&
            state.trim().length > 1 &&
            postalCode.trim().length > 3);
    }, [fullName, email, line1, city, state, postalCode]);
    if (items.length === 0) {
        return (<div className="mx-auto flex max-w-7xl flex-col items-center justify-center px-6 py-32 text-center">
        <h1 className="font-serif text-2xl font-semibold text-foreground">
          Nothing to checkout
        </h1>
        <p className="mt-2 text-sm text-foreground/40">
          Add some jerseys to your cart first.
        </p>
        <Button asChild className="mt-8 h-12 bg-primary px-10 text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-foreground hover:bg-primary/90">
          <Link href="/shop">Browse Jerseys</Link>
        </Button>
      </div>);
    }
    async function handlePlaceOrder() {
        if (!hasRequiredInfo) {
            setErrorMessage('Please complete contact and shipping details before placing the order.');
            setStep(0);
            return;
        }
        if (isAdmin) {
            setErrorMessage('Admin accounts cannot place orders.');
            return;
        }
        setErrorMessage(null);
        setIsPlacingOrder(true);
        const payload = {
            items: items.map((item) => ({
                productId: item.product.id,
                name: item.product.name,
                image: item.product.image,
                size: item.size,
                quantity: item.quantity,
                price: item.product.price,
            })),
            customer: {
                name: fullName,
                email,
                phone,
            },
            shippingAddress: {
                line1,
                line2,
                city,
                state,
                postalCode,
                country: 'India',
            },
            paymentMethod,
            shippingFee: shipping,
        };
        try {
            if (paymentMethod === 'cod') {
                const order = await apiRequest('/orders', {
                    method: 'POST',
                    body: JSON.stringify(payload),
                }, token || undefined);
                clearCart();
                router.push(`/order-confirmation?orderNumber=${encodeURIComponent(order.orderNumber)}&email=${encodeURIComponent(email)}`);
                return;
            }
            const session = await apiRequest('/orders/cashfree/session', {
                method: 'POST',
                body: JSON.stringify(payload),
            }, token || undefined);
            const cashfree = await loadCashfreeInstance();
            await cashfree.checkout({
                paymentSessionId: session.paymentSessionId,
                redirectTarget: '_modal',
            });
            const verification = await apiRequest(`/orders/cashfree/verify/${encodeURIComponent(session.orderNumber)}`, {
                method: 'POST',
                body: JSON.stringify({ email }),
            }, token || undefined);
            if (!verification?.paid) {
                throw new Error('Payment was not completed. Please try again.');
            }
            clearCart();
            router.push(`/order-confirmation?orderNumber=${encodeURIComponent(session.orderNumber)}&email=${encodeURIComponent(email)}`);
        }
        catch (error) {
            setErrorMessage(error instanceof Error
                ? error.message
                : 'Could not complete payment. Please try again.');
        }
        finally {
            setIsPlacingOrder(false);
        }
    }
    return (<div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
      <div className="mb-8 flex items-center gap-2 text-[11px] text-foreground/30">
        <Link href="/" className="transition-colors hover:text-foreground/60">Home</Link>
        <span>/</span>
        <Link href="/cart" className="transition-colors hover:text-foreground/60">Cart</Link>
        <span>/</span>
        <span className="text-foreground/60">Checkout</span>
      </div>

      <div className="mb-12 flex items-center justify-center gap-0">
        {steps.map((label, i) => (<div key={label} className="flex items-center">
            <button onClick={() => {
                if (i === 0)
                    router.push('/cart');
                else if (i <= step + 1)
                    setStep(i);
            }} className="flex items-center gap-2">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full text-[11px] font-semibold transition-colors ${i <= step
                ? 'bg-primary text-primary-foreground'
                : 'border border-border/50 text-foreground/30'}`}>
                {i < step ? <Check className="h-3.5 w-3.5"/> : i + 1}
              </span>
              <span className={`text-[11px] font-medium uppercase tracking-[0.1em] transition-colors ${i <= step ? 'text-foreground' : 'text-foreground/30'}`}>
                {label}
              </span>
            </button>
            {i < steps.length - 1 && (<div className={`mx-4 h-px w-12 transition-colors md:w-20 ${i < step ? 'bg-primary' : 'bg-border/40'}`}/>)}
          </div>))}
      </div>

      <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {step === 0 && (<>
              <div className="rounded-lg border border-border/30 bg-card p-6">
                <h2 className="mb-1 text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
                  Contact Information
                </h2>
                <p className="mb-5 text-[11px] text-foreground/30">
                  We will use this info to send you order updates.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/40">
                      Full Name
                    </label>
                    <input type="text" placeholder="Your Full Name" className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)}/>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/40">
                      Email
                    </label>
                    <input type="email" placeholder="Your Email Address" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)}/>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/40">
                      Phone Number
                    </label>
                    <input type="tel" placeholder="+91 00000-00000" className={inputClass} value={phone} onChange={(e) => setPhone(e.target.value)}/>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-border/30 bg-card p-6">
                <h2 className="mb-1 text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
                  Shipping Address
                </h2>
                <p className="mb-5 text-[11px] text-foreground/30">
                  Where should we deliver your order?
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/40">
                      Address Line 1
                    </label>
                    <input type="text" placeholder="Flat, house no., building" className={inputClass} value={line1} onChange={(e) => setLine1(e.target.value)}/>
                  </div>
                  <div className="md:col-span-2">
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/40">
                      Address Line 2
                    </label>
                    <input type="text" placeholder="Area, street, sector (optional)" className={inputClass} value={line2} onChange={(e) => setLine2(e.target.value)}/>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/40">
                      City
                    </label>
                    <input type="text" placeholder="Your City" className={inputClass} value={city} onChange={(e) => setCity(e.target.value)}/>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/40">
                      State
                    </label>
                    <input type="text" placeholder="Your State" className={inputClass} value={state} onChange={(e) => setState(e.target.value)}/>
                  </div>
                  <div>
                    <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.1em] text-foreground/40">
                      PIN Code
                    </label>
                    <input type="text" placeholder="Your PIN Code" className={inputClass} value={postalCode} onChange={(e) => setPostalCode(e.target.value)}/>
                  </div>
                </div>
              </div>

              <Button size="lg" className="h-12 w-full bg-primary text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-foreground hover:bg-primary/90 md:w-auto md:self-end md:px-12" onClick={() => {
                if (!hasRequiredInfo) {
                    setErrorMessage('Please complete all required contact and shipping fields.');
                    return;
                }
                setErrorMessage(null);
                setStep(1);
            }}>
                Continue to Payment
              </Button>
            </>)}

          {step === 1 && (<>
              <button onClick={() => setStep(0)} className="inline-flex items-center gap-2 self-start text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/40 transition-colors hover:text-primary">
                <ArrowLeft className="h-3.5 w-3.5"/>
                Back to Information
              </button>

              <div className="rounded-lg border border-border/30 bg-card p-6">
                <h2 className="mb-1 text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
                  Payment Method
                </h2>
                <p className="mb-5 text-[11px] text-foreground/30">
                  All transactions are encrypted and secure.
                </p>

                <div className="flex flex-col gap-3">
                  {paymentMethods.map((method) => (<button key={method.id} onClick={() => setPaymentMethod(method.id)} className={`flex items-center gap-4 rounded-lg border p-4 text-left transition-all duration-200 ${paymentMethod === method.id
                    ? 'border-primary/60 bg-primary/5'
                    : 'border-border/30 hover:border-border/60'}`}>
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${paymentMethod === method.id
                    ? 'border-primary/40 bg-primary/10'
                    : 'border-border/30 bg-secondary'}`}>
                        <method.icon className={`h-4 w-4 ${paymentMethod === method.id
                    ? 'text-primary'
                    : 'text-foreground/30'}`}/>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {method.label}
                        </p>
                        <p className="mt-0.5 text-[11px] text-foreground/30">
                          {method.sub}
                        </p>
                      </div>
                      <div className={`h-4 w-4 rounded-full border-2 transition-colors ${paymentMethod === method.id
                    ? 'border-primary bg-primary'
                    : 'border-foreground/20'}`}>
                        {paymentMethod === method.id && (<Check className="h-full w-full p-0.5 text-primary-foreground"/>)}
                      </div>
                    </button>))}
                </div>

                {paymentMethod !== 'cod' && (<div className="mt-5 rounded-lg border border-border/20 bg-background p-5 text-[12px] text-foreground/50">
                    You will securely enter your {paymentMethod === 'upi' ? 'UPI details' : 'card details'} in the Cashfree popup after clicking pay.
                  </div>)}
              </div>

              {isAdmin && (<p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[12px] text-amber-300">
                  Admin accounts are restricted from placing orders.
                </p>)}

              {!isLoggedIn && (<p className="rounded-md border border-primary/30 bg-primary/10 px-3 py-2 text-[12px] text-primary">
                  Please <Link href="/auth/login" className="font-medium underline underline-offset-2">log in</Link> to place an order.
                </p>)}

              {errorMessage && (<p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-[12px] text-destructive">
                  {errorMessage}
                </p>)}

              <Button size="lg" disabled={isPlacingOrder || isAdmin} className="h-12 w-full gap-2 bg-primary text-[11px] font-semibold uppercase tracking-[0.15em] text-primary-foreground hover:bg-primary/90 md:w-auto md:self-end md:px-12 disabled:opacity-60" onClick={handlePlaceOrder}>
                {isPlacingOrder ? (<span className="flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin"/>
                    Placing Order...
                  </span>) : (<>
                    <Lock className="h-3.5 w-3.5"/>
                    Place Order . Rs.{total.toLocaleString('en-IN')}
                  </>)}
              </Button>
            </>)}
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-36 rounded-lg border border-border/30 bg-card p-6">
            <h2 className="text-[10px] font-medium uppercase tracking-[0.25em] text-foreground/40">
              Your Order ({items.reduce((s, i) => s + i.quantity, 0)} items)
            </h2>

            <div className="mt-5 flex max-h-64 flex-col gap-3 overflow-y-auto pr-1">
              {items.map((item) => (<div key={`${item.product.id}-${item.size}`} className="flex items-center gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-secondary">
                    <Image src={item.product.image} alt={item.product.name} fill className="object-cover" sizes="56px"/>
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-[12px] font-medium text-foreground">
                      {item.product.name}
                    </p>
                    <p className="text-[10px] text-foreground/30">
                      Size {item.size}
                    </p>
                  </div>
                  <p className="shrink-0 text-[12px] font-medium text-foreground">
                    {'Rs.'}
                    {(item.product.price * item.quantity).toLocaleString('en-IN')}
                  </p>
                </div>))}
            </div>

            <div className="my-5 h-px bg-border/30"/>

            <div className="flex flex-col gap-2.5">
              <div className="flex justify-between text-[12px]">
                <span className="text-foreground/40">Subtotal</span>
                <span className="text-foreground">Rs.{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-[12px]">
                <span className="text-foreground/40">Shipping</span>
                <span className="text-foreground">
                  {shipping === 0 ? <span className="text-green-500">FREE</span> : `Rs.${shipping}`}
                </span>
              </div>
              <div className="my-2 h-px bg-border/30"/>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground/60">Total</span>
                <span className="font-serif text-2xl font-bold text-primary">
                  Rs.{total.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-center gap-1.5 text-[10px] text-foreground/25">
              <Shield className="h-3 w-3"/>
              Secure, encrypted checkout
            </div>
          </div>
        </div>
      </div>
    </div>);
}
