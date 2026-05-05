import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import { ChevronDown, ChevronUp, X, SlidersHorizontal, BookOpen, Sparkles, Tag } from 'lucide-react';
import { Category, PaginatedData, Product } from '@/types';

interface Publisher {
    id: number;
    name: string;
    slug: string;
}

interface ActiveFilters {
    price?: string | null;
    category?: string | null;
    publisher?: string | null;
    availability?: string | null;
    language?: string | null;
    is_new?: string | null;
    [key: string]: string | null | undefined;
}

interface FilterSectionProps {
    title: string;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
    const [open, setOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-stone-100 pb-5 last:border-0 last:pb-0">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between text-sm font-semibold text-stone-800 mb-3"
            >
                {title}
                {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {open && <div>{children}</div>}
        </div>
    );
}

interface FilterSidebarProps {
    activeFilters: ActiveFilters;
    onFilterChange: (key: string, value: string | null) => void;
    categories: Category[];
    publishers: Publisher[];
}

function FilterSidebar({ activeFilters, onFilterChange, categories, publishers }: FilterSidebarProps) {
    return (
        <div className="space-y-5">

            {/* Nouveautés */}
            <FilterSection title="Nouveautés">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={activeFilters.is_new === '1'}
                        onChange={() => onFilterChange('is_new', activeFilters.is_new === '1' ? null : '1')}
                        className="rounded border-stone-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                    />
                    <span className="text-sm text-stone-600">Nouveautés uniquement</span>
                </label>
            </FilterSection>

            {/* Prix */}
            <FilterSection title="Prix">
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
                                className="rounded border-stone-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                            />
                            <span className="text-sm text-stone-600">{range.label}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Catégories */}
            {categories?.length > 0 && (
                <FilterSection title="Catégorie">
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {categories.map((cat) => (
                            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={activeFilters.category === cat.slug}
                                    onChange={() => onFilterChange('category', activeFilters.category === cat.slug ? null : cat.slug)}
                                    className="rounded border-stone-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                                />
                                <span className="text-sm text-stone-600">{cat.name}</span>
                            </label>
                        ))}
                    </div>
                </FilterSection>
            )}

            {/* Maison d'édition */}
            {publishers?.length > 0 && (
                <FilterSection title="Maison d'édition" defaultOpen={false}>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {publishers.map((pub) => (
                            <label key={pub.id} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={activeFilters.publisher === pub.slug}
                                    onChange={() => onFilterChange('publisher', activeFilters.publisher === pub.slug ? null : pub.slug)}
                                    className="rounded border-stone-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                                />
                                <span className="text-sm text-stone-600">{pub.name}</span>
                            </label>
                        ))}
                    </div>
                </FilterSection>
            )}

            {/* Disponibilité */}
            <FilterSection title="Disponibilité">
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
                                className="rounded border-stone-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                            />
                            <span className="text-sm text-stone-600">{opt.label}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>

            {/* Langue */}
            <FilterSection title="Langue" defaultOpen={false}>
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
                                className="rounded border-stone-300 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                            />
                            <span className="text-sm text-stone-600">{lang.label}</span>
                        </label>
                    ))}
                </div>
            </FilterSection>
        </div>
    );
}

interface ShopIndexProps {
    products: PaginatedData<Product>;
    categories: Category[];
    publishers?: Publisher[];
    filters: ActiveFilters;
    title?: string;
    currentCategory?: string;
    pageType?: 'new' | 'sale' | 'default';
}

