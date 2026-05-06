import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import {
    Trash2, Plus, Minus, ShoppingBag, Tag, ChevronRight, ShieldCheck, Truck,
    AlertTriangle, PartyPopper, MapPin, Zap, CheckCircle, User, Package,
    Globe, MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { CartItem, CartSummary, PageProps } from '@/types';

interface CartProps {
    cart: CartItem[];
    summary: CartSummary;
}

// ─── Shipping config ────────────────────────────────────────────────────────
const FREE_THRESHOLD = 125;

interface ShippingOption {
    id: 'relay' | 'classic' | 'express';
    label: string;
    description: string;
    delay: string;
    icon: React.ReactNode;
    prices: [number, number]; // [0-50€ tier, 50-125€ tier]
}

const SHIPPING_OPTIONS: ShippingOption[] = [
    {
        id: 'relay',
        label: 'Mondial Relay',
        description: 'Point relais près de chez vous',
        delay: '3–5 jours ouvrés',
        icon: <MapPin size={18} />,
        prices: [4.99, 8.99],
    },
    {
        id: 'classic',
        label: 'Livraison à domicile',
        description: 'Livraison standard en boîte aux lettres',
        delay: '2–4 jours ouvrés',
        icon: <Truck size={18} />,
        prices: [9.99, 13.50],
    },
    {
        id: 'express',
        label: 'Livraison rapide + signature',
        description: 'Livraison express avec remise en main propre',
        delay: '1–2 jours ouvrés',
        icon: <Zap size={18} />,
        prices: [14.00, 17.00],
    },
];

function getShippingCost(optionId: ShippingOption['id'], subtotal: number): number {
    if (subtotal >= FREE_THRESHOLD) return 0;
    const option = SHIPPING_OPTIONS.find(o => o.id === optionId)!;
    return subtotal < 50 ? option.prices[0] : option.prices[1];
}

// ─── Constants ──────────────────────────────────────────────────────────────
const WHATSAPP_NUMBER = '33123456789';

const STANDARD_COUNTRIES = [
    { name: 'Allemagne', flag: '🇩🇪' },
    { name: 'Belgique',  flag: '🇧🇪' },
    { name: 'Espagne',   flag: '🇪🇸' },
    { name: 'France',    flag: '🇫🇷' },
    { name: 'Italie',    flag: '🇮🇹' },
    { name: 'Luxembourg', flag: '🇱🇺' },
    { name: 'Pays-Bas',  flag: '🇳🇱' },
    { name: 'Pologne',   flag: '🇵🇱' },
    { name: 'Portugal',  flag: '🇵🇹' },
];

// ─── Helper formatters ───────────────────────────────────────────────────────
const toNumber = (value: unknown): number => {
    const n = Number.parseFloat(String(value ?? 0));
    return Number.isFinite(n) ? n : 0;
};
const money = (value: unknown): string => toNumber(value).toFixed(2);

// ─── Sub-components ──────────────────────────────────────────────────────────

function InternationalShippingBanner() {
    return (
        <div className="bg-white rounded-xl border border-stone-100 p-5">
            <div className="flex items-center gap-2 mb-3">
                <Globe size={16} className="text-[#1e3a5f]" />
                <h3 className="font-semibold text-stone-800 text-sm">Pays desservis en livraison standard</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
                {STANDARD_COUNTRIES.map(c => (
                    <span key={c.name} className="inline-flex items-center gap-1.5 bg-[#fdf8f0] border border-[#c9a84c]/30 text-stone-700 px-2.5 py-1 rounded-lg text-xs font-medium">
                        <span>{c.flag}</span> {c.name}
                    </span>
                ))}
            </div>
            <div className="bg-[#1e3a5f]/5 border border-[#1e3a5f]/10 rounded-lg p-3 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                    <p className="text-stone-700 text-sm font-medium">Livraison possible partout dans le monde</p>
                    <p className="text-stone-500 text-xs mt-0.5">Sur demande avec tarif personnalisé — réponse rapide par WhatsApp ou email.</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                    <Link
                        href={route('shipping.international')}
                        className="inline-flex items-center gap-1.5 bg-[#1e3a5f] text-white px-3 py-2 rounded-lg text-xs font-semibold hover:bg-[#2d5a8e] transition-colors"
                    >
                        <Globe size={13} /> Demander un tarif
                    </Link>
                    <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Bonjour, je souhaite commander et me renseigner sur la livraison internationale.')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-3 py-2 rounded-lg text-xs font-semibold transition-colors"
                    >
                        <MessageSquare size={13} /> WhatsApp
                    </a>
                </div>
            </div>
        </div>
    );
}

function FreeShippingBar({ subtotal }: { subtotal: number }) {
    const remaining = Math.max(0, FREE_THRESHOLD - subtotal);
    const progress = Math.min(100, (subtotal / FREE_THRESHOLD) * 100);
    const isFree = subtotal >= FREE_THRESHOLD;

    return (
        <div className={`rounded-xl p-4 mb-4 ${isFree ? 'bg-green-50 border border-green-200' : 'bg-[#fdf8f0] border border-[#c9a84c]/30'}`}>
            {isFree ? (
                <div className="flex items-center gap-3">
                    <PartyPopper size={20} className="text-green-500 flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-green-700 text-sm">Livraison gratuite débloquée !</p>
                        <p className="text-green-600 text-xs mt-0.5">+ Code <span className="font-mono font-bold">-10%</span> offert sur votre prochaine commande</p>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-stone-700 text-sm font-medium">
                            Plus que <span className="font-bold text-[#1e3a5f]">{money(remaining)} €</span> avant la livraison gratuite
                        </p>
                        <span className="text-[#c9a84c] text-xs font-bold">{Math.round(progress)}%</span>
                    </div>
                    <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-[#c9a84c] to-[#e8c97a] rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-stone-400 text-xs mt-2">
                        Dès {FREE_THRESHOLD} € d'achat — livraison offerte + <span className="font-semibold">-10% sur votre prochaine commande</span>
                    </p>
                </div>
            )}
        </div>
    );
}

function ShippingSelector({
    subtotal,
    selected,
    onChange,
}: {
    subtotal: number;
    selected: ShippingOption['id'];
    onChange: (id: ShippingOption['id']) => void;
}) {
    if (subtotal >= FREE_THRESHOLD) {
        return (
            <div className="bg-white rounded-xl border border-green-200 p-5">
                <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
                    <Truck size={16} className="text-green-500" /> Livraison
                </h3>
                <div className="flex items-center gap-3 bg-green-50 rounded-lg p-4">
                    <PartyPopper size={20} className="text-green-500 flex-shrink-0" />
                    <div>
                        <p className="font-bold text-green-700">Félicitations, votre livraison est offerte !</p>
                        <p className="text-green-600 text-xs mt-0.5">Applicable à tous les modes de livraison</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-stone-100 p-5">
            <h3 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                <Truck size={16} className="text-[#1e3a5f]" /> Mode de livraison
            </h3>
            <div className="space-y-3">
                {SHIPPING_OPTIONS.map((option) => {
                    const cost = getShippingCost(option.id, subtotal);
                    const isSelected = selected === option.id;
                    return (
                        <button
                            key={option.id}
                            onClick={() => onChange(option.id)}
                            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all duration-150 ${
                                isSelected
                                    ? 'border-[#1e3a5f] bg-[#1e3a5f]/5'
                                    : 'border-stone-200 hover:border-stone-300 bg-white'
                            }`}
                        >
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? 'bg-[#1e3a5f] text-white' : 'bg-stone-100 text-stone-500'}`}>
                                {option.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-semibold text-stone-800 text-sm">{option.label}</div>
                                <div className="text-stone-400 text-xs">{option.description} — {option.delay}</div>
                            </div>
                            <div className="flex-shrink-0 text-right">
                                <div className={`font-bold text-base ${isSelected ? 'text-[#1e3a5f]' : 'text-stone-700'}`}>
                                    {cost.toFixed(2)} €
                                </div>
                            </div>
                            {isSelected && (
                                <CheckCircle size={18} className="text-[#1e3a5f] flex-shrink-0" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

function PaymentLogos() {
    const methods = ['VISA', 'Mastercard', 'Bancontact', 'PayPal', 'Stripe', 'Apple Pay', 'G Pay'];
    return (
        <div className="mt-5 pt-4 border-t border-stone-100">
            <p className="text-xs text-stone-400 mb-3 text-center font-medium">Moyens de paiement acceptés</p>
            <div className="flex flex-wrap items-center justify-center gap-2">
                {methods.map((m) => (
                    <span key={m} className="inline-flex items-center bg-stone-50 border border-stone-200 text-stone-600 text-xs font-semibold px-2.5 py-1 rounded-md tracking-wide">
                        {m}
                    </span>
                ))}
            </div>
        </div>
    );
}

function AccountCTA({ isGuest }: { isGuest: boolean }) {
    if (!isGuest) return null;
    return (
        <div className="bg-[#fdf8f0] border border-[#c9a84c]/30 rounded-xl p-4 flex gap-3 items-start">
            <User size={18} className="text-[#c9a84c] flex-shrink-0 mt-0.5" />
            <div>
                <p className="text-stone-700 text-sm font-semibold mb-0.5">Suivez votre commande facilement</p>
                <p className="text-stone-500 text-xs leading-relaxed">
                    Créez votre compte pour retrouver votre historique d'achats et profiter de vos avantages clients.
                    L'achat sans compte reste possible.
                </p>
                <div className="flex gap-2 mt-2">
                    <Link href={route('register')} className="text-xs font-semibold text-[#1e3a5f] hover:underline">
                        Créer un compte →
                    </Link>
                    <span className="text-stone-300">|</span>
                    <Link href={route('login')} className="text-xs text-stone-500 hover:underline">
                        Se connecter
                    </Link>
                </div>
            </div>
        </div>
    );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function Cart({ cart, summary }: CartProps) {
    const { auth } = usePage<PageProps>().props;
    const isGuest = !auth?.user;

    const [couponCode, setCouponCode] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [loadingItem, setLoadingItem] = useState<string | null>(null);
    const [selectedShipping, setSelectedShipping] = useState<ShippingOption['id']>('classic');

    const subtotal = toNumber(summary?.subtotal);
    const couponDiscount = toNumber(summary?.coupon_discount);
    const shippingCost = getShippingCost(selectedShipping, subtotal);
    const computedTotal = Math.max(0, subtotal - couponDiscount + shippingCost);

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

    // ─── Empty state ─────────────────────────────────────────────────────────
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

                    {/* ── Left column: items + shipping ── */}
                    <div className="lg:col-span-2 space-y-4">

                        {/* Barre de progression livraison gratuite */}
                        <FreeShippingBar subtotal={subtotal} />

                        {/* Avertissement précommandes */}
                        {cart.some(item => item.is_preorder) && (
                            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                                <p className="text-orange-700 font-medium text-sm">
                                    <AlertTriangle size={16} className="inline mr-1 align-text-bottom" />
                                    Votre panier contient des articles en précommande. Ces articles seront expédiés séparément à leur date de disponibilité.
                                </p>
                            </div>
                        )}

                        {/* Articles */}
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

                        {/* Sélecteur mode de livraison */}
                        <ShippingSelector
                            subtotal={subtotal}
                            selected={selectedShipping}
                            onChange={setSelectedShipping}
                        />

                        {/* Livraison internationale */}
                        <InternationalShippingBanner />

                        <Link href={route('shop.index')} className="inline-flex items-center gap-2 text-[#1e3a5f] font-medium text-sm hover:gap-3 transition-all">
                            ← Continuer mes achats
                        </Link>
                    </div>

                    {/* ── Right column: summary ── */}
                    <div className="space-y-4">

                        {/* Code promo */}
                        <div className="bg-white rounded-xl border border-stone-100 p-5">
                            <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
                                <Tag size={16} /> Code promo
                            </h3>
                            <form onSubmit={applyCoupon} className="flex gap-2">
                                <input
                                    type="text"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                    placeholder="Ex : BIENVENUE10"
                                    className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f] uppercase font-mono tracking-wider"
                                />
                                <button type="submit" disabled={couponLoading || !couponCode} className="px-4 py-2 bg-[#1e3a5f] text-white rounded-lg text-sm font-semibold hover:bg-[#2d5a8e] transition-colors disabled:opacity-50">
                                    {couponLoading ? '...' : 'OK'}
                                </button>
                            </form>
                            {summary?.coupon && (
                                <div className="mt-2 flex items-center justify-between text-sm">
                                    <span className="text-green-600 font-medium flex items-center gap-1">
                                        <CheckCircle size={13} /> {summary.coupon}
                                    </span>
                                    <button
                                        onClick={() => { axios.delete(route('cart.coupon.remove')).then(() => router.reload()); }}
                                        className="text-red-500 text-xs hover:underline"
                                    >
                                        Supprimer
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Récapitulatif */}
                        <div className="bg-white rounded-xl border border-stone-100 p-5 sticky top-24">
                            <h3 className="font-semibold text-stone-800 mb-5 text-lg">Récapitulatif</h3>

                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between text-stone-600">
                                    <span>Sous-total</span>
                                    <span>{money(subtotal)} €</span>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Code promo</span>
                                        <span>-{money(couponDiscount)} €</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-stone-600">
                                    <span className="flex items-center gap-1">
                                        Livraison
                                        {subtotal < FREE_THRESHOLD && (
                                            <span className="text-xs text-stone-400">
                                                ({SHIPPING_OPTIONS.find(o => o.id === selectedShipping)?.label})
                                            </span>
                                        )}
                                    </span>
                                    {shippingCost === 0 ? (
                                        <span className="text-green-600 font-semibold flex items-center gap-1">
                                            Gratuite <PartyPopper size={13} />
                                        </span>
                                    ) : (
                                        <span>{money(shippingCost)} €</span>
                                    )}
                                </div>
                                <div className="border-t border-stone-100 pt-3 flex justify-between font-bold text-lg">
                                    <span>Total TTC</span>
                                    <span className="text-[#1e3a5f]">{money(computedTotal)} €</span>
                                </div>
                            </div>

                            {/* CTA compte invité */}
                            <div className="mt-5">
                                <AccountCTA isGuest={isGuest} />
                            </div>

                            <Link
                                href={route('checkout.index') + `?shipping=${selectedShipping}`}
                                className="w-full flex items-center justify-center gap-2 mt-4 bg-[#1e3a5f] text-white py-4 rounded-xl font-bold text-base hover:bg-[#2d5a8e] transition-colors shadow-md"
                            >
                                <Package size={18} /> Passer commande <ChevronRight size={18} />
                            </Link>

                            <div className="mt-4 space-y-2">
                                <div className="flex items-center gap-2 text-xs text-stone-400">
                                    <ShieldCheck size={12} className="text-[#1e3a5f]" /> Paiement 100% sécurisé par Stripe
                                </div>
                                <div className="flex items-center gap-2 text-xs text-stone-400">
                                    <Truck size={12} className="text-[#1e3a5f]" /> Livraison gratuite dès {FREE_THRESHOLD} €
                                </div>
                            </div>

                            {/* Logos moyens de paiement */}
                            <PaymentLogos />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
