import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import { Package, Gift, Compass, ChevronRight, BookOpen, Sparkles, Tag, CheckCircle } from 'lucide-react';
import { PaginatedData, Product } from '@/types';

interface PacksProps {
    products: PaginatedData<Product>;
}

const PACK_TYPES = [
    {
        icon: <Compass size={28} />,
        title: 'Packs Thématiques',
        desc: 'Une sélection cohérente autour d\'un thème précis : croyance, fiqh, éducation, famille... Idéal pour approfondir un domaine.',
        color: 'from-[#1e3a5f] to-[#0f2240]',
        badge: 'Thématique',
        badgeBg: 'bg-[#c9a84c]',
    },
    {
        icon: <Sparkles size={28} />,
        title: 'Packs Découverte',
        desc: 'Parfait pour débuter ou offrir. Des livres accessibles et variés pour découvrir les différentes disciplines islamiques.',
        color: 'from-[#c9a84c] to-[#b8963e]',
        badge: 'Découverte',
        badgeBg: 'bg-[#1e3a5f]',
    },
    {
        icon: <Gift size={28} />,
        title: 'Packs Cadeaux',
        desc: 'Des ensembles soigneusement présentés, parfaits pour offrir à l\'occasion d\'un mariage, d\'une naissance ou d\'une fête.',
        color: 'from-[#2d5a8e] to-[#1e3a5f]',
        badge: 'Cadeau',
        badgeBg: 'bg-[#c9a84c]',
    },
];

const PACK_BENEFITS = [
    'Économisez par rapport à l\'achat séparé',
    'Sélection curatée par nos éditeurs',
    'Idéal pour offrir ou se constituer une bibliothèque',
    'Livraison groupée, frais réduits',
];

export default function Packs({ products }: PacksProps) {
    return (
        <MainLayout title="Packs & Lots — Librairie Taous">

            {/* Hero */}
            <section className="bg-gradient-to-br from-[#0f2240] via-[#1e3a5f] to-[#1a2e4a] py-16 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-8 right-24 w-64 h-64 border border-white/20 rounded-full" />
                    <div className="absolute -bottom-16 right-56 w-80 h-80 border border-white/10 rounded-full" />
                </div>
                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex-1">
                            <div className="inline-flex items-center gap-2 bg-[#c9a84c] text-white text-sm font-bold px-5 py-2 rounded-full mb-6 uppercase tracking-widest">
                                <Package size={16} /> Packs & Lots
                            </div>
                            <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4 leading-tight">
                                Constituez votre<br />bibliothèque islamique
                            </h1>
                            <p className="text-stone-300 text-lg leading-relaxed mb-6 max-w-xl">
                                Des ensembles soigneusement composés pour vous faire économiser et enrichir votre connaissance.
                                Thématiques, découverte ou cadeaux — il y en a pour tous.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {PACK_BENEFITS.map((b, i) => (
                                    <span key={i} className="flex items-center gap-1.5 bg-white/10 text-white/90 text-sm px-3 py-1.5 rounded-full">
                                        <CheckCircle size={13} className="text-[#c9a84c]" /> {b}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 flex-shrink-0">
                            {[
                                { value: products.total, label: 'Packs disponibles', suffix: '' },
                                { value: 60, label: 'De réduction max', suffix: '%' },
                            ].map((stat, i) => (
                                <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
                                    <div className="text-3xl font-serif font-bold text-[#c9a84c]">{stat.value}{stat.suffix}</div>
                                    <div className="text-stone-300 text-sm mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* 3 types de packs */}
            <section className="py-14 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-serif font-bold text-[#0f2240] mb-2">Trois types de packs</h2>
                        <p className="text-stone-500">Trouvez le pack qui correspond à votre besoin</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {PACK_TYPES.map((type, i) => (
                            <div key={i} className={`bg-gradient-to-br ${type.color} rounded-2xl p-7 text-white relative overflow-hidden`}>
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                <div className="relative z-10">
                                    <div className={`inline-flex items-center justify-center w-14 h-14 ${type.badgeBg}/20 rounded-xl mb-4`}>
                                        {type.icon}
                                    </div>
                                    <span className={`inline-block ${type.badgeBg} text-white text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider`}>
                                        {type.badge}
                                    </span>
                                    <h3 className="text-xl font-serif font-bold mb-3">{type.title}</h3>
                                    <p className="text-white/75 text-sm leading-relaxed">{type.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Grille produits */}
            <section className="py-14 bg-stone-50">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-serif font-bold text-[#0f2240]">Tous nos packs</h2>
                            <p className="text-stone-500 text-sm mt-1">{products.total} pack{products.total > 1 ? 's' : ''} disponible{products.total > 1 ? 's' : ''}</p>
                        </div>
                        <Link href={route('shop.index')} className="flex items-center gap-1 text-sm text-[#1e3a5f] font-semibold hover:underline">
                            <BookOpen size={15} /> Voir tout le catalogue
                        </Link>
                    </div>

                    {products.data.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5">
                                {products.data.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {products.last_page > 1 && (
                                <div className="mt-10 flex justify-center gap-2 flex-wrap">
                                    {Array.from({ length: products.last_page }, (_, i) => i + 1).map((page) => (
                                        <Link
                                            key={page}
                                            href={`${window.location.pathname}?page=${page}`}
                                            className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                                                page === products.current_page
                                                    ? 'bg-[#1e3a5f] text-white'
                                                    : 'border border-stone-200 text-stone-600 hover:bg-stone-50'
                                            }`}
                                        >
                                            {page}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-24 bg-white rounded-2xl border border-stone-100">
                            <Package size={56} className="text-stone-200 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-stone-700 mb-2">Packs bientôt disponibles</h3>
                            <p className="text-stone-400 mb-6">Nous préparons des packs exclusifs. Revenez bientôt !</p>
                            <Link href={route('shop.index')} className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2d5a8e] transition-colors">
                                <BookOpen size={16} /> Voir tous les livres
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Bannière revendeurs */}
            <section className="py-10 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-gradient-to-r from-[#fdf8f0] to-[#f5efe0] rounded-2xl p-8 border border-[#c9a84c]/20 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-[#c9a84c]/15 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Tag size={26} className="text-[#c9a84c]" />
                            </div>
                            <div>
                                <h3 className="font-serif font-bold text-[#0f2240] text-lg">Commande en gros ?</h3>
                                <p className="text-stone-600 text-sm mt-0.5">Librairies, associations, médersa — profitez de jusqu'à -60% sur les commandes groupées.</p>
                            </div>
                        </div>
                        <Link
                            href={route('resellers.index')}
                            className="flex-shrink-0 inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#2d5a8e] transition-colors"
                        >
                            Programme revendeur <ChevronRight size={18} />
                        </Link>
                    </div>
                </div>
            </section>

        </MainLayout>
    );
}
