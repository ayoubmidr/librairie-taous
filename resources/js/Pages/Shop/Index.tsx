import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import { ChevronDown, X, SlidersHorizontal } from 'lucide-react';
import { Category, PaginatedData, Product } from '@/types';

interface ActiveFilters {
    price?: string | null;
    category?: string | null;
    availability?: string | null;
    language?: string | null;
    [key: string]: string | null | undefined;
}

interface FilterSidebarProps {
    activeFilters: ActiveFilters;
    onFilterChange: (key: string, value: string | null) => void;
    categories: Category[];
}

function FilterSidebar({ activeFilters, onFilterChange, categories }: FilterSidebarProps) {
    return (
        <div className="space-y-6">
            {/* Prix */}
            <div>
                <h3 className="font-semibold text-stone-800 mb-3 flex items-center justify-between">
                    Prix
                    <ChevronDown size={14} />
                </h3>
                <div className="space-y-2">
                    {[
                        { label: 'Moins de 10€', value: '0-10' },
                        { label: '10€ — 20€', value: '10-20' },
                        { label: '20€ — 35€', value: '20-35' },
                        { label: 'Plus de 35€', value: '35-999' },
                    ].map((range) => (
                        <label key={range.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={activeFilters.price === range.value}
                                onChange={() => onFilterChange('price', activeFilters.price === range.value ? null : range.value)}
                                className="rounded border-stone-300 text-[#1a4731] focus:ring-[#1a4731]"
                            />
                            <span className="text-sm text-stone-600">{range.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Catégories */}
            {categories?.length > 0 && (
                <div>
                    <h3 className="font-semibold text-stone-800 mb-3">Catégorie</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                        {categories.map((cat) => (
                            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={activeFilters.category === cat.slug}
                                    onChange={() => onFilterChange('category', activeFilters.category === cat.slug ? null : cat.slug)}
                                    className="rounded border-stone-300 text-[#1a4731] focus:ring-[#1a4731]"
                                />
                                <span className="text-sm text-stone-600">{cat.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {/* Disponibilité */}
            <div>
                <h3 className="font-semibold text-stone-800 mb-3">Disponibilité</h3>
                <div className="space-y-2">
                    {[
                        { label: 'En stock', value: 'in_stock' },
                        { label: 'Précommande', value: 'preorder' },
                    ].map((opt) => (
                        <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={activeFilters.availability === opt.value}
                                onChange={() => onFilterChange('availability', activeFilters.availability === opt.value ? null : opt.value)}
                                className="rounded border-stone-300 text-[#1a4731] focus:ring-[#1a4731]"
                            />
                            <span className="text-sm text-stone-600">{opt.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Langue */}
            <div>
                <h3 className="font-semibold text-stone-800 mb-3">Langue</h3>
                <div className="space-y-2">
                    {[
                        { label: 'Français', value: 'fr' },
                        { label: 'Arabe', value: 'ar' },
                        { label: 'Bilingue', value: 'bilingual' },
                    ].map((lang) => (
                        <label key={lang.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={activeFilters.language === lang.value}
                                onChange={() => onFilterChange('language', activeFilters.language === lang.value ? null : lang.value)}
                                className="rounded border-stone-300 text-[#1a4731] focus:ring-[#1a4731]"
                            />
                            <span className="text-sm text-stone-600">{lang.label}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface ShopIndexProps {
    products: PaginatedData<Product>;
    categories: Category[];
    filters: ActiveFilters;
    title?: string;
    currentCategory?: string;
}

export default function ShopIndex({ products, categories = [], filters, title }: ShopIndexProps) {
    const safeFilters: ActiveFilters = filters && !Array.isArray(filters) && typeof filters === 'object' ? filters : {};
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>(safeFilters);
    const [sortBy, setSortBy] = useState('newest');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const handleFilterChange = (key: string, value: string | null) => {
        const newFilters = { ...activeFilters, [key]: value };
        if (!value) delete newFilters[key];
        setActiveFilters(newFilters);

        router.get(window.location.pathname, {
            ...newFilters,
            sort: sortBy,
        }, { preserveState: true, replace: true });
    };

    const handleSort = (value: string) => {
        setSortBy(value);
        router.get(window.location.pathname, { ...activeFilters, sort: value }, { preserveState: true, replace: true });
    };

    const activeFilterCount = Object.values(activeFilters).filter(Boolean).length;

    return (
        <MainLayout title={title || 'Boutique'}>
            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6">
                    <Link href={route('home')} className="hover:text-[#1a4731]">Accueil</Link>
                    <span>/</span>
                    <span className="text-stone-800">{title || 'Boutique'}</span>
                </nav>

                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-serif font-bold text-[#0f2b1c]">{title || 'Tous les livres'}</h1>
                        <p className="text-stone-500 mt-1">{products?.total || 0} résultats</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileFiltersOpen(true)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium"
                        >
                            <SlidersHorizontal size={16} />
                            Filtres {activeFilterCount > 0 && <span className="bg-[#1a4731] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{activeFilterCount}</span>}
                        </button>

                        <select
                            value={sortBy}
                            onChange={(e) => handleSort(e.target.value)}
                            className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1a4731]"
                        >
                            <option value="newest">Nouveautés</option>
                            <option value="bestselling">Meilleures ventes</option>
                            <option value="price_asc">Prix croissant</option>
                            <option value="price_desc">Prix décroissant</option>
                            <option value="name_asc">A → Z</option>
                        </select>
                    </div>
                </div>

                <div className="flex gap-8">
                    {/* Sidebar */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <div className="sticky top-24 bg-white rounded-xl border border-stone-100 p-5">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="font-bold text-stone-800">Filtres</h2>
                                {activeFilterCount > 0 && (
                                    <button onClick={() => { setActiveFilters({}); router.get(window.location.pathname, {}); }} className="text-xs text-red-500 hover:underline">
                                        Réinitialiser
                                    </button>
                                )}
                            </div>
                            <FilterSidebar
                                activeFilters={activeFilters}
                                onFilterChange={handleFilterChange}
                                categories={categories}
                            />
                        </div>
                    </aside>

                    {/* Products */}
                    <div className="flex-1">
                        {products?.data?.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                    {products.data.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {products.last_page > 1 && (
                                    <div className="mt-10 flex justify-center gap-2">
                                        {Array.from({ length: products.last_page }, (_, i) => i + 1).map((page) => (
                                            <Link
                                                key={page}
                                                href={`${window.location.pathname}?page=${page}`}
                                                className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                                                    page === products.current_page
                                                        ? 'bg-[#1a4731] text-white'
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
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">📚</div>
                                <h3 className="text-xl font-semibold text-stone-700 mb-2">Aucun produit trouvé</h3>
                                <p className="text-stone-500 mb-6">Essayez de modifier vos filtres</p>
                                <button
                                    onClick={() => { setActiveFilters({}); router.get(window.location.pathname, {}); }}
                                    className="btn-primary"
                                >
                                    Voir tous les produits
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Filters Overlay */}
            {mobileFiltersOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
                    <div className="absolute right-0 top-0 bottom-0 w-80 bg-white overflow-y-auto p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-stone-800 text-lg">Filtres</h2>
                            <button onClick={() => setMobileFiltersOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <FilterSidebar
                            activeFilters={activeFilters}
                            onFilterChange={(key, value) => { handleFilterChange(key, value); setMobileFiltersOpen(false); }}
                            categories={categories}
                        />
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
