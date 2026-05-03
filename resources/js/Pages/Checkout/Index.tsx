import { useState, ReactNode } from 'react';
import { usePage } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ShieldCheck, Lock, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { CartItem, CartSummary, ShippingRate, Address, PageProps } from '@/types';

interface CheckoutIndexProps {
    cart: CartItem[];
    summary: CartSummary;
    shippingRates?: ShippingRate[];
    savedAddresses?: Address[];
}

const COUNTRIES = [
    { code: 'FR', name: 'France' },
    { code: 'BE', name: 'Belgique' },
    { code: 'CH', name: 'Suisse' },
    { code: 'LU', name: 'Luxembourg' },
    { code: 'DE', name: 'Allemagne' },
    { code: 'ES', name: 'Espagne' },
    { code: 'IT', name: 'Italie' },
    { code: 'NL', name: 'Pays-Bas' },
    { code: 'GB', name: 'Royaume-Uni' },
    { code: 'MA', name: 'Maroc' },
    { code: 'DZ', name: 'Algérie' },
    { code: 'TN', name: 'Tunisie' },
];

interface FormFieldProps {
    label: string;
    error?: string;
    children: ReactNode;
}

function FormField({ label, error, children }: FormFieldProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">{label}</label>
            {children}
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </div>
    );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type?: string;
}

function Input({ type = 'text', ...props }: InputProps) {
    return (
        <input
            type={type}
            className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a4731] focus:ring-1 focus:ring-[#1a4731]/20 transition-colors"
            {...props}
        />
    );
}

interface ShippingAddress {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    company: string;
    address_line1: string;
    address_line2: string;
    city: string;
    postal_code: string;
    country: string;
}

