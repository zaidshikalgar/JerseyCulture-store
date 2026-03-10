'use client';
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
export default function ContactPage() {
    const [submitted, setSubmitted] = useState(false);
    const handleSubmit = (e) => {
        e.preventDefault();
        setSubmitted(true);
    };
    return (<div className="mx-auto max-w-5xl px-6 py-20 lg:px-8">
      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
        Get in Touch
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground">
        Contact Us
      </h1>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-foreground/50">
        Have a question about your order, need sizing advice, or just want to
        talk football? We are here to help.
      </p>

      <div className="mt-14 grid gap-12 lg:grid-cols-5">
        {/* Contact form */}
        <div className="lg:col-span-3">
          {submitted ? (<div className="flex flex-col items-center rounded-md border border-primary/20 bg-primary/5 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/30">
                <Mail className="h-6 w-6 text-primary"/>
              </div>
              <h2 className="mt-6 font-serif text-2xl font-semibold text-foreground">
                Message Sent
              </h2>
              <p className="mt-2 text-[12px] text-foreground/40">
                We will get back to you within 24 hours.
              </p>
              <Button onClick={() => setSubmitted(false)} variant="outline" className="mt-8 border-border/50 text-[11px] font-medium uppercase tracking-[0.15em] text-foreground/60 hover:text-foreground">
                Send Another
              </Button>
            </div>) : (<form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/40">
                    Name
                  </label>
                  <input type="text" required className="mt-2 w-full rounded-md border border-border/50 bg-card px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Your name"/>
                </div>
                <div>
                  <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/40">
                    Email
                  </label>
                  <input type="email" required className="mt-2 w-full rounded-md border border-border/50 bg-card px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:ring-1 focus:ring-primary" placeholder="you@example.com"/>
                </div>
              </div>
              <div>
                <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/40">
                  Subject
                </label>
                <input type="text" required className="mt-2 w-full rounded-md border border-border/50 bg-card px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:ring-1 focus:ring-primary" placeholder="How can we help?"/>
              </div>
              <div>
                <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/40">
                  Message
                </label>
                <textarea required rows={5} className="mt-2 w-full resize-none rounded-md border border-border/50 bg-card px-4 py-3 text-sm text-foreground placeholder:text-foreground/25 focus:outline-none focus:ring-1 focus:ring-primary" placeholder="Tell us more..."/>
              </div>
              <Button type="submit" className="h-12 bg-primary text-[11px] font-medium uppercase tracking-[0.15em] text-primary-foreground hover:bg-primary/90">
                Send Message
              </Button>
            </form>)}
        </div>

        {/* Contact info */}
        <div className="flex flex-col gap-8 lg:col-span-2">
          {[
            {
                icon: Mail,
                title: 'Email',
                lines: ['support@jerseyculture.in', 'orders@jerseyculture.in'],
            },
            {
                icon: Phone,
                title: 'Phone',
                lines: ['+91 80-4567-8900', 'Mon - Sat, 10 AM - 7 PM IST'],
            },
            {
                icon: MapPin,
                title: 'Office',
                lines: [
                    'JerseyCulture',
                    '4th Floor, Brigade Gateway',
                    'Rajajinagar, Bangalore 560010',
                ],
            },
            {
                icon: Clock,
                title: 'Support Hours',
                lines: [
                    'Monday - Saturday: 10 AM - 7 PM',
                    'Sunday: 11 AM - 4 PM',
                ],
            },
        ].map((item) => (<div key={item.title} className="rounded-md border border-border/50 bg-card p-5">
              <div className="flex items-center gap-3">
                <item.icon className="h-4 w-4 text-primary"/>
                <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/50">
                  {item.title}
                </h3>
              </div>
              <div className="mt-3 flex flex-col gap-1">
                {item.lines.map((line) => (<p key={line} className="text-[12px] leading-relaxed text-foreground/40">
                    {line}
                  </p>))}
              </div>
            </div>))}
        </div>
      </div>
    </div>);
}
