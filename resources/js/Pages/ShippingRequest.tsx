import { useState } from 'react';
import { Link, router, usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import {
    Globe, MapPin, ShoppingBag, Send, CheckCircle,
    Phone, Mail, MessageSquare, Truck, Package, ChevronRight,
} from 'lucide-react';
import { CartItem, PageProps } from '@/types';

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

interface ShippingRequestProps {
    cart: CartItem[];
    subtotal: number;
}

const money = (v: number) => v.toFixed(2);

function buildWhatsAppMessage(cart: CartItem[], country: string, name: string): string {
    const items = cart.map(i => `- ${i.product_name} (x${i.quantity})`).join('\n');
    const text = `Bonjour, je souhaite commander depuis ${country || 'mon pays'} :\n\n${items || '(panier vide)'}\n\nMon nom : ${name || '...'}\n\nPourriez-vous m'indiquer les frais de livraison ?`;
    return encodeURIComponent(text);
}

export default function ShippingRequest({ cart, subtotal }: ShippingRequestProps) {
    const { flash } = usePage<PageProps>().props;

    const [form, setForm] = useState({ name: '', email: '', phone: '', country: '', message: '' });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(!!flash?.success);

    const set = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
        setForm(prev => ({ ...prev, [field]: e.target.value }));

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        router.post(route('shipping.international.store'), form, {
            onSuccess: () => setSubmitted(true),
            onFinish: () => setLoading(false),
        });
    };

    const waMessage = buildWhatsAppMessage(cart, form.country, form.name);

    return (
        <MainLayout
            title="Livraison internationale — Librairie Taous"
            description="Livraison possible partout dans le monde sur demande. Obtenez un tarif personnalisé via WhatsApp ou email."
        >
            <div className="max-w-5xl mx-auto px-4 py-10">

                {/* ── Hero ── */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 bg-[#1e3a5f]/10 text-[#1e3a5f] px-4 py-2 rounded-full text-sm font-semibold mb-4">
                        <Globe size={16} /> Livraison internationale
                    </div>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#0f2240] mb-3">
                        Livraison partout dans le monde
                    </h1>
                    <p className="text-stone-500 max-w-xl mx-auto text-base leading-relaxed">
                        Nous livrons dans <strong>9 pays européens</strong> en livraison standard et{' '}
                        <strong>partout dans le monde sur demande</strong> avec un tarif personnalisé.
                    </p>
                </div>

                {/* ── Standard countries ── */}
                <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Truck size={18} className="text-[#1e3a5f]" />
                        <h2 className="font-semibold text-stone-800">Pays en livraison standard</h2>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        {STANDARD_COUNTRIES.map(c => (
                            <span
                                key={c.name}
                                className="inline-flex items-center gap-2 bg-[#fdf8f0] border border-[#c9a84c]/30 text-stone-700 px-3 py-2 rounded-lg text-sm font-medium"
                            >
                                <span className="text-lg leading-none">{c.flag}</span> {c.name}
                            </span>
                        ))}
                    </div>
                    <p className="text-stone-400 text-sm mt-4 flex items-center gap-1.5">
                        <MapPin size={13} />
                        Pour ces pays, procédez directement au{' '}
                        <Link href={route('cart.index')} className="text-[#1e3a5f] hover:underline font-medium">
                            paiement en ligne
                        </Link>
                        .
                    </p>
                </div>

                {/* ── Worldwide notice ── */}
                <div className="bg-gradient-to-r from-[#1e3a5f] to-[#0f2240] rounded-2xl p-6 mb-8 text-white">
                    <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-[#c9a84c] rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Globe size={20} className="text-white" />
                        </div>
                        <div>
                            <h2 className="font-bold text-lg mb-1">Livraison mondiale sur demande</h2>
                            <p className="text-stone-300 text-sm leading-relaxed">
                                Vous habitez en dehors des pays listés ci-dessus ? Pas de problème. Remplissez
                                le formulaire ci-dessous avec votre panier et votre pays — nous vous enverrons
                                rapidement un <strong className="text-white">tarif personnalisé par WhatsApp ou email</strong>.
                            </p>
                            <div className="mt-4 flex flex-wrap gap-3">
                                <a
                                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    <MessageSquare size={16} />
                                    Commande urgente via WhatsApp
                                </a>
                                <a
                                    href="mailto:contact@librairietaous.com"
                                    className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                                >
                                    <Mail size={16} />
                                    Envoyer un email
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">

                    {/* ── Cart summary ── */}
                    <div>
                        <h2 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                            <ShoppingBag size={18} className="text-[#1e3a5f]" /> Votre panier
                        </h2>

                        {cart.length === 0 ? (
                            <div className="bg-white rounded-xl border border-stone-100 p-6 text-center">
                                <ShoppingBag size={36} className="text-stone-300 mx-auto mb-3" />
                                <p className="text-stone-500 text-sm mb-4">Votre panier est vide.</p>
                                <Link href={route('shop.index')} className="btn-primary text-sm">
                                    Découvrir nos livres
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {cart.map(item => (
                                    <div key={item.id} className="bg-white rounded-xl border border-stone-100 p-4 flex gap-3 items-center">
                                        <img
                                            src={item.image || '/images/product-placeholder.jpg'}
                                            alt={item.product_name}
                                            className="w-12 h-16 object-cover rounded-lg flex-shrink-0"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-stone-800 text-sm line-clamp-2">{item.product_name}</p>
                                            {item.authors && <p className="text-stone-400 text-xs">{item.authors}</p>}
                                        </div>
                                        <div className="text-right flex-shrink-0">
                                            <p className="font-bold text-[#1e3a5f] text-sm">
                                                {money(Number(item.price) * item.quantity)} €
                                            </p>
                                            <p className="text-stone-400 text-xs">x{item.quantity}</p>
                                        </div>
                                    </div>
                                ))}

                                <div className="bg-[#fdf8f0] border border-[#c9a84c]/30 rounded-xl p-4 flex justify-between items-center">
                                    <span className="text-stone-700 font-semibold text-sm flex items-center gap-1.5">
                                        <Package size={15} /> Sous-total articles
                                    </span>
                                    <span className="font-bold text-[#1e3a5f]">{money(subtotal)} €</span>
                                </div>
                                <p className="text-stone-400 text-xs px-1">
                                    + frais de livraison à définir selon votre pays (communiqués sous 24h)
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ── Request form ── */}
                    <div>
                        <h2 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
                            <Send size={18} className="text-[#1e3a5f]" /> Demande de devis livraison
                        </h2>

                        {submitted ? (
                            <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                                <h3 className="font-bold text-green-800 text-lg mb-2">Demande envoyée !</h3>
                                <p className="text-green-700 text-sm leading-relaxed mb-6">
                                    Nous avons bien reçu votre demande. Vous recevrez un tarif personnalisé
                                    rapidement par <strong>WhatsApp ou email</strong>.
                                </p>
                                <a
                                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white px-5 py-3 rounded-xl font-semibold text-sm transition-colors"
                                >
                                    <MessageSquare size={16} />
                                    Suivre sur WhatsApp
                                </a>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-100 p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-sm font-medium text-stone-700 mb-1">
                                            Nom complet <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={form.name}
                                            onChange={set('name')}
                                            required
                                            placeholder="Votre nom"
                                            className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f] transition-colors"
                                        />
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-sm font-medium text-stone-700 mb-1">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            onChange={set('email')}
                                            required
                                            placeholder="votre@email.com"
                                            className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f] transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-sm font-medium text-stone-700 mb-1">
                                            Téléphone / WhatsApp
                                        </label>
                                        <div className="relative">
                                            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                                            <input
                                                type="tel"
                                                value={form.phone}
                                                onChange={set('phone')}
                                                placeholder="+1 234 567 890"
                                                className="w-full border border-stone-200 rounded-lg pl-8 pr-3 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f] transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-sm font-medium text-stone-700 mb-1">
                                            Pays de livraison <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={form.country}
                                            onChange={set('country')}
                                            required
                                            placeholder="Ex : Canada, Maroc, USA…"
                                            className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f] transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">
                                        Message (optionnel)
                                    </label>
                                    <textarea
                                        value={form.message}
                                        onChange={set('message')}
                                        rows={3}
                                        placeholder="Informations complémentaires, délai souhaité…"
                                        className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1e3a5f] transition-colors resize-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] text-white py-3.5 rounded-xl font-bold text-sm hover:bg-[#2d5a8e] transition-colors disabled:opacity-60"
                                >
                                    <Send size={16} />
                                    {loading ? 'Envoi en cours…' : 'Envoyer ma demande'}
                                    {!loading && <ChevronRight size={16} />}
                                </button>

                                <div className="text-center">
                                    <span className="text-stone-400 text-xs">ou pour une commande urgente — </span>
                                    <a
                                        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-[#25D366] font-semibold text-xs hover:underline"
                                    >
                                        <MessageSquare size={12} /> contacter via WhatsApp
                                    </a>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
