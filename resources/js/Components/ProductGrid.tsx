import ProductCard from './ProductCard';
import { Product } from '@/types';

interface ProductGridProps {
    products: Product[];
    cols?: 2 | 3 | 4 | 5;
}

export default function ProductGrid({ products, cols = 4 }: ProductGridProps) {
    const colsClass: Record<number, string> = {
        2: 'grid-cols-2 md:grid-cols-2',
        3: 'grid-cols-2 md:grid-cols-3',
        4: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
        5: 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
    };

    return (
        <div className={`grid ${colsClass[cols] || 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'} gap-4 md:gap-6`}>
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
