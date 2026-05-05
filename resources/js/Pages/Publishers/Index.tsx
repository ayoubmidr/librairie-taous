import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { BookOpen, ArrowRight, Award } from 'lucide-react';
import { Publisher } from '@/types';

interface PublisherWithCount extends Publisher {
    products_count: number;
}

interface PublishersIndexProps {
    publishers: PublisherWithCount[];
}

export default function PublishersIndex({ publishers }: PublishersIndexProps) {
    const ourEditions = publishers.filter(p => p.is_our_editions);
    const otherPublishers = publishers.filter(p => !p.is_our_editions);

    return (
        <MainLayout title="Maisons d'édition islamiques">
            {/* Hero */}
            <section className="bg-gradient-to-br from-[#1a2e4a] to-[#1e3a5f] py-14">
                <div className="max-w-5xl mx-auto px-4 text-center text-white">
                    <p className="text-[#c9a84c] text-sm font-bold uppercase tracking-widest mb-3">Catalogue éditorial</p>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">Maisons d'édition</h1>
                    <p className="text-white/70 text-lg max-w-xl mx-auto">
                        Découvrez l'ensemble des éditeurs islamiques disponibles dans notre librairie.
                    </p>
                </div>
            </section>

            {/* Our Editions — featured */}
            {ourEditions.length > 0 && (
                <section className="bg-[#fdf8f0] border-b border-[#e8d9b5] py-14">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-8 h-8 bg-[#c9a84c] rounded-lg flex items-center justify-center">
                                <Award size={16} className="text-white" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-serif font-bold text-[#0f2240]">Nos éditions</h2>
                                <p className="text-stone-500 text-sm">Publications produites et sélectionnées par Librairie Taous</p>
                            </div>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ourEditions.map(publisher => (
                                <Link
                                    key={publisher.id}
                                    href={route('publishers.show', publisher.slug)}
                                    className="group bg-white rounded-2xl border-2 border-[#c9a84c]/30 p-6 hover:border-[#c9a84c] hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-start gap-4">
                                        {publisher.logo_url ? (
                                            <img
                                                src={publisher.logo_url}
                                                alt={publisher.name}
                                                className="w-16 h-16 object-contain rounded-xl flex-shrink-0"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 bg-gradient-to-br from-[#1e3a5f] to-[#2d5a8e] rounded-xl flex items-center justify-center flex-shrink-0">
                                                <BookOpen size={28} className="text-white" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs bg-[#c9a84c] text-white px-2 py-0.5 rounded-full font-bold">
                                                    Nos éditions
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-[#0f2240] text-base group-hover:text-[#1e3a5f] transition-colors leading-tight">
                                                {publisher.name}
                                            </h3>
                                            <p className="text-stone-400 text-sm mt-1">
                                                {publisher.products_count} publication{publisher.products_count > 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-[#1e3a5f] group-hover:gap-2 transition-all">
                                        Voir les livres <ArrowRight size={14} />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* All other publishers */}
            {otherPublishers.length > 0 && (
                <section className="py-14">
                    <div className="max-w-6xl mx-auto px-4">
                        <h2 className="text-2xl font-serif font-bold text-[#0f2240] mb-2">
                            {ourEditions.length > 0 ? 'Autres éditeurs disponibles' : 'Tous les éditeurs'}
                        </h2>
                        <p className="text-stone-500 text-sm mb-8">
                            {otherPublishers.length} maison{otherPublishers.length > 1 ? 's' : ''} d'édition référencée{otherPublishers.length > 1 ? 's' : ''}
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {otherPublishers.map(publisher => (
                                <Link
                                    key={publisher.id}
                                    href={route('publishers.show', publisher.slug)}
                                    className="group bg-white rounded-xl border border-stone-100 p-5 text-center hover:border-[#1e3a5f] hover:shadow-md transition-all"
                                >
                                    {publisher.logo_url ? (
                                        <img
                                            src={publisher.logo_url}
                                            alt={publisher.name}
                                            className="w-14 h-14 object-contain mx-auto mb-3 rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-14 h-14 bg-[#f5efe0] rounded-xl flex items-center justify-center mx-auto mb-3">
                                            <BookOpen size={24} className="text-[#1e3a5f]" />
                                        </div>
                                    )}
                                    <h3 className="font-semibold text-stone-800 text-sm group-hover:text-[#1e3a5f] transition-colors leading-tight">
                                        {publisher.name}
                                    </h3>
                                    <p className="text-stone-400 text-xs mt-1">
                                        {publisher.products_count} livre{publisher.products_count > 1 ? 's' : ''}
                                    </p>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {publishers.length === 0 && (
                <div className="max-w-6xl mx-auto px-4 py-20 text-center">
                    <BookOpen size={64} className="text-stone-200 mx-auto mb-4" />
                    <p className="text-stone-500">Aucune maison d'édition disponible pour le moment.</p>
                </div>
            )}
        </MainLayout>
    );
}
