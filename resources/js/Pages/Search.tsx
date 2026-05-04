import { useState } from 'react';
import { router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import { Search as SearchIcon } from 'lucide-react';
import { Product, PaginatedData } from '@/types';

interface SearchProps {
    products: PaginatedData<Product>;
    query: string;
}

export default function Search({ products, query }: SearchProps) {
    const [searchQuery, setSearchQuery] = useState(query || '');

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.get(route('search'), { q: searchQuery }, { preserveState: true });
        }
    };

    return (
        <MainLayout title={query ? `Recherche : ${query}` : 'Recherche'}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Search bar */}
                <div className="max-w-2xl mx-auto mb-10">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Rechercher un livre, auteur, éditeur..."
                            className="w-full pl-5 pr-14 py-4 border-2 border-stone-200 rounded-xl text-base focus:outline-none focus:border-[#1a4731] transition-colors"
                            autoFocus
                        />
                        <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-[#1a4731] text-white rounded-lg flex items-center justify-center hover:bg-[#2d7a52] transition-colors">
                            <SearchIcon size={18} />
                        </button>
                    </form>
                </div>

                {query && (
                    <div className="mb-6">
                        <h1 className="text-2xl font-serif font-bold text-[#0f2b1c]">
                            Résultats pour "{query}"
                        </h1>
                        <p className="text-stone-500 mt-1">{products?.total || 0} résultat{(products?.total || 0) > 1 ? 's' : ''}</p>
                    </div>
                )}

                {products?.data?.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                        {products.data.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : query ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🔍</div>
                        <h2 className="text-xl font-semibold text-stone-700 mb-2">Aucun résultat</h2>
                        <p className="text-stone-500">Essayez d'autres mots-clés ou parcourez notre catalogue</p>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📚</div>
                        <p className="text-stone-500">Tapez un mot-clé pour rechercher dans notre catalogue</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
