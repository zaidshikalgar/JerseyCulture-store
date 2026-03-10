import { Suspense } from 'react';
import { ShopContent } from '@/components/shop/shop-content';
export const metadata = {
    title: 'Shop All Jerseys | JerseyCulture',
    description: 'Browse our complete collection of premium football jerseys.',
};
export default function ShopPage() {
    return (<Suspense fallback={null}>
      <ShopContent />
    </Suspense>);
}
