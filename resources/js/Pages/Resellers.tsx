import { useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ChevronRight, Building, Percent, Package, CheckCircle, TrendingUp, ShieldCheck, Boxes, BadgePercent } from 'lucide-react';

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
            <section className="bg-gradient-to-br from-[#0f2240] via-[#1e3a5f] to-[#1a2e4a] py-20 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-20 w-72 h-72 border border-white/20 rounded-full" />
                    <div className="absolute -bottom-20 right-60 w-96 h-96 border border-white/10 rounded-full" />
                </div>
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <div className="inline-block bg-[#c9a84c] text-white text-sm font-bold px-5 py-2 rounded-full mb-8 uppercase tracking-widest">
                        Programme Revendeur — Éditions Taous
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
                        Une opportunité réelle pour<br />librairies et vendeurs
                    </h1>
                    <p className="text-stone-300 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                        Rejoignez notre réseau de revendeurs et accédez à des conditions professionnelles exclusives
                        sur les publications des Éditions Taous. Idéal pour les librairies, associations islamiques
                        et vendeurs particuliers.
                    </p>
                    <a href="#demande" className="inline-flex items-center gap-2 bg-[#c9a84c] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#e8c97a] transition-colors shadow-lg">
                        Faire une demande de compte revendeur <ChevronRight size={20} />
                    </a>
                </div>
            </section>

            {/* Tarifs dégressifs */}
            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-[#0f2240] mb-3">Tarifs dégressifs</h2>
                        <p className="text-stone-500">Plus vous commandez, plus vous économisez — jusqu'à 60% de réduction</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                qty: '1 à 4 exemplaires',
                                label: 'Prix public',
                                discount: '0%',
                                color: 'border-stone-200 bg-stone-50',
                                textColor: 'text-stone-400',
                                icon: <Package size={28} />,
                                iconBg: 'bg-stone-100 text-stone-500',
                                desc: 'Tarif standard sans engagement',
                            },
                            {
                                qty: '5 à 19 exemplaires',
                                label: 'Revendeur',
                                discount: '-50%',
                                color: 'border-[#1e3a5f] bg-white',
                                textColor: 'text-[#1e3a5f]',
                                icon: <Percent size={28} />,
                                iconBg: 'bg-[#1e3a5f] text-white',
                                featured: true,
                                desc: 'Parfait pour librairies et associations',
                            },
                            {
                                qty: '20 exemplaires et +',
                                label: 'Grossiste',
                                discount: '-60%',
                                color: 'border-[#c9a84c] bg-white',
                                textColor: 'text-[#c9a84c]',
                                icon: <Building size={28} />,
                                iconBg: 'bg-[#c9a84c]/10 text-[#c9a84c]',
                                desc: 'Conditions maximales pour gros volumes',
                            },
                        ].map((tier, i) => (
                            <div key={i} className={`rounded-2xl border-2 ${tier.color} p-8 text-center relative ${tier.featured ? 'shadow-xl scale-105' : ''}`}>
                                {tier.featured && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#1e3a5f] text-white text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap">
                                        Le plus populaire
                                    </div>
                                )}
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-5 ${tier.iconBg}`}>
                                    {tier.icon}
                                </div>
                                <div className="text-stone-500 text-sm font-medium mb-2">{tier.qty}</div>
                                <div className="text-xl font-bold text-[#0f2240] mb-2">{tier.label}</div>
                                <div className={`text-5xl font-serif font-bold mb-4 ${tier.textColor}`}>{tier.discount}</div>
                                <p className="text-stone-500 text-sm">{tier.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Note grosses commandes */}
                    <div className="mt-8 bg-[#fdf8f0] border border-[#c9a84c]/30 rounded-xl p-5 flex items-start gap-4">
                        <BadgePercent size={22} className="text-[#c9a84c] flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-semibold text-stone-800 text-sm">Très grosse commande ?</p>
                            <p className="text-stone-600 text-sm mt-0.5">
                                Pour les commandes exceptionnelles, des conditions encore plus avantageuses peuvent être
                                négociées sur demande directe. Mentionnez-le dans votre message lors de la demande.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Avantages */}
            <section className="py-16 bg-stone-50">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-[#0f2240] mb-3">Pourquoi devenir revendeur ?</h2>
                        <p className="text-stone-500">Des avantages concrets pour développer votre activité</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <TrendingUp size={28} />,
                                title: 'Prix avantageux',
                                desc: 'Jusqu\'à 60% de réduction sur le prix public. Une marge solide sur chaque vente, dès la première commande.',
                            },
                            {
                                icon: <Boxes size={28} />,
                                title: 'Accès aux stocks',
                                desc: 'Accès prioritaire aux stocks et aux nouveautés en avant-première avant la mise en vente au grand public.',
                            },
                            {
                                icon: <ShieldCheck size={28} />,
                                title: 'Produits fiables',
                                desc: 'Des livres islamiques de référence, vérifiés et édités avec soin par des spécialistes. Qualité garantie.',
                            },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl p-7 border border-stone-100 hover:border-[#1e3a5f]/20 hover:shadow-md transition-all">
                                <div className="w-14 h-14 bg-[#1e3a5f]/8 rounded-xl flex items-center justify-center mb-4 text-[#1e3a5f]">
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-stone-800 mb-2">{item.title}</h3>
                                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 grid md:grid-cols-2 gap-4">
                        {[
                            'Facturation simplifiée pour associations et structures',
                            'Livraison groupée avec réduction des frais de port',
                            'Compte dédié avec historique de commandes et factures',
                            'Matériel promotionnel fourni sur demande',
                            'Nouveautés annoncées en avant-première',
                            'Support dédié avec réponse prioritaire',
                        ].map((benefit, i) => (
                            <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 border border-stone-100">
                                <CheckCircle size={17} className="text-[#1e3a5f] flex-shrink-0 mt-0.5" />
                                <span className="text-stone-700 text-sm">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Formulaire */}
            <section id="demande" className="py-16 bg-white">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-serif font-bold text-[#0f2240] mb-3">Faire une demande de compte revendeur</h2>
                        <p className="text-stone-500">Remplissez ce formulaire et nous vous contacterons sous 48h ouvrées pour valider votre accès.</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8">
                        {wasSuccessful ? (
                            <div className="text-center py-10">
                                <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-serif font-bold text-stone-800 mb-2">Demande envoyée !</h3>
                                <p className="text-stone-500">Nous examinerons votre dossier et vous contacterons sous 48h ouvrées.</p>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Structure / Entreprise *</label>
                                        <input type="text" value={data.business_name} onChange={e => setData('business_name', e.target.value)}
                                            className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f]"
                                            placeholder="Association Al-Furqan" />
                                        {errors.business_name && <p className="text-red-500 text-xs mt-1">{errors.business_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Votre nom *</label>
                                        <input type="text" value={data.contact_name} onChange={e => setData('contact_name', e.target.value)}
                                            className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f]"
                                            placeholder="Mohammed Dupont" />
                                        {errors.contact_name && <p className="text-red-500 text-xs mt-1">{errors.contact_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
                                        <input type="email" value={data.email} onChange={e => setData('email', e.target.value)}
                                            className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f]"
                                            placeholder="contact@asso.fr" />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Téléphone</label>
                                        <input type="tel" value={data.phone} onChange={e => setData('phone', e.target.value)}
                                            className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f]"
                                            placeholder="+33 6 00 00 00 00" />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Ville</label>
                                    <input type="text" value={data.city} onChange={e => setData('city', e.target.value)}
                                        className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f]"
                                        placeholder="Paris" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Votre activité & volume prévu</label>
                                    <textarea value={data.message} onChange={e => setData('message', e.target.value)} rows={4}
                                        className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] resize-none"
                                        placeholder="Décrivez votre activité (librairie, association, vente en ligne...), le volume de commandes envisagé, et si vous souhaitez négocier des conditions pour de très grosses commandes." />
                                </div>
                                <button type="submit" disabled={processing}
                                    className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] text-white py-4 rounded-xl font-bold text-base hover:bg-[#2d5a8e] transition-colors disabled:opacity-50 shadow-md"
                                >
                                    {processing ? 'Envoi en cours...' : 'Faire une demande de compte revendeur'}
                                    {!processing && <ChevronRight size={20} />}
                                </button>
                                <p className="text-center text-xs text-stone-400">
                                    Réponse garantie sous 48h ouvrées — Aucun engagement avant validation
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
