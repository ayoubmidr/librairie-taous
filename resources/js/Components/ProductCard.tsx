import { Link } from '@inertiajs/react';
import { Heart, ShoppingBag, Star, Zap } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Product } from '@/types';

interface ProductCardProps {
    product: Product;
    showAddToCart?: boolean;
}

export default function ProductCard({ product, showAddToCart = true }: ProductCardProps) {
    const [wishlist, setWishlist] = useState(product.in_wishlist || false);
    const [loading, setLoading] = useState(false);

    const handleAddToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(route('cart.add'), { product_id: product.id, quantity: 1 });
            toast.success('Ajouté au panier !');
        } catch {
            toast.error("Erreur lors de l'ajout");
        } finally {
            setLoading(false);
        }
    };

    const handleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await axios.post(route('wishlist.toggle'), { product_id: product.id });
            setWishlist(!wishlist);
            toast.success(wishlist ? 'Retiré des favoris' : 'Ajouté aux favoris');
        } catch {
            toast.error('Veuillez vous connecter');
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
            <Link href={route('products.show', product.slug)} className="block relative">
                <div className="aspect-[3/4] overflow-hidden bg-stone-100">
                    <img
                        src={product.main_image_url || '/images/product-placeholder.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                    />
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {product.is_new && (
                        <span className="bg-[#1e3a5f] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            Nouveauté
                        </span>
                    )}
                    {product.discount_percent && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            -{product.discount_percent}%
                        </span>
                    )}
                    {product.type === 'preorder' && (
                        <span className="bg-[#c9a84c] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            Précommande
                        </span>
                    )}
                    {product.is_out_of_stock && (
                        <span className="bg-gray-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                            Rupture
                        </span>
                    )}
                </div>

                {/* Wishlist btn */}
                <button
                    onClick={handleWishlist}
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                >
                    <Heart size={14} className={wishlist ? 'text-red-500 fill-red-500' : 'text-stone-400'} />
                </button>
            </Link>

            <div className="p-4">
                {product.category && (
                    <span className="text-xs text-[#1e3a5f] font-medium uppercase tracking-wider">
                        {product.category.name}
                    </span>
                )}

                <Link href={route('products.show', product.slug)}>
                    <h3 className="mt-1 text-stone-800 font-semibold text-sm leading-snug line-clamp-2 hover:text-[#1e3a5f] transition-colors">
                        {product.name}
                    </h3>
                </Link>

                {product.authors && product.authors.length > 0 && (
                    <p className="text-stone-400 text-xs mt-1">
                        {product.authors.map(a => a.name).join(', ')}
                    </p>
                )}

                {product.average_rating > 0 && (
                    <div className="flex items-center gap-1 mt-1">
                        <div className="flex">
                            {[1,2,3,4,5].map(i => (
                                <Star key={i} size={10} className={i <= product.average_rating ? 'text-[#c9a84c] fill-[#c9a84c]' : 'text-stone-200 fill-stone-200'} />
                            ))}
                        </div>
                        <span className="text-xs text-stone-400">({product.reviews_count})</span>
                    </div>
                )}

                <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                        <span className="text-[#1e3a5f] font-bold text-lg">
                            {parseFloat(String(product.price)).toFixed(2)} €
                        </span>
                        {product.compare_price && parseFloat(String(product.compare_price)) > parseFloat(String(product.price)) && (
                            <span className="text-stone-400 text-sm line-through">
                                {parseFloat(String(product.compare_price)).toFixed(2)} €
                            </span>
                        )}
                    </div>

                    {showAddToCart && !product.is_out_of_stock && (
                        <button
                            onClick={handleAddToCart}
                            disabled={loading}
                            className="w-9 h-9 bg-[#1e3a5f] text-white rounded-lg flex items-center justify-center hover:bg-[#2d5a8e] transition-colors disabled:opacity-50 flex-shrink-0"
                        >
                            <ShoppingBag size={16} />
                        </button>
                    )}
                </div>

                {product.type === 'preorder' && product.preorder_date && (
                    <p className="text-xs text-[#c9a84c] mt-1">
                        Disponible le {new Date(product.preorder_date).toLocaleDateString('fr-FR')}
                    </p>
                )}

                {product.is_low_stock && !product.is_out_of_stock && (
                    <p className="text-xs text-orange-500 mt-1 flex items-center gap-1"><Zap size={11} className="fill-orange-500" /> Plus que {product.stock} en stock</p>
                )}
            </div>
        </div>
    );
}
