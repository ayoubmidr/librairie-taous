import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { BookOpen } from 'lucide-react';
import { Publisher } from '@/types';

interface PublisherWithCount extends Publisher {
    products_count: number;
}

interface PublishersIndexProps {
    publishers: PublisherWithCount[];
}

export default function PublishersIndex({ publishers }: PublishersIndexProps) {
    return (
        <MainLayout title="Maisons d'édition islamiques">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-[#0f2b1c] mb-4">Maisons d'édition</h1>
                    <p className="text-stone-500 text-lg">Découvrez les éditeurs islamiques que nous proposons</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {publishers.map(publisher => (
                        <Link
                            key={publisher.id}
                            href={route('publishers.show', publisher.slug)}
                            className="group bg-white rounded-xl border border-stone-100 p-6 text-center hover:border-[#1a4731] hover:shadow-md transition-all"
                        >
                            {publisher.logo_url ? (
                                <img src={publisher.logo_url} alt={publisher.name} className="w-16 h-16 object-contain mx-auto mb-4 rounded-lg" />
                            ) : (
                                <div className="w-16 h-16 bg-[#f5efe0] rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <BookOpen size={28} className="text-[#1a4731]" />
                                </div>
                            )}
                            <h3 className="font-semibold text-stone-800 text-sm group-hover:text-[#1a4731] transition-colors leading-tight">
                                {publisher.name}
                            </h3>
                            <p className="text-stone-400 text-xs mt-1">{publisher.products_count} livre{publisher.products_count > 1 ? 's' : ''}</p>
                            {publisher.is_our_editions && (
                                <span className="inline-block mt-2 text-xs bg-[#c9a84c] text-white px-2 py-0.5 rounded-full font-semibold">
                                    Nos éditions
                                </span>
                            )}
                        </Link>
                    ))}
                </div>
            </div>
        </MainLayout>
    );
}
