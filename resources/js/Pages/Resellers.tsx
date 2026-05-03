import { useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ChevronRight, Building, Percent, Package, CheckCircle } from 'lucide-react';

export default function Resellers() {
    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        business_name: '',
        contact_name: '',
        email: '',
        phone: '',
        city: '',
        message: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('resellers.request'));
    };

    return (
        <MainLayout title="Revendeurs & Grossistes — Éditions Taous">
            {/* Hero */}
            <section className="bg-gradient-to-r from-[#1a2e4a] to-[#1a4731] py-16">
                <div className="max-w-4xl mx-auto px-4 text-center text-white">
                    <div className="inline-block bg-[#c9a84c] text-white text-sm font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
                        Éditions Taous
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
                        Devenez revendeur
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto">
                        Profitez de conditions professionnelles avantageuses sur les publications des Éditions Taous. Idéal pour les librairies, associations et particuliers.
                    </p>
                </div>
            </section>

            {/* Pricing tiers */}
            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-3xl font-serif font-bold text-[#0f2b1c] text-center mb-12">Tarifs dégressifs Éditions Taous</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { qty: '1 à 4', label: 'Prix public', discount: '0%', color: 'border-stone-200', icon: <Package size={28} /> },
                            { qty: '5 à 14', label: 'Revendeur', discount: '-40%', color: 'border-[#1a4731]', icon: <Percent size={28} />, featured: true },
                            { qty: '15+', label: 'Grossiste', discount: '-50%', color: 'border-[#c9a84c]', icon: <Building size={28} /> },
                        ].map((tier, i) => (
                            <div key={i} className={`rounded-2xl border-2 ${tier.color} p-8 text-center ${tier.featured ? 'bg-[#fdf8f0] shadow-lg scale-105' : ''}`}>
                                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 ${tier.featured ? 'bg-[#1a4731] text-white' : 'bg-stone-100 text-[#1a4731]'}`}>
                                    {tier.icon}
                                </div>
                                <div className="text-stone-500 text-sm mb-2">{tier.qty} exemplaires</div>
                                <div className="text-2xl font-bold text-[#0f2b1c] mb-1">{tier.label}</div>
                                <div className={`text-3xl font-serif font-bold mb-4 ${tier.discount !== '0%' ? 'text-[#1a4731]' : 'text-stone-400'}`}>{tier.discount}</div>
                                {tier.featured && (
                                    <div className="bg-[#1a4731] text-white text-xs font-bold px-3 py-1 rounded-full">
                                        Le plus populaire
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16 bg-[#fdf8f0]">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-serif font-bold text-[#0f2b1c] text-center mb-10">Avantages revendeurs</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            'Accès aux tarifs professionnels dès approbation',
                            'Facturation simplifiée pour associations et structures',
                            'Livraison groupée possible (réduction des frais)',
                            'Nouveautés annoncées en avant-première',
                            'Matériel promotionnel fourni sur demande',
                            'Compte dédié avec historique et factures',
                        ].map((benefit, i) => (
                            <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4">
                                <CheckCircle size={18} className="text-[#1a4731] flex-shrink-0 mt-0.5" />
                                <span className="text-stone-700 text-sm">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form */}
            <section className="py-16">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-2xl border border-stone-100 p-8">
                        <h2 className="text-2xl font-serif font-bold text-[#0f2b1c] mb-2">Demande de compte revendeur</h2>
                        <p className="text-stone-500 text-sm mb-8">Remplissez ce formulaire et nous vous contacterons sous 48h.</p>

                        {wasSuccessful ? (
                            <div className="text-center py-8">
                                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-stone-800 mb-2">Demande envoyée !</h3>
                                <p className="text-stone-500">Nous examinerons votre dossier et vous contacterons sous 48h.</p>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Structure / Entreprise *</label>
                                        <input type="text" value={data.business_name} onChange={e => setData('business_name', e.target.value)}
                                            className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731]"
                                            placeholder="Association Al-Furqan" />
                                        {errors.business_name && <p className="text-red-500 text-xs mt-1">{errors.business_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Votre nom *</label>
                                        <input type="text" value={data.contact_name} onChange={e => setData('contact_name', e.target.value)}
                                            className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731]"
                                            placeholder="Mohammed Dupont" />
                                        {errors.contact_name && <p className="text-red-500 text-xs mt-1">{errors.contact_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
                                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                            className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731]"
                                            placeholder="contact@asso.fr" />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Téléphone</label>
                                        <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)}
                                            className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731]"
                                            placeholder="+33 6 00 00 00 00" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Ville</label>
                                    <input type="text" value={data.city} onChange={e => setData('city', e.target.value)}
                                        className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731]"
                                        placeholder="Paris" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Message (optionnel)</label>
                                    <textarea value={data.message} onChange={e => setData('message', e.target.value)} rows={3}
                                        className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731] resize-none"
                                        placeholder="Présentez votre activité, volume de commandes prévu..." />
                                </div>
                                <button type="submit" disabled={processing}
                                    className="w-full flex items-center justify-center gap-2 bg-[#1a4731] text-white py-4 rounded-lg font-semibold hover:bg-[#2d7a52] transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Envoi...' : 'Envoyer ma demande'} <ChevronRight size={18} />
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
