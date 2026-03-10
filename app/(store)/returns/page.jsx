import { RefreshCw, Clock, ShieldCheck, HelpCircle } from 'lucide-react';
export default function ReturnsPage() {
    return (<div className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
        Hassle-Free
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground">
        {'Returns & Exchange'}
      </h1>
      <p className="mt-6 text-sm leading-relaxed text-foreground/50">
        We want you to love your jersey. If something is not right, our return
        and exchange process is simple and stress-free.
      </p>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {[
            {
                icon: RefreshCw,
                title: '7-Day Returns',
                desc: 'Request a return within 7 days of delivery. Items must be unused, unwashed, and in original packaging with all tags attached.',
            },
            {
                icon: Clock,
                title: 'Quick Refunds',
                desc: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item.',
            },
            {
                icon: ShieldCheck,
                title: 'Free Exchanges',
                desc: 'Wrong size? Exchange for free. We will ship the new size as soon as we receive the original item.',
            },
            {
                icon: HelpCircle,
                title: 'Easy Process',
                desc: 'Simply email us or fill out the return form. We will arrange a pickup from your doorstep at no extra cost.',
            },
        ].map((item) => (<div key={item.title} className="rounded-md border border-border/50 bg-card p-6">
            <item.icon className="h-5 w-5 text-primary"/>
            <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">
              {item.title}
            </h3>
            <p className="mt-2 text-[12px] leading-relaxed text-foreground/40">
              {item.desc}
            </p>
          </div>))}
      </div>

      <div className="mt-14">
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          How It Works
        </h2>
        <div className="mt-6 flex flex-col gap-6">
          {[
            {
                step: '01',
                title: 'Initiate Request',
                desc: 'Email returns@jerseyculture.in with your order number and reason for return or exchange.',
            },
            {
                step: '02',
                title: 'Get Approved',
                desc: 'Our team will review your request and send a confirmation within 24 hours.',
            },
            {
                step: '03',
                title: 'Schedule Pickup',
                desc: 'We will arrange a free pickup from your address. Pack the item in its original packaging.',
            },
            {
                step: '04',
                title: 'Receive Refund or Exchange',
                desc: 'Once inspected, your refund will be processed or the replacement will be shipped.',
            },
        ].map((item) => (<div key={item.step} className="flex gap-5 rounded-md border border-border/50 bg-card p-6">
              <span className="font-serif text-2xl font-semibold text-primary/30">
                {item.step}
              </span>
              <div>
                <h3 className="text-sm font-medium text-foreground">
                  {item.title}
                </h3>
                <p className="mt-1 text-[12px] leading-relaxed text-foreground/40">
                  {item.desc}
                </p>
              </div>
            </div>))}
        </div>
      </div>

      <div className="mt-14">
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          Non-Returnable Items
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {[
            'Custom or personalized jerseys with name/number printing.',
            'Items that have been worn, washed, or altered.',
            'Items returned without original tags and packaging.',
            'Items returned after the 7-day window.',
        ].map((item) => (<li key={item} className="flex items-start gap-3 text-sm text-foreground/40">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-destructive"/>
              {item}
            </li>))}
        </ul>
      </div>
    </div>);
}
