import { useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ChevronRight, Building, Percent, Package, CheckCircle, TrendingUp, Shield, Zap, MessageSquare } from 'lucide-react';

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
            <section className="bg-gradient-to-br from-[#0f2240] via-[#1e3a5f] to-[#1a4a7a] py-20">
                <div className="max-w-4xl mx-auto px-4 text-center text-white">
                    <div className="inline-flex items-center gap-2 bg-[#c9a84c] text-white text-sm font-bold px-5 py-2 rounded-full mb-8 uppercase tracking-wider">
                        <TrendingUp size={14} /> Opportunité revendeur
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
                        Développez votre activité<br />avec les Éditions Taous
                    </h1>
                    <p className="text-white/80 text-lg max-w-2xl mx-auto mb-8">
                        Librairie, association, vendeur en ligne ou particulier actif — rejoignez notre réseau de revendeurs et accédez à des tarifs professionnels sur nos publications islamiques de qualité.
                    </p>
                    <a
                        href="#demande"
                        className="inline-flex items-center gap-2 bg-[#c9a84c] hover:bg-[#e8c97a] text-white font-bold px-8 py-4 rounded-xl text-base transition-colors"
                    >
                        Faire une demande de compte revendeur <ChevronRight size={18} />
                    </a>
                </div>
            </section>

            {/* Why become a reseller */}
            <section className="py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-[#0f2240] mb-3">
                            Une opportunité réelle pour votre activité
                        </h2>
                        <p className="text-stone-500 max-w-2xl mx-auto">
                            La demande en livres islamiques de qualité est forte et croissante. En devenant revendeur Éditions Taous, vous proposez des ouvrages fiables, reconnus et appréciés par votre communauté.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            {
                                icon: <Zap size={24} />,
                                title: 'Accès immédiat aux stocks',
                                desc: 'Commandez quand vous voulez, avec des délais d\'expédition rapides et des livraisons groupées disponibles.',
                            },
                            {
                                icon: <Shield size={24} />,
                                title: 'Produits fiables & certifiés',
                                desc: 'Nos ouvrages sont soigneusement sélectionnés et édités. Vous vendez avec confiance, votre clientèle achète sereinement.',
                            },
                            {
                                icon: <TrendingUp size={24} />,
                                title: 'Marges attractives',
                                desc: 'Des remises jusqu\'à -60% sur nos tarifs publics vous permettent de proposer des prix compétitifs tout en dégageant une vraie marge.',
                            },
                        ].map((item, i) => (
                            <div key={i} className="bg-[#f8f6f2] rounded-2xl p-6">
                                <div className="w-12 h-12 bg-[#1e3a5f] text-white rounded-xl flex items-center justify-center mb-4">
                                    {item.icon}
                                </div>
                                <h3 className="font-bold text-[#0f2240] text-base mb-2">{item.title}</h3>
                                <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing tiers */}
            <section className="py-16 bg-[#fdf8f0]">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-[#0f2240] mb-3">Tarifs dégressifs Éditions Taous</h2>
                        <p className="text-stone-500">Plus vous commandez, plus vos marges sont élevées.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mb-8">
                        {[
                            {
                                qty: '1 à 4',
                                label: 'Prix public',
                                discount: '0%',
                                color: 'border-stone-200',
                                icon: <Package size={28} />,
                                desc: 'Tarif boutique standard',
                            },
                            {
                                qty: '5 à 14',
                                label: 'Revendeur',
                                discount: '-50%',
                                color: 'border-[#1e3a5f]',
                                icon: <Percent size={28} />,
                                featured: true,
                                desc: 'Idéal pour librairies et associations',
                            },
                            {
                                qty: '15+',
                                label: 'Grossiste',
                                discount: '-60%',
                                color: 'border-[#c9a84c]',
                                icon: <Building size={28} />,
                                desc: 'Pour les commandes importantes',
                            },
                        ].map((tier, i) => (
                            <div key={i} className={`rounded-2xl border-2 ${tier.color} p-8 text-center bg-white ${tier.featured ? 'shadow-xl scale-105' : ''}`}>
                                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 ${tier.featured ? 'bg-[#1e3a5f] text-white' : 'bg-stone-100 text-[#1e3a5f]'}`}>
                                    {tier.icon}
                                </div>
                                <div className="text-stone-500 text-sm mb-2">{tier.qty} exemplaires</div>
                                <div className="text-2xl font-bold text-[#0f2240] mb-1">{tier.label}</div>
                                <div className={`text-4xl font-serif font-bold mb-3 ${tier.discount !== '0%' ? 'text-[#c9a84c]' : 'text-stone-300'}`}>
                                    {tier.discount}
                                </div>
                                <p className="text-stone-400 text-xs">{tier.desc}</p>
                                {tier.featured && (
                                    <div className="mt-4 bg-[#1e3a5f] text-white text-xs font-bold px-3 py-1 rounded-full inline-block">
                                        Le plus populaire
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Large orders note */}
                    <div className="bg-white border border-[#c9a84c]/40 rounded-2xl p-6 flex items-start gap-4">
                        <div className="w-10 h-10 bg-[#c9a84c]/15 rounded-xl flex items-center justify-center flex-shrink-0">
                            <MessageSquare size={18} className="text-[#c9a84c]" />
                        </div>
                        <div>
                            <p className="font-semibold text-[#0f2240] mb-1">Grosses commandes ? Conditions sur mesure.</p>
                            <p className="text-stone-500 text-sm">
                                Pour les commandes très importantes ou les partenariats à long terme, des conditions encore plus avantageuses sont possibles.
                                Mentionnez-le dans votre message lors de votre demande — nous étudions chaque situation au cas par cas.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits */}
            <section className="py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <h2 className="text-3xl font-serif font-bold text-[#0f2240] text-center mb-10">Ce que vous obtenez</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            'Tarifs professionnels dès validation de votre compte',
                            'Accès prioritaire aux nouveautés avant mise en vente publique',
                            'Livraison groupée disponible pour réduire les frais',
                            'Facturation simplifiée pour associations et structures',
                            'Matériel promotionnel fourni sur demande',
                            'Compte dédié avec historique de commandes et factures',
                            'Accompagnement personnalisé par notre équipe',
                            'Produits soigneusement sélectionnés, fiables et reconnus',
                        ].map((benefit, i) => (
                            <div key={i} className="flex items-start gap-3 bg-[#f8f6f2] rounded-xl p-4">
                                <CheckCircle size={18} className="text-[#1e3a5f] flex-shrink-0 mt-0.5" />
                                <span className="text-stone-700 text-sm">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Form */}
            <section id="demande" className="py-16 bg-[#fdf8f0]">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-8 md:p-10">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1e3a5f] rounded-xl mb-4">
                                <Building size={24} className="text-white" />
                            </div>
                            <h2 className="text-2xl font-serif font-bold text-[#0f2240] mb-2">
                                Faire une demande de compte revendeur
                            </h2>
                            <p className="text-stone-500 text-sm">
                                Remplissez ce formulaire et nous vous contacterons sous 48h pour valider votre accès.
                            </p>
                        </div>

                        {wasSuccessful ? (
                            <div className="text-center py-8">
                                <CheckCircle size={56} className="text-green-500 mx-auto mb-4" />
                                <h3 className="text-xl font-bold text-stone-800 mb-2">Demande envoyée !</h3>
                                <p className="text-stone-500">Nous examinerons votre dossier et vous contacterons sous 48h.</p>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Structure / Entreprise *</label>
                                        <input
                                            type="text"
                                            value={data.business_name}
                                            onChange={e => setData('business_name', e.target.value)}
                                            className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f]"
                                            placeholder="Association Al-Furqan"
                                        />
                                        {errors.business_name && <p className="text-red-500 text-xs mt-1">{errors.business_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Votre nom *</label>
                                        <input
                                            type="text"
                                            value={data.contact_name}
                                            onChange={e => setData('contact_name', e.target.value)}
                                            className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f]"
                                            placeholder="Mohammed Dupont"
                                        />
                                        {errors.contact_name && <p className="text-red-500 text-xs mt-1">{errors.contact_name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f]"
                                            placeholder="contact@asso.fr"
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Téléphone</label>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={e => setData('phone', e.target.value)}
                                            className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f]"
                                            placeholder="+33 6 00 00 00 00"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Ville</label>
                                    <input
                                        type="text"
                                        value={data.city}
                                        onChange={e => setData('city', e.target.value)}
                                        className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f]"
                                        placeholder="Paris"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Message (optionnel)</label>
                                    <textarea
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                        rows={4}
                                        className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] resize-none"
                                        placeholder="Présentez votre activité, volume de commandes prévu, ou demandez des conditions pour grosses commandes..."
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full flex items-center justify-center gap-2 bg-[#c9a84c] hover:bg-[#b8963e] text-white py-4 rounded-xl font-bold text-base transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Envoi en cours...' : 'Faire une demande de compte revendeur'}
                                    {!processing && <ChevronRight size={18} />}
                                </button>
                                <p className="text-center text-xs text-stone-400">
                                    Réponse garantie sous 48h ouvrées.
                                </p>
                            </form>
                        )}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
