import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { BookOpen, Star, ChevronRight } from 'lucide-react';
import { Publisher } from '@/types';

interface PublisherWithCount extends Publisher {
    products_count: number;
}

interface PublishersIndexProps {
    publishers: PublisherWithCount[];
}

const PUBLISHERS_LIST = [
    'Akhira', 'An Najm', 'Anas', 'Assia', 'Dar Al Mouwahiddin',
    'Dine Al Haqq', 'Éditions Lanterne', 'Éditions Wadi Shibam',
    'Ibn Badis', 'Islam Chronique', 'Kataba', "L'essor de l'âme",
    'Minhaj An-Nubuwwah', 'Pieux prédécesseurs', 'Tawbah',
];

export default function PublishersIndex({ publishers }: PublishersIndexProps) {
    const ourEditions = publishers.filter(p => p.is_our_editions);
    const otherPublishers = publishers.filter(p => !p.is_our_editions);

    return (
        <MainLayout title="Maisons d'édition islamiques">
            <div className="max-w-7xl mx-auto px-4 py-12">

                {/* Header */}
                <div className="text-center mb-14">
                    <h1 className="text-4xl font-serif font-bold text-[#0f2240] mb-4">Maisons d'édition</h1>
                    <p className="text-stone-500 text-lg max-w-xl mx-auto">
                        Découvrez notre maison d'édition et tous les éditeurs islamiques que nous référençons.
                    </p>
                </div>

                {/* NOS ÉDITIONS — mise en avant */}
                {ourEditions.length > 0 && (
                    <section className="mb-16">
                        <div className="flex items-center gap-3 mb-6">
                            <Star size={18} className="text-[#c9a84c] fill-[#c9a84c]" />
                            <h2 className="text-xl font-serif font-bold text-[#0f2240]">Nos propres éditions</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            {ourEditions.map(publisher => (
                                <Link
                                    key={publisher.id}
                                    href={route('publishers.show', publisher.slug)}
                                    className="group relative bg-gradient-to-br from-[#1e3a5f] to-[#0f2240] rounded-2xl p-8 flex items-center gap-6 hover:shadow-xl transition-all duration-300 overflow-hidden"
                                >
                                    {/* Décor */}
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                                    <div className="absolute bottom-0 left-20 w-24 h-24 bg-[#c9a84c]/10 rounded-full translate-y-1/2" />

                                    <div className="relative z-10 flex-shrink-0">
                                        {publisher.logo_url ? (
                                            <img src={publisher.logo_url} alt={publisher.name} className="w-20 h-20 object-contain rounded-xl bg-white/10 p-2" />
                                        ) : (
                                            <div className="w-20 h-20 bg-white/10 rounded-xl flex items-center justify-center">
                                                <BookOpen size={36} className="text-[#c9a84c]" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative z-10 flex-1 min-w-0">
                                        <span className="inline-block bg-[#c9a84c] text-white text-xs font-bold px-3 py-0.5 rounded-full mb-3 uppercase tracking-wider">
                                            Nos éditions
                                        </span>
                                        <h3 className="text-2xl font-serif font-bold text-white mb-1">{publisher.name}</h3>
                                        {publisher.description && (
                                            <p className="text-stone-300 text-sm line-clamp-2 mb-3">{publisher.description}</p>
                                        )}
                                        <div className="flex items-center justify-between">
                                            <span className="text-stone-300 text-sm">{publisher.products_count} publication{publisher.products_count > 1 ? 's' : ''}</span>
                                            <span className="text-[#c9a84c] text-sm font-semibold flex items-center gap-1 group-hover:gap-2 transition-all">
                                                Voir le catalogue <ChevronRight size={16} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}

                {/* AUTRES ÉDITEURS */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-serif font-bold text-[#0f2240]">Tous les éditeurs</h2>
                        <span className="text-stone-400 text-sm">{otherPublishers.length} maisons d'édition</span>
                    </div>

                    {/* Liste statique référencée */}
                    {otherPublishers.length === 0 && (
                        <div className="mb-8 bg-stone-50 rounded-2xl p-6">
                            <p className="text-stone-500 text-sm mb-4">Éditeurs référencés :</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                                {PUBLISHERS_LIST.map((name) => (
                                    <div key={name} className="bg-white rounded-lg border border-stone-100 px-3 py-2 text-sm text-stone-700 text-center">
                                        {name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {otherPublishers.map(publisher => (
                            <Link
                                key={publisher.id}
                                href={route('publishers.show', publisher.slug)}
                                className="group bg-white rounded-xl border border-stone-100 p-5 text-center hover:border-[#1e3a5f] hover:shadow-md transition-all duration-200"
                            >
                                {publisher.logo_url ? (
                                    <img src={publisher.logo_url} alt={publisher.name} className="w-14 h-14 object-contain mx-auto mb-3 rounded-lg" />
                                ) : (
                                    <div className="w-14 h-14 bg-stone-50 rounded-xl flex items-center justify-center mx-auto mb-3 group-hover:bg-[#1e3a5f]/5 transition-colors">
                                        <BookOpen size={24} className="text-stone-300 group-hover:text-[#1e3a5f] transition-colors" />
                                    </div>
                                )}
                                <h3 className="font-semibold text-stone-800 text-sm group-hover:text-[#1e3a5f] transition-colors leading-tight">
                                    {publisher.name}
                                </h3>
                                <p className="text-stone-400 text-xs mt-1">{publisher.products_count} livre{publisher.products_count > 1 ? 's' : ''}</p>
                            </Link>
                        ))}

                        {/* Cartes statiques si non encore en BDD */}
                        {otherPublishers.length > 0 && PUBLISHERS_LIST.filter(name =>
                            !otherPublishers.some(p => p.name.toLowerCase().includes(name.toLowerCase()))
                        ).map((name) => (
                            <div
                                key={name}
                                className="bg-stone-50 rounded-xl border border-stone-100 p-5 text-center opacity-60"
                            >
                                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <BookOpen size={24} className="text-stone-300" />
                                </div>
                                <h3 className="font-semibold text-stone-600 text-sm leading-tight">{name}</h3>
                                <p className="text-stone-400 text-xs mt-1">Bientôt disponible</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
