import { Truck, Clock, MapPin, IndianRupee } from 'lucide-react';
export default function ShippingInfoPage() {
    return (<div className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
        Delivery
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground">
        Shipping Information
      </h1>
      <p className="mt-6 text-sm leading-relaxed text-foreground/50">
        We partner with India&apos;s leading logistics providers to ensure your
        jersey reaches you quickly and safely.
      </p>

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {[
            {
                icon: Truck,
                title: 'Free Shipping',
                desc: 'Complimentary shipping on all orders above Rs.1,999. Orders below this threshold attract a flat Rs.99 shipping fee.',
            },
            {
                icon: Clock,
                title: 'Delivery Time',
                desc: 'Standard delivery takes 3-7 business days depending on your location. Metro cities typically receive orders within 3-4 days.',
            },
            {
                icon: MapPin,
                title: 'Pan-India Coverage',
                desc: 'We deliver to 27,000+ pin codes across India. Enter your pin code at checkout to verify serviceability.',
            },
            {
                icon: IndianRupee,
                title: 'Cash on Delivery',
                desc: 'COD is available for orders up to Rs.5,000. An additional Rs.49 COD handling fee applies.',
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
          Shipping Rates
        </h2>
        <div className="mt-6 overflow-hidden rounded-md border border-border/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-secondary">
                <th className="px-6 py-4 text-left text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/50">
                  Order Value
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/50">
                  Standard
                </th>
                <th className="px-6 py-4 text-left text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/50">
                  Express
                </th>
              </tr>
            </thead>
            <tbody>
              {[
            { value: 'Below Rs.1,999', standard: 'Rs.99', express: 'Rs.199' },
            { value: 'Rs.1,999 - Rs.3,999', standard: 'FREE', express: 'Rs.149' },
            { value: 'Above Rs.3,999', standard: 'FREE', express: 'FREE' },
        ].map((row, i) => (<tr key={row.value} className={i % 2 === 0 ? 'bg-card' : 'bg-secondary/50'}>
                  <td className="px-6 py-4 text-foreground/50">{row.value}</td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {row.standard}
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">
                    {row.express}
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-14">
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          Order Processing
        </h2>
        <div className="mt-6 flex flex-col gap-4">
          {[
            'Orders placed before 2:00 PM IST are dispatched the same day.',
            'Orders placed after 2:00 PM are dispatched the next business day.',
            'Orders are not dispatched on Sundays and national holidays.',
            'You will receive a tracking link via SMS and email once dispatched.',
        ].map((item) => (<div key={item} className="flex items-start gap-3 text-sm leading-relaxed text-foreground/50">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-primary"/>
              {item}
            </div>))}
        </div>
      </div>
    </div>);
}
