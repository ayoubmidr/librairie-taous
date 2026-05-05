import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import { BookOpen, Gift, Compass, Tag, ShoppingBag } from 'lucide-react';
import { PaginatedData, Product } from '@/types';

interface PacksProps {
    products: PaginatedData<Product>;
}

const packTypes = [
    {
        icon: <Tag size={24} />,
        label: 'Packs Thématiques',
        desc: 'Des sélections cohérentes autour d\'un thème : croyance, fiqh, éducation... pour approfondir un sujet avec les meilleurs titres.',
        color: 'bg-[#1e3a5f]',
    },
    {
        icon: <Compass size={24} />,
        label: 'Packs Découverte',
        desc: 'Parfait pour débuter ou offrir. Une introduction variée et accessibleaux publications islamiques essentielles.',
        color: 'bg-[#2d5a8e]',
    },
    {
        icon: <Gift size={24} />,
        label: 'Packs Cadeaux',
        desc: 'Pensés pour offrir à une occasion spéciale : mariage, naissance, Aïd... Des sélections prêtes à offrir.',
        color: 'bg-[#c9a84c]',
    },
];

export default function Packs({ products }: PacksProps) {
    return (
        <MainLayout title="Packs & Lots — Librairie Taous">
            {/* Hero */}
            <section className="bg-gradient-to-br from-[#1a2e4a] to-[#1e3a5f] py-16">
                <div className="max-w-4xl mx-auto px-4 text-center text-white">
                    <div className="inline-flex items-center gap-2 bg-[#c9a84c] text-white text-sm font-bold px-5 py-2 rounded-full mb-6 uppercase tracking-wider">
                        <Gift size={14} /> Économisez en achetant groupé
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Packs & Lots</h1>
                    <p className="text-white/75 text-lg max-w-xl mx-auto">
                        Des sélections de livres pensées ensemble, à prix réduit. Plus vous lisez, moins vous payez.
                    </p>
                </div>
            </section>

            {/* Pack types */}
            <section className="bg-white py-14 border-b border-stone-100">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-2xl font-serif font-bold text-[#0f2240] text-center mb-10">Nos types de packs</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {packTypes.map((type, i) => (
                            <div key={i} className="text-center">
                                <div className={`w-14 h-14 ${type.color} rounded-xl flex items-center justify-center mx-auto mb-4 text-white`}>
                                    {type.icon}
                                </div>
                                <h3 className="font-bold text-[#0f2240] text-base mb-2">{type.label}</h3>
                                <p className="text-stone-500 text-sm leading-relaxed">{type.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Savings banner */}
            <div className="bg-[#fdf8f0] border-b border-[#e8d9b5] py-5">
                <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#c9a84c] rounded-lg flex items-center justify-center flex-shrink-0">
                            <ShoppingBag size={18} className="text-white" />
                        </div>
                        <div>
                            <p className="font-bold text-[#0f2240] text-sm">Économie garantie par rapport à l'achat individuel</p>
                            <p className="text-stone-500 text-xs">Le prix barré indique la valeur totale des livres achetés séparément.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Products grid */}
            <section className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-serif font-bold text-[#0f2240]">Tous nos packs</h2>
                        <p className="text-stone-500 text-sm mt-1">{products?.total || 0} pack{(products?.total || 0) > 1 ? 's' : ''} disponible{(products?.total || 0) > 1 ? 's' : ''}</p>
                    </div>
                </div>

                {products?.data?.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                            {products.data.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        {products.last_page > 1 && (
                            <div className="mt-10 flex justify-center gap-2">
                                {Array.from({ length: products.last_page }, (_, i) => i + 1).map((page) => (
                                    <Link
                                        key={page}
                                        href={`${route('shop.packs')}?page=${page}`}
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
                    <div className="text-center py-24">
                        <div className="flex justify-center mb-4">
                            <BookOpen size={64} className="text-stone-200" />
                        </div>
                        <h3 className="text-xl font-semibold text-stone-700 mb-2">Aucun pack disponible pour le moment</h3>
                        <p className="text-stone-400 mb-6">Revenez bientôt — de nouvelles sélections arrivent régulièrement.</p>
                        <Link
                            href={route('shop.index')}
                            className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2d5a8e] transition-colors"
                        >
                            Voir tous les livres
                        </Link>
                    </div>
                )}
            </section>
        </MainLayout>
    );
}
