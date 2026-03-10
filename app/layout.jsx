import { Analytics } from '@vercel/analytics/next';
import { Providers } from '@/components/providers';
import TargetCursor from '@/components/TargetCursor';
import './globals.css';
export const metadata = {
    title: 'JerseyCulture | Premium Football Jerseys in India',
    description: 'Shop authentic football jerseys from top clubs and national teams. Premium quality, fast delivery across India.',
};
export const viewport = {
    themeColor: '#1a1a2e',
    width: 'device-width',
    initialScale: 1,
};
export default function RootLayout({ children, }) {
    return (<html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <TargetCursor spinDuration={2} hideDefaultCursor parallaxOn hoverDuration={0.2}/>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>);
}
