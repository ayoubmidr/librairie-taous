import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Trash2, Plus, Minus, ShoppingBag, Tag, ChevronRight, ShieldCheck, Truck, AlertTriangle, PartyPopper } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { CartItem, CartSummary } from '@/types';

interface CartProps {
    cart: CartItem[];
    summary: CartSummary;
}

const toNumber = (value: unknown): number => {
    const number = Number.parseFloat(String(value ?? 0));
    return Number.isFinite(number) ? number : 0;
};

const hasValue = (value: unknown): boolean => value !== null && value !== undefined && value !== '';

const money = (value: unknown): string => toNumber(value).toFixed(2);

export default function Cart({ cart, summary }: CartProps) {
    const [couponCode, setCouponCode] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [loadingItem, setLoadingItem] = useState<string | null>(null);

    const updateQuantity = async (itemId: string, quantity: number) => {
        setLoadingItem(itemId);
        try {
            await axios.patch(route('cart.update', itemId), { quantity });
            router.reload({ only: ['cart', 'summary', 'cartCount'] });
        } catch {
            toast.error('Erreur lors de la mise à jour');
        } finally {
            setLoadingItem(null);
        }
    };

    const removeItem = async (itemId: string) => {
        try {
            await axios.delete(route('cart.remove', itemId));
            router.reload({ only: ['cart', 'summary', 'cartCount'] });
            toast.success('Article retiré du panier');
        } catch {
            toast.error('Erreur');
        }
    };

    const applyCoupon = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setCouponLoading(true);
        try {
            await axios.post(route('cart.coupon'), { code: couponCode });
            router.reload({ only: ['cart', 'summary'] });
            toast.success('Code promo appliqué !');
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            toast.error(axiosErr.response?.data?.message || 'Code invalide');
        } finally {
            setCouponLoading(false);
        }
    };

    if (!cart?.length) {
        return (
            <MainLayout title="Mon panier">
                <div className="max-w-2xl mx-auto px-4 py-20 text-center">
                    <ShoppingBag size={64} className="text-stone-300 mx-auto mb-6" />
                    <h1 className="text-2xl font-serif font-bold text-stone-700 mb-4">Votre panier est vide</h1>
                    <p className="text-stone-500 mb-8">Découvrez notre sélection de livres islamiques</p>
                    <Link href={route('shop.index')} className="btn-primary">
                        Continuer mes achats
                    </Link>
                </div>
            </MainLayout>
        );
    }

    return (
        <MainLayout title="Mon panier">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-serif font-bold text-[#0f2240] mb-8">
                    Mon panier ({cart.length} article{cart.length > 1 ? 's' : ''})
                </h1>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cart.some(item => item.is_preorder) && (
                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                                <p className="text-orange-700 font-medium text-sm">
                                    <AlertTriangle size={16} className="inline mr-1 align-text-bottom" /> Votre panier contient des articles en précommande. Ces articles seront expédiés séparément à leur date de disponibilité.
                                </p>
                            </div>
                        )}

                        {cart.map((item) => (
                            <div key={item.id} className="bg-white rounded-xl border border-stone-100 p-4 flex gap-4">
                                <Link href={route('products.show', item.product_slug)} className="flex-shrink-0">
                                    <img
                                        src={item.image || '/images/product-placeholder.jpg'}
                                        alt={item.product_name}
                                        className="w-20 h-28 object-cover rounded-lg"
                                    />
                                </Link>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <Link href={route('products.show', item.product_slug)} className="font-semibold text-stone-800 hover:text-[#1e3a5f] transition-colors line-clamp-2">
                                                {item.product_name}
                                            </Link>
                                            {item.authors && <p className="text-stone-400 text-sm">{item.authors}</p>}
                                            {item.is_preorder && (
                                                <span className="inline-block text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full mt-1">
                                                    Précommande
                                                </span>
                                            )}
                                            {item.bulk_discount && item.bulk_discount > 0 && (
                                                <span className="inline-block text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full mt-1">
                                                    -{item.bulk_discount}% volume
                                                </span>
                                            )}
                                        </div>
                                        <button onClick={() => removeItem(item.id)} className="text-stone-300 hover:text-red-500 transition-colors flex-shrink-0">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    <div className="mt-3 flex items-center justify-between">
                                        <div className="flex items-center border border-stone-200 rounded-lg">
                                            <button
                                                onClick={() => item.quantity > 1 ? updateQuantity(item.id, item.quantity - 1) : removeItem(item.id)}
                                                disabled={loadingItem === item.id}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-stone-50 rounded-l-lg transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                            <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                disabled={loadingItem === item.id}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-stone-50 rounded-r-lg transition-colors"
                                            >
                                                <Plus size={14} />
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <div className="font-bold text-[#1e3a5f]">{money(toNumber(item.price) * item.quantity)} €</div>
                                            <div className="text-stone-400 text-xs">{money(item.price)} € / unité</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Link href={route('shop.index')} className="inline-flex items-center gap-2 text-[#1e3a5f] font-medium text-sm hover:gap-3 transition-all">
                            ← Continuer mes achats
                        </Link>
                    </div>

                    {/* Summary */}
                    <div className="space-y-4">
                        {/* Coupon */}
                        <div className="bg-white rounded-xl border border-stone-100 p-5">
                            <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
                                <Tag size={16} /> Code promo
                            </h3>
                            <form onSubmit={applyCoupon} className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="Votre code"
                                    className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f] uppercase"
                                />
                                <button type="submit" disabled={couponLoading || !couponCode} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-semibold hover:bg-[#2d5a8e] transition-colors disabled:opacity-50">
                                    {couponLoading ? '...' : 'OK'}
                                </button>
                            </form>
                            {summary?.coupon && (
                                <div className="mt-2 flex items-center justify-between text-sm">
                                    <span className="text-green-600 font-medium">✓ {summary.coupon}</span>
                                    <button onClick={() => { axios.delete(route('cart.coupon.remove')).then(() => router.reload()); }} className="text-red-500 text-xs">Supprimer</button>
                                </div>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-xl border border-stone-100 p-5 sticky top-24">
                            <h3 className="font-semibold text-stone-800 mb-5 text-lg">Récapitulatif</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-stone-600">
                                    <span>Sous-total</span>
                                    <span>{money(summary?.subtotal)} €</span>
                                </div>
                                {toNumber(summary?.coupon_discount) > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Code promo</span>
                                        <span>-{money(summary.coupon_discount)} €</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-stone-600">
                                    <span>Livraison</span>
                                    <span className={hasValue(summary?.shipping) && toNumber(summary?.shipping) === 0 ? 'text-green-600 font-medium' : ''}>
                                        {hasValue(summary?.shipping) && toNumber(summary?.shipping) === 0 ? <span className="flex items-center gap-1">Gratuite <PartyPopper size={14} /></span> : hasValue(summary?.shipping) ? `${money(summary.shipping)} €` : 'Calculé au checkout'}
                                    </span>
                                </div>
                                <div className="border-t border-stone-100 pt-3 flex justify-between font-bold text-lg">
                                    <span>Total TTC</span>
                                    <span className="text-[#1e3a5f]">{money(summary?.total)} €</span>
                                </div>
                            </div>

                            <Link href={route('checkout.index')} className="w-full flex items-center justify-center gap-2 mt-6 bg-[#1e3a5f] text-white py-4 rounded-lg font-semibold hover:bg-[#2d5a8e] transition-colors">
                                Passer commande <ChevronRight size={18} />
                            </Link>

                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-stone-400">
                                    <ShieldCheck size={12} className="text-[#1e3a5f]" /> Paiement 100% sécurisé par Stripe
                                </div>
                                <div className="flex items-center gap-2 text-xs text-stone-400">
                                    <Truck size={12} className="text-[#1e3a5f]" /> Livraison gratuite dès 50€
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
