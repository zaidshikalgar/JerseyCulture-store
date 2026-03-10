'use client';
import { CartProvider } from '@/lib/cart-context';
import { AuthProvider } from '@/lib/auth-context';
import { ThemeProvider } from '@/components/theme-provider';
export function Providers({ children }) {
    return (<ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} enableColorScheme={false}>
      <AuthProvider>
        <CartProvider>{children}</CartProvider>
      </AuthProvider>
    </ThemeProvider>);
}