export default function CheckoutIndex({ cart, summary, shippingRates, savedAddresses }: CheckoutIndexProps) {
    const { auth } = usePage<PageProps>().props;

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        first_name: auth?.user?.name?.split(' ')[0] || '',
        last_name: auth?.user?.name?.split(' ').slice(1).join(' ') || '',
        email: auth?.user?.email || '',
        phone: '',
        company: '',
        address_line1: '',
        address_line2: '',
        city: '',
        postal_code: '',
        country: 'FR',
    });
    const [selectedShipping, setSelectedShipping] = useState<number | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateAddress = () => {
        const required: (keyof ShippingAddress)[] = ['first_name', 'last_name', 'email', 'address_line1', 'city', 'postal_code', 'country'];
        const newErrors: Record<string, string> = {};
        required.forEach(field => {
            if (!shippingAddress[field]) newErrors[field] = 'Ce champ est requis';
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextStep = async () => {
        if (step === 1) {
            if (!validateAddress()) { toast.error('Veuillez remplir tous les champs requis'); return; }
            try {
                await axios.post(route('checkout.shipping-rates'), { country: shippingAddress.country });
            } catch { /* continue */ }
            setStep(2);
        } else if (step === 2) {
            if (!selectedShipping) { toast.error('Veuillez choisir un mode de livraison'); return; }
            setStep(3);
        }
    };

    const handlePlaceOrder = async () => {
        setLoading(true);
        try {
            const { data } = await axios.post(route('checkout.create-payment-intent'), {
                shipping_address: shippingAddress,
                shipping_rate_id: selectedShipping,
            });
            window.location.href = route('checkout.payment', { order: data.order_number });
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            toast.error(axiosErr.response?.data?.message || 'Erreur lors de la création de la commande');
            setLoading(false);
        }
    };

    const steps = [
        { num: 1, label: 'Livraison' },
        { num: 2, label: 'Transport' },
        { num: 3, label: 'Paiement' },
    ];

    return (
        <MainLayout title="Paiement">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Steps */}
                <div className="flex items-center justify-center mb-10">
                    {steps.map((s, i) => (
                        <div key={s.num} className="flex items-center">
                            <div className={`flex items-center gap-2 ${step >= s.num ? 'text-[#1a4731]' : 'text-stone-300'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step > s.num ? 'bg-[#1a4731] text-white' : step === s.num ? 'border-2 border-[#1a4731] text-[#1a4731]' : 'border-2 border-stone-200 text-stone-300'}`}>
                                    {step > s.num ? '✓' : s.num}
                                </div>
                                <span className="text-sm font-medium hidden sm:block">{s.label}</span>
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`w-16 sm:w-24 h-0.5 mx-3 ${step > s.num ? 'bg-[#1a4731]' : 'bg-stone-200'}`} />
                            )}
                        </div>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main */}
                    <div className="lg:col-span-2">
                        {/* Step 1: Shipping Address */}
                        {step >= 1 && (
                            <div className={`bg-white rounded-xl border p-6 mb-4 ${step !== 1 ? 'border-green-200 bg-green-50/30' : 'border-stone-100'}`}>
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="font-serif font-bold text-lg text-stone-800">1. Adresse de livraison</h2>
                                    {step > 1 && (
                                        <button onClick={() => setStep(1)} className="text-sm text-[#1a4731] hover:underline">Modifier</button>
                                    )}
                                </div>

                                {step === 1 ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        <FormField label="Prénom *" error={errors.first_name}>
                                            <Input value={shippingAddress.first_name} onChange={e => setShippingAddress({...shippingAddress, first_name: e.target.value})} />
                                        </FormField>
                                        <FormField label="Nom *" error={errors.last_name}>
                                            <Input value={shippingAddress.last_name} onChange={e => setShippingAddress({...shippingAddress, last_name: e.target.value})} />
                                        </FormField>
                                        <FormField label="Email *" error={errors.email}>
                                            <Input type="email" value={shippingAddress.email} onChange={e => setShippingAddress({...shippingAddress, email: e.target.value})} />
                                        </FormField>
                                        <FormField label="Téléphone">
                                            <Input value={shippingAddress.phone} onChange={e => setShippingAddress({...shippingAddress, phone: e.target.value})} placeholder="+33..." />
                                        </FormField>
                                        <FormField label="Adresse *" error={errors.address_line1}>
                                            <Input value={shippingAddress.address_line1} onChange={e => setShippingAddress({...shippingAddress, address_line1: e.target.value})} />
                                        </FormField>
                                        <FormField label="Complément d'adresse">
                                            <Input value={shippingAddress.address_line2} onChange={e => setShippingAddress({...shippingAddress, address_line2: e.target.value})} />
                                        </FormField>
                                        <FormField label="Ville *" error={errors.city}>
                                            <Input value={shippingAddress.city} onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})} />
                                        </FormField>
                                        <FormField label="Code postal *" error={errors.postal_code}>
                                            <Input value={shippingAddress.postal_code} onChange={e => setShippingAddress({...shippingAddress, postal_code: e.target.value})} />
                                        </FormField>
                                        <FormField label="Pays *" error={errors.country}>
                                            <select
                                                value={shippingAddress.country}
                                                onChange={e => setShippingAddress({...shippingAddress, country: e.target.value})}
                                                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a4731]"
                                            >
                                                {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
                                            </select>
                                        </FormField>

                                        <div className="col-span-2 pt-2">
                                            <button onClick={handleNextStep} className="w-full flex items-center justify-center gap-2 bg-[#1a4731] text-white py-3.5 rounded-lg font-semibold hover:bg-[#2d7a52] transition-colors">
                                                Continuer vers la livraison <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-sm text-stone-600">
                                        <p className="font-medium">{shippingAddress.first_name} {shippingAddress.last_name}</p>
                                        <p>{shippingAddress.address_line1}</p>
                                        <p>{shippingAddress.postal_code} {shippingAddress.city}, {shippingAddress.country}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 2: Shipping Method */}
                        {step >= 2 && (
                            <div className={`bg-white rounded-xl border p-6 mb-4 ${step !== 2 ? 'border-green-200 bg-green-50/30' : 'border-stone-100'}`}>
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="font-serif font-bold text-lg text-stone-800">2. Mode de livraison</h2>
                                    {step > 2 && <button onClick={() => setStep(2)} className="text-sm text-[#1a4731] hover:underline">Modifier</button>}
                                </div>

                                {step === 2 ? (
                                    <div className="space-y-3">
                                        {(shippingRates || [
                                            { id: 1, name: 'Colissimo — Livraison standard', rate: 5.90, description: '3-5 jours ouvrés' },
                                            { id: 2, name: 'Chronopost — Livraison express', rate: 9.90, description: '1-2 jours ouvrés' },
                                        ]).map((rate) => (
                                            <label key={rate.id} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${selectedShipping === rate.id ? 'border-[#1a4731] bg-[#fdf8f0]' : 'border-stone-100 hover:border-stone-200'}`}>
                                                <input
                                                    type="radio"
                                                    name="shipping"
                                                    value={rate.id}
                                                    checked={selectedShipping === rate.id}
                                                    onChange={() => setSelectedShipping(rate.id)}
                                                    className="text-[#1a4731] focus:ring-[#1a4731]"
                                                />
                                                <div className="flex-1">
                                                    <div className="font-medium text-stone-800">{rate.name}</div>
                                                    {rate.description && <div className="text-stone-500 text-sm">{rate.description}</div>}
                                                </div>
                                                <div className="font-bold text-[#1a4731]">
                                                    {rate.rate === 0 ? 'Gratuit' : `${parseFloat(String(rate.rate)).toFixed(2)} €`}
                                                </div>
                                            </label>
                                        ))}

                                        <button onClick={handleNextStep} className="w-full flex items-center justify-center gap-2 bg-[#1a4731] text-white py-3.5 rounded-lg font-semibold hover:bg-[#2d7a52] transition-colors mt-4">
                                            Continuer vers le paiement <ChevronRight size={18} />
                                        </button>
                                    </div>
                                ) : selectedShipping && (
                                    <p className="text-sm text-stone-600">Mode de livraison sélectionné</p>
                                )}
                            </div>
                        )}

                        {/* Step 3: Payment */}
                        {step === 3 && (
                            <div className="bg-white rounded-xl border border-stone-100 p-6">
                                <h2 className="font-serif font-bold text-lg text-stone-800 mb-5">3. Paiement sécurisé</h2>

                                <div className="bg-[#fdf8f0] border border-[#c9a84c]/20 rounded-xl p-4 mb-6">
                                    <div className="flex items-center gap-3 text-[#1a4731] font-semibold mb-2">
                                        <Lock size={18} /> Paiement 100% sécurisé
                                    </div>
                                    <p className="text-stone-600 text-sm">
                                        Votre paiement est traité de façon sécurisée par Stripe. Nous n'avons jamais accès à vos données bancaires.
                                    </p>
                                    <div className="flex gap-2 mt-3">
                                        {['VISA', 'Mastercard', 'CB', 'Apple Pay'].map(p => (
                                            <span key={p} className="bg-white text-stone-600 text-xs px-2 py-1 rounded border border-stone-200 font-mono">{p}</span>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    onClick={handlePlaceOrder}
                                    disabled={loading}
                                    className="w-full flex items-center justify-center gap-2 bg-[#1a4731] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#2d7a52] transition-colors disabled:opacity-50"
                                >
                                    <ShieldCheck size={20} />
                                    {loading ? 'Traitement en cours...' : `Payer ${summary?.total?.toFixed(2)} €`}
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Summary Sidebar */}
                    <div>
                        <div className="bg-white rounded-xl border border-stone-100 p-5 sticky top-24">
                            <h3 className="font-semibold text-stone-800 mb-4">Votre commande</h3>

                            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                                {cart?.map((item) => (
                                    <div key={item.id} className="flex gap-3 text-sm">
                                        <img src={item.image || '/images/product-placeholder.jpg'} alt={item.product_name} className="w-12 h-16 object-cover rounded-lg flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-stone-700 font-medium truncate">{item.product_name}</p>
                                            <p className="text-stone-400">x{item.quantity}</p>
                                        </div>
                                        <span className="font-semibold text-stone-800 flex-shrink-0">
                                            {(item.price * item.quantity).toFixed(2)} €
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-stone-100 pt-4 space-y-2 text-sm">
                                <div className="flex justify-between text-stone-600">
                                    <span>Sous-total</span>
                                    <span>{summary?.subtotal?.toFixed(2)} €</span>
                                </div>
                                {summary?.coupon_discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Réduction</span>
                                        <span>-{summary.coupon_discount.toFixed(2)} €</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-stone-600">
                                    <span>Livraison</span>
                                    <span>{summary?.shipping === 0 ? 'Gratuite' : summary?.shipping ? `${summary.shipping.toFixed(2)} €` : 'À calculer'}</span>
                                </div>
                                <div className="flex justify-between font-bold text-base pt-2 border-t border-stone-100">
                                    <span>Total TTC</span>
                                    <span className="text-[#1a4731]">{summary?.total?.toFixed(2)} €</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