export default function ShopIndex({ products, categories, publishers = [], filters, title, pageType }: ShopIndexProps) {
    const [activeFilters, setActiveFilters] = useState<ActiveFilters>(filters || {});
    const [sortBy, setSortBy] = useState(filters?.sort || 'newest');
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

    const handleFilterChange = (key: string, value: string | null) => {
        const newFilters = { ...activeFilters, [key]: value };
        if (!value) delete newFilters[key];
        setActiveFilters(newFilters);
        router.get(window.location.pathname, { ...newFilters, sort: sortBy }, { preserveState: true, replace: true });
    };

    const handleSort = (value: string) => {
        setSortBy(value);
        router.get(window.location.pathname, { ...activeFilters, sort: value }, { preserveState: true, replace: true });
    };

    const activeFilterCount = Object.values(activeFilters).filter(v => v && v !== sortBy).length;

    const resetFilters = () => {
        setActiveFilters({});
        router.get(window.location.pathname, {});
    };

    return (
        <MainLayout title={title || 'Boutique'}>
            <div className="max-w-7xl mx-auto px-4 py-8">

                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-stone-500 mb-6">
                    <Link href={route('home')} className="hover:text-[#1e3a5f]">Accueil</Link>
                    <span>/</span>
                    <span className="text-stone-800">{title || 'Boutique'}</span>
                </nav>

                {/* Bannière Nouveautés */}
                {pageType === 'new' && (
                    <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] rounded-2xl p-8 mb-8 flex items-center gap-6">
                        <div className="bg-white/10 rounded-xl p-4">
                            <Sparkles size={36} className="text-[#c9a84c]" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-white">Nouveautés</h1>
                            <p className="text-stone-300 mt-1">Les derniers livres islamiques ajoutés à notre catalogue</p>
                        </div>
                    </div>
                )}

                {/* Bannière Promotions */}
                {pageType === 'sale' && (
                    <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-2xl p-8 mb-8 flex items-center gap-6">
                        <div className="bg-white/10 rounded-xl p-4">
                            <Tag size={36} className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-serif font-bold text-white">Promotions</h1>
                            <p className="text-red-100 mt-1">Tous nos livres en réduction, triés du meilleur au moins bon</p>
                        </div>
                    </div>
                )}

                {/* Titre page normale */}
                {!pageType && (
                    <h1 className="text-3xl font-serif font-bold text-[#0f2240] mb-2">{title || 'Tous les livres'}</h1>
                )}

                {/* Barre de contrôle */}
                <div className="flex items-center justify-between mb-6 gap-4">
                    <div className="flex items-center gap-3">
                        <span className="text-stone-500 text-sm">{products?.total || 0} résultat{(products?.total || 0) > 1 ? 's' : ''}</span>
                        {activeFilterCount > 0 && (
                            <button onClick={resetFilters} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                                <X size={12} /> Réinitialiser les filtres
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setMobileFiltersOpen(true)}
                            className="lg:hidden flex items-center gap-2 px-4 py-2 border border-stone-200 rounded-lg text-sm font-medium"
                        >
                            <SlidersHorizontal size={16} />
                            Filtres {activeFilterCount > 0 && <span className="bg-[#1e3a5f] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{activeFilterCount}</span>}
                        </button>
                        <select
                            value={sortBy}
                            onChange={(e) => handleSort(e.target.value)}
                            className="border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#1e3a5f] bg-white"
                        >
                            <option value="newest">Plus récents</option>
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
                                <h2 className="font-bold text-stone-800 flex items-center gap-2">
                                    <SlidersHorizontal size={16} className="text-[#1e3a5f]" /> Filtres
                                </h2>
                                {activeFilterCount > 0 && (
                                    <button onClick={resetFilters} className="text-xs text-red-500 hover:underline">
                                        Tout effacer
                                    </button>
                                )}
                            </div>
                            <FilterSidebar
                                activeFilters={activeFilters}
                                onFilterChange={handleFilterChange}
                                categories={categories}
                                publishers={publishers}
                            />
                        </div>
                    </aside>

                    {/* Grille produits */}
                    <div className="flex-1 min-w-0">
                        {/* Tags filtres actifs */}
                        {activeFilterCount > 0 && (
                            <div className="flex flex-wrap gap-2 mb-5">
                                {Object.entries(activeFilters).filter(([k, v]) => v && k !== 'sort').map(([key, value]) => (
                                    <button
                                        key={key}
                                        onClick={() => handleFilterChange(key, null)}
                                        className="flex items-center gap-1 bg-[#1e3a5f]/10 text-[#1e3a5f] text-xs font-medium px-3 py-1.5 rounded-full hover:bg-red-50 hover:text-red-600 transition-colors"
                                    >
                                        {value} <X size={11} />
                                    </button>
                                ))}
                            </div>
                        )}

                        {products?.data?.length > 0 ? (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
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
                            <div className="text-center py-24">
                                <div className="flex justify-center mb-4"><BookOpen size={56} className="text-stone-200" /></div>
                                <h3 className="text-xl font-semibold text-stone-700 mb-2">Aucun produit trouvé</h3>
                                <p className="text-stone-400 mb-6">Essayez de modifier ou réinitialiser vos filtres</p>
                                <button onClick={resetFilters} className="btn-primary">
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
                            publishers={publishers}
                        />
                    </div>
                </div>
            )}
        </MainLayout>
    );
}
