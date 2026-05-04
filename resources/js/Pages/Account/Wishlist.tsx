import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import { Heart } from 'lucide-react';
import { Product } from '@/types';

interface WishlistProps {
    products: Product[];
}

export default function Wishlist({ products }: WishlistProps) {
    return (
        <MainLayout title="Mes favoris">
            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex items-center gap-3 mb-8">
                    <Link href={route('account.index')} className="text-stone-400 hover:text-[#1a4731] text-sm">Mon compte</Link>
                    <span className="text-stone-300">/</span>
                    <h1 className="text-2xl font-serif font-bold text-[#0f2b1c]">Mes favoris</h1>
                </div>

                {products?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        {products.map(product => (
                            <ProductCard key={product.id} product={{ ...product, in_wishlist: true }} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-stone-100 p-16 text-center">
                        <Heart size={48} className="text-stone-200 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-stone-700 mb-2">Aucun favori</h2>
                        <p className="text-stone-500 mb-6">Ajoutez des livres à vos favoris pour les retrouver facilement.</p>
                        <Link href={route('shop.index')} className="btn-primary">
                            Parcourir le catalogue
                        </Link>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
