export default function PrivacyPolicyPage() {
    const sections = [
        {
            title: 'Information We Collect',
            content: 'We collect personal information you provide when creating an account, placing an order, or contacting us. This includes your name, email address, phone number, shipping address, and payment details. We also automatically collect device information, IP addresses, and browsing data through cookies.',
        },
        {
            title: 'How We Use Your Information',
            content: 'We use your information to process and deliver orders, communicate about your purchases, send promotional offers (with your consent), improve our website experience, prevent fraud, and comply with legal obligations.',
        },
        {
            title: 'Information Sharing',
            content: 'We do not sell your personal information. We share data only with: shipping partners (to deliver your orders), payment processors (to complete transactions), and analytics providers (to improve our service). All partners are bound by confidentiality agreements.',
        },
        {
            title: 'Data Security',
            content: 'We implement industry-standard security measures including SSL encryption, secure payment gateways, and restricted access controls. While no system is completely secure, we take every reasonable precaution to protect your data.',
        },
        {
            title: 'Cookies',
            content: 'We use cookies and similar technologies to remember your preferences, keep items in your cart, analyze site traffic, and personalize your experience. You can manage cookie preferences through your browser settings.',
        },
        {
            title: 'Your Rights',
            content: 'You may request access to, correction of, or deletion of your personal data at any time. You can also opt out of marketing communications. To exercise these rights, contact us at privacy@jerseyculture.in.',
        },
        {
            title: 'Data Retention',
            content: 'We retain your personal information for as long as your account is active or as needed to provide services. Order records are kept for 5 years for legal and accounting purposes.',
        },
        {
            title: 'Changes to This Policy',
            content: 'We may update this policy from time to time. We will notify you of significant changes via email or a notice on our website. Continued use of our services constitutes acceptance of the updated policy.',
        },
    ];
    return (<div className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
        Legal
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground">
        Privacy Policy
      </h1>
      <p className="mt-4 text-[12px] text-foreground/30">
        Last updated: February 1, 2026
      </p>
      <p className="mt-6 text-sm leading-relaxed text-foreground/50">
        At JerseyCulture, we respect your privacy and are committed to
        protecting your personal data. This policy explains how we collect,
        use, and safeguard your information.
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
          For any questions about this privacy policy, contact us at{' '}
          <span className="text-primary">privacy@jerseyculture.in</span> or
          write to: JerseyCulture, 4th Floor, Brigade Gateway, Rajajinagar,
          Bangalore 560010, India.
        </p>
      </div>
    </div>);
}
