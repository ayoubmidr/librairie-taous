import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import { ShoppingBag, Heart, Star, ChevronRight, Minus, Plus, Truck, ShieldCheck, RefreshCcw, Calendar, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Product, Review, PageProps, BulkDiscount } from '@/types';

interface ProductShowProps {
    product: Product;
    relatedProducts: Product[];
    reviews: Review[];
}

export default function ProductShow({ product, relatedProducts, reviews }: ProductShowProps) {
    const { auth } = usePage<PageProps>().props;
    const [quantity, setQuantity] = useState(1);
    const [activeImage, setActiveImage] = useState(0);
    const [activeTab, setActiveTab] = useState('description');
    const [loading, setLoading] = useState(false);
    const [wishlist, setWishlist] = useState(product.in_wishlist || false);

    const images = product.images?.length ? product.images : [{ url: '/images/product-placeholder.jpg' }];

    const bulkPrice = product.bulk_discounts?.find((d: BulkDiscount) => quantity >= d.min_quantity && d.is_active);
    const displayPrice = bulkPrice
        ? (parseFloat(String(product.price)) * (1 - bulkPrice.discount_percent / 100)).toFixed(2)
        : parseFloat(String(product.price)).toFixed(2);

    const handleAddToCart = async () => {
        setLoading(true);
        try {
            await axios.post(route('cart.add'), { product_id: product.id, quantity });
            toast.success(`${quantity} livre(s) ajouté(s) au panier !`);
        } catch {
            toast.error("Erreur lors de l'ajout au panier");
        } finally {
            setLoading(false);
        }
    };

    const handleWishlist = async () => {
        if (!auth?.user) { toast.error('Connectez-vous pour ajouter aux favoris'); return; }
        try {
            await axios.post(route('wishlist.toggle'), { product_id: product.id });
            setWishlist(!wishlist);
            toast.success(wishlist ? 'Retiré des favoris' : 'Ajouté aux favoris');
        } catch {
            toast.error('Erreur');
        }
    };

    return (
        <MainLayout title={product.meta_title || product.name} description={product.meta_description || product.short_description}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-stone-500 mb-8">
                    <Link href={route('home')} className="hover:text-[#1e3a5f]">Accueil</Link>
                    <span>/</span>
                    <Link href={route('shop.index')} className="hover:text-[#1e3a5f]">Boutique</Link>
                    {product.category && <>
                        <span>/</span>
                        <Link href={route('shop.category', product.category.slug)} className="hover:text-[#1e3a5f]">{product.category.name}</Link>
                    </>}
                    <span>/</span>
                    <span className="text-stone-800 truncate max-w-40">{product.name}</span>
                </nav>

                {/* Main Product */}
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">
                    {/* Images */}
                    <div className="lg:col-span-2">
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 mb-4">
                            <img
                                src={images[activeImage]?.url || '/images/product-placeholder.jpg'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setActiveImage(i)}
                                        className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-colors ${i === activeImage ? 'border-[#1e3a5f]' : 'border-stone-200'}`}
                                    >
                                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="lg:col-span-3">
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2 mb-3">
                            {product.is_new && <span className="bg-[#1e3a5f] text-white text-xs font-bold px-3 py-1 rounded-full">Nouveauté</span>}
                            {product.is_bestseller && <span className="bg-[#c9a84c] text-white text-xs font-bold px-3 py-1 rounded-full">Bestseller</span>}
                            {product.type === 'preorder' && <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">Précommande</span>}
                            {product.discount_percent && <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">-{product.discount_percent}%</span>}
                        </div>

                        <h1 className="text-2xl md:text-3xl font-serif font-bold text-[#0f2240] mb-2 leading-tight">
                            {product.name}
                        </h1>

                        {product.authors && product.authors.length > 0 && (
                            <p className="text-[#1e3a5f] font-medium mb-3">
                                Par {product.authors.map(a => a.name).join(', ')}
                            </p>
                        )}

                        {product.reviews_count > 0 && (
                            <div className="flex items-center gap-2 mb-4">
                                <div className="flex">
                                    {[1,2,3,4,5].map(i => (
                                        <Star key={i} size={14} className={i <= product.average_rating ? 'text-[#c9a84c] fill-[#c9a84c]' : 'text-stone-200 fill-stone-200'} />
                                    ))}
                                </div>
                                <span className="text-sm text-stone-500">{product.average_rating}/5 ({product.reviews_count} avis)</span>
                            </div>
                        )}

                        {product.short_description && (
                            <p className="text-stone-600 leading-relaxed mb-6 border-l-4 border-[#c9a84c] pl-4">
                                {product.short_description}
                            </p>
                        )}

                        {/* Price */}
                        <div className="mb-6 p-4 bg-[#fdf8f0] rounded-xl border border-[#c9a84c]/20">
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-bold text-[#1e3a5f]">{displayPrice} €</span>
                                {product.compare_price && parseFloat(String(product.compare_price)) > parseFloat(String(product.price)) && (
                                    <span className="text-xl text-stone-400 line-through">{parseFloat(String(product.compare_price)).toFixed(2)} €</span>
                                )}
                            </div>
                            {bulkPrice && (
                                <p className="text-sm text-[#1e3a5f] mt-1 font-medium">
                                    ✓ Réduction volume appliquée : -{bulkPrice.discount_percent}%
                                </p>
                            )}

                            {product.bulk_discounts && product.bulk_discounts.length > 0 && (
                                <div className="mt-3 pt-3 border-t border-[#c9a84c]/20">
                                    <p className="text-xs font-semibold text-stone-600 mb-2">Réductions volume (Éditions Taous) :</p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.bulk_discounts.map((d, i) => (
                                            <span key={i} className={`text-xs px-2 py-1 rounded-full border ${quantity >= d.min_quantity ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]' : 'border-stone-200 text-stone-600'}`}>
                                                {d.min_quantity}+ ex. → -{d.discount_percent}%
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Stock status */}
                        {product.is_out_of_stock ? (
                            <div className="flex items-center gap-2 mb-4 text-red-600">
                                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                                <span className="text-sm font-medium">Rupture de stock</span>
                            </div>
                        ) : product.type === 'preorder' ? (
                            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                                <p className="text-orange-700 text-sm font-medium flex items-center gap-2">
                                    <Calendar size={14} />
                                    Précommande — Disponible le {product.preorder_date ? new Date(product.preorder_date).toLocaleDateString('fr-FR') : 'bientôt'}
                                </p>
                                {product.preorder_message && (
                                    <p className="text-orange-600 text-xs mt-1">{product.preorder_message}</p>
                                )}
                            </div>
                        ) : product.is_low_stock ? (
                            <div className="flex items-center gap-2 mb-4 text-orange-600">
                                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
                                <span className="text-sm font-medium">Plus que {product.stock} en stock !</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 mb-4 text-green-600">
                                <Check size={16} />
                                <span className="text-sm font-medium">En stock — Expédition sous 24-48h</span>
                            </div>
                        )}

                        {/* Quantity & Add to Cart */}
                        {!product.is_out_of_stock && (
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-center border-2 border-stone-200 rounded-lg">
                                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-12 flex items-center justify-center hover:bg-stone-50 rounded-l-lg transition-colors">
                                        <Minus size={16} />
                                    </button>
                                    <span className="w-12 text-center font-semibold">{quantity}</span>
                                    <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-12 flex items-center justify-center hover:bg-stone-50 rounded-r-lg transition-colors">
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <button
                                    onClick={handleAddToCart}
                                    disabled={loading}
                                    className="flex-1 flex items-center justify-center gap-2 bg-[#1e3a5f] text-white py-3.5 px-6 rounded-lg font-semibold hover:bg-[#2d5a8e] transition-colors disabled:opacity-50"
                                >
                                    <ShoppingBag size={18} />
                                    {loading ? 'Ajout...' : `Ajouter au panier — ${(parseFloat(displayPrice) * quantity).toFixed(2)} €`}
                                </button>
                                <button onClick={handleWishlist} className={`w-12 h-12 border-2 rounded-lg flex items-center justify-center transition-colors ${wishlist ? 'border-red-500 bg-red-50' : 'border-stone-200 hover:border-red-300'}`}>
                                    <Heart size={18} className={wishlist ? 'text-red-500 fill-red-500' : 'text-stone-400'} />
                                </button>
                            </div>
                        )}

                        {/* Trust */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { icon: <Truck size={16} />, text: 'Livraison rapide' },
                                { icon: <ShieldCheck size={16} />, text: 'Paiement sécurisé' },
                                { icon: <RefreshCcw size={16} />, text: 'Retours 14 jours' },
                            ].map((t, i) => (
                                <div key={i} className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 rounded-lg p-2.5">
                                    <span className="text-[#1e3a5f]">{t.icon}</span>
                                    {t.text}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-16">
                    <div className="flex border-b border-stone-200 mb-8 overflow-x-auto">
                        {[
                            { key: 'description', label: 'Description' },
                            { key: 'details', label: 'Détails' },
                            { key: 'reviews', label: `Avis (${product.reviews_count || 0})` },
                        ].map((tab) => (
                            <button
                                key={tab.key}
                                onClick={() => setActiveTab(tab.key)}
                                className={`px-6 py-4 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                                    activeTab === tab.key
                                        ? 'border-[#1e3a5f] text-[#1e3a5f]'
                                        : 'border-transparent text-stone-500 hover:text-stone-700'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'description' && (
                        <div className="prose prose-stone max-w-none text-stone-600 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: product.description || product.short_description || 'Aucune description disponible.' }}
                        />
                    )}

                    {activeTab === 'details' && (
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                { label: 'ISBN', value: product.isbn },
                                { label: 'Éditeur', value: product.publisher?.name },
                                { label: 'Langue', value: product.language === 'fr' ? 'Français' : product.language === 'ar' ? 'Arabe' : product.language },
                                { label: 'Format', value: product.format },
                                { label: 'Pages', value: product.pages ? String(product.pages) : undefined },
                                { label: 'Poids', value: product.weight ? `${product.weight} kg` : undefined },
                            ].filter(d => d.value).map((detail, i) => (
                                <div key={i} className="flex justify-between py-3 border-b border-stone-100">
                                    <span className="text-stone-500 text-sm">{detail.label}</span>
                                    <span className="text-stone-800 font-medium text-sm">{detail.value}</span>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'reviews' && (
                        <div>
                            {reviews?.length > 0 ? (
                                <div className="space-y-6">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="border-b border-stone-100 pb-6">
                                            <div className="flex items-start gap-4">
                                                <div className="w-10 h-10 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                                                    {review.author_name[0]}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <span className="font-semibold text-stone-800">{review.author_name}</span>
                                                        <span className="text-xs text-stone-400">{new Date(review.created_at).toLocaleDateString('fr-FR')}</span>
                                                    </div>
                                                    <div className="flex mb-2">
                                                        {[1,2,3,4,5].map(j => (
                                                            <Star key={j} size={12} className={j <= review.rating ? 'text-[#c9a84c] fill-[#c9a84c]' : 'text-stone-200 fill-stone-200'} />
                                                        ))}
                                                    </div>
                                                    {review.title && <p className="font-medium text-stone-700 text-sm mb-1">{review.title}</p>}
                                                    <p className="text-stone-600 text-sm">{review.content}</p>
                                                    {review.is_verified_purchase && (
                                                        <span className="inline-flex items-center gap-1 mt-2 text-xs text-[#1e3a5f]">
                                                            <Check size={10} /> Achat vérifié
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-stone-500 text-center py-8">Aucun avis pour le moment.</p>
                            )}
                        </div>
                    )}
                </div>

                {/* Related Products */}
                {relatedProducts?.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-serif font-bold text-[#0f2240] mb-6">Vous pourriez aussi aimer</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </section>
                )}
            </div>
        </MainLayout>
    );
}
