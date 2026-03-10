export default function SizeGuidePage() {
    const sizes = [
        { size: 'XS', chest: '34-36', length: '26', shoulder: '16' },
        { size: 'S', chest: '36-38', length: '27', shoulder: '17' },
        { size: 'M', chest: '38-40', length: '28', shoulder: '18' },
        { size: 'L', chest: '40-42', length: '29', shoulder: '19' },
        { size: 'XL', chest: '42-44', length: '30', shoulder: '20' },
        { size: 'XXL', chest: '44-46', length: '31', shoulder: '21' },
    ];
    return (<div className="mx-auto max-w-3xl px-6 py-20 lg:px-8">
      <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-primary">
        Fit Guide
      </p>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-foreground">
        Size Guide
      </h1>
      <p className="mt-6 text-sm leading-relaxed text-foreground/50">
        All measurements are in inches. For the best fit, measure your body and
        compare with the chart below. When between sizes, we recommend going
        one size up for a comfortable fit.
      </p>

      <div className="mt-14 overflow-hidden rounded-md border border-border/50">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-secondary">
              <th className="px-6 py-4 text-left text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/50">
                Size
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/50">
                Chest
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/50">
                Length
              </th>
              <th className="px-6 py-4 text-left text-[10px] font-medium uppercase tracking-[0.2em] text-foreground/50">
                Shoulder
              </th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((row, i) => (<tr key={row.size} className={i % 2 === 0 ? 'bg-card' : 'bg-secondary/50'}>
                <td className="px-6 py-4 font-medium text-foreground">
                  {row.size}
                </td>
                <td className="px-6 py-4 text-foreground/50">{row.chest}</td>
                <td className="px-6 py-4 text-foreground/50">{row.length}</td>
                <td className="px-6 py-4 text-foreground/50">
                  {row.shoulder}
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>

      <div className="mt-14">
        <h2 className="font-serif text-2xl font-semibold text-foreground">
          How to Measure
        </h2>
        <div className="mt-6 flex flex-col gap-6">
          {[
            {
                label: 'Chest',
                desc: 'Measure around the fullest part of your chest, keeping the tape horizontal.',
            },
            {
                label: 'Length',
                desc: 'Measure from the top of the shoulder to the bottom hem of the jersey.',
            },
            {
                label: 'Shoulder',
                desc: 'Measure from one shoulder seam to the other across the back.',
            },
        ].map((item) => (<div key={item.label} className="flex gap-4 rounded-md border border-border/50 bg-card p-5">
              <span className="shrink-0 text-sm font-medium text-primary">
                {item.label}
              </span>
              <p className="text-[12px] leading-relaxed text-foreground/40">
                {item.desc}
              </p>
            </div>))}
        </div>
      </div>

      <div className="mt-14 rounded-md border border-primary/20 bg-primary/5 p-8">
        <p className="text-sm font-medium text-foreground">
          Still unsure about your size?
        </p>
        <p className="mt-2 text-[12px] leading-relaxed text-foreground/40">
          Reach out to us at{' '}
          <span className="text-primary">support@jerseyculture.in</span> with
          your height, weight, and preferred fit, and we will recommend the
          perfect size for you.
        </p>
      </div>
    </div>);
}
