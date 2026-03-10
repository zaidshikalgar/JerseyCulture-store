export default function TermsPage() {
    const sections = [
        {
            title: 'Acceptance of Terms',
            content: 'By accessing or using jerseyculture.in, you agree to be bound by these Terms of Service. If you do not agree, you may not use our services. We reserve the right to modify these terms at any time.',
        },
        {
            title: 'Products and Pricing',
            content: 'All products listed on our website are subject to availability. Prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise. We reserve the right to change prices without prior notice. Errors in pricing will be corrected upon discovery.',
        },
        {
            title: 'Orders and Payment',
            content: 'Placing an order constitutes an offer to purchase. We reserve the right to accept or decline any order. Payment must be made at the time of purchase unless Cash on Delivery is selected. We accept UPI, credit/debit cards, net banking, and COD.',
        },
        {
            title: 'Shipping and Delivery',
            content: 'We aim to dispatch all orders within 1-2 business days. Delivery times vary by location (typically 3-7 business days across India). We are not liable for delays caused by shipping carriers or unforeseen circumstances.',
        },
        {
            title: 'Returns and Refunds',
            content: 'We accept returns within 7 days of delivery for unused, unworn items in original packaging. Custom or personalized jerseys are non-returnable. Refunds are processed within 5-7 business days after we receive the returned item.',
        },
        {
            title: 'Intellectual Property',
            content: 'All content on this website, including text, images, logos, and design, is the property of JerseyCulture and is protected by Indian and international copyright laws. Unauthorized use is prohibited.',
        },
        {
            title: 'User Accounts',
            content: 'You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information when creating an account. We reserve the right to suspend or terminate accounts that violate these terms.',
        },
        {
            title: 'Limitation of Liability',
            content: 'JerseyCulture shall not be liable for any indirect, incidental, or consequential damages arising from the use of our website or products. Our total liability is limited to the purchase price of the product in question.',
        },
        {
            title: 'Governing Law',
            content: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Bangalore, Karnataka.',
        },
    ];
    return (<div className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
        Legal
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground">
        Terms of Service
      </h1>
      <p className="mt-4 text-[12px] text-foreground/30">
        Last updated: February 1, 2026
      </p>
      <p className="mt-6 text-sm leading-relaxed text-foreground/50">
        Please read these Terms of Service carefully before using
        jerseyculture.in. These terms govern your use of our website and
        services.
      </p>

      <div className="mt-14 flex flex-col gap-10">
        {sections.map((section, i) => (<section key={section.title}>
            <h2 className="flex items-baseline gap-3 font-serif text-xl font-semibold text-foreground">
              <span className="text-[11px] text-foreground/20">
                {String(i + 1).padStart(2, '0')}
              </span>
              {section.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-foreground/40">
              {section.content}
            </p>
          </section>))}
      </div>

      <div className="mt-14 rounded-md border border-border/50 bg-card p-8">
        <p className="text-[12px] leading-relaxed text-foreground/40">
          For questions regarding these terms, contact{' '}
          <span className="text-primary">legal@jerseyculture.in</span>.
        </p>
      </div>
    </div>);
}
