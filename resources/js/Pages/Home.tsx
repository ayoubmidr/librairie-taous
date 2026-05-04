import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ProductCard from '@/Components/ProductCard';
import { ChevronRight, ShieldCheck, Truck, RefreshCcw, Headphones, Star, BookOpen, Award, Users, Scale, BookMarked, GraduationCap, Heart, Smile, Home as HomeIcon, Gem, Languages, User, Gift } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Product, Category, Banner, Review } from '@/types';
import { ReactNode } from 'react';

interface HeroSlide {
    title: string;
    subtitle: string;
    bg: string;
    cta: string;
    cta2: string;
}

function HeroSection({ banners }: { banners: Banner[] }) {
    const defaultSlides: HeroSlide[] = [
        {
            title: 'La Science Islamique à Portée de Main',
            subtitle: 'Découvrez notre collection exclusive de livres islamiques en français',
            bg: 'from-[#0f2240] to-[#1e3a5f]',
            cta: 'Découvrir la boutique',
            cta2: 'Nos nouveautés',
        },
        {
            title: 'Éditions Taous — Nos Propres Publications',
            subtitle: 'Des ouvrages islamiques de référence, rédigés et édités avec soin',
            bg: 'from-[#1a2e4a] to-[#1e3a5f]',
            cta: 'Éditions Taous',
            cta2: 'Achats en gros',
        },
    ];

    return (
        <section className="relative overflow-hidden">
            <Swiper
                modules={[Autoplay, Pagination, Navigation]}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                pagination={{ clickable: true }}
                navigation
                loop
                className="w-full"
            >
                {defaultSlides.map((slide, i) => (
                    <SwiperSlide key={i}>
                        <div className={`bg-gradient-to-r ${slide.bg} min-h-[500px] md:min-h-[600px] flex items-center relative overflow-hidden`}>
                            <div className="absolute inset-0 opacity-10">
                                <div className="absolute top-10 right-20 w-64 h-64 border border-white/30 rounded-full"></div>
                                <div className="absolute -bottom-10 right-40 w-96 h-96 border border-white/20 rounded-full"></div>
                                <div className="absolute top-1/2 left-1/3 text-white/5 text-[200px] font-serif select-none">ب</div>
                            </div>

                            <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
                                <div className="max-w-2xl">
                                    <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-sm px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
                                        <BookOpen size={14} />
                                        <span>Librairie Islamique en ligne depuis 2015</span>
                                    </div>

                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight mb-6">
                                        {slide.title}
                                    </h1>

                                    <p className="text-stone-300 text-lg md:text-xl mb-8 leading-relaxed">
                                        {slide.subtitle}
                                    </p>

                                    <div className="flex flex-wrap gap-4">
                                        <Link href={route('shop.index')} className="inline-flex items-center gap-2 bg-[#c9a84c] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#e8c97a] transition-colors text-lg">
                                            {slide.cta} <ChevronRight size={20} />
                                        </Link>
                                        <Link href={route('shop.new')} className="inline-flex items-center gap-2 border-2 border-white/40 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-colors text-lg">
                                            {slide.cta2}
                                        </Link>
                                    </div>

                                    <div className="flex flex-wrap gap-6 mt-10 text-white/70 text-sm">
                                        <span className="flex items-center gap-2"><ShieldCheck size={16} /> Paiement sécurisé</span>
                                        <span className="flex items-center gap-2"><Truck size={16} /> Livraison toute l'Europe</span>
                                        <span className="flex items-center gap-2"><Star size={16} /> +5000 clients satisfaits</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
}

function TrustBar() {
    const items: { icon: ReactNode; title: string; desc: string }[] = [
        { icon: <Truck className="text-[#1e3a5f]" size={24} />, title: 'Livraison rapide', desc: 'France, Belgique, Europe' },
        { icon: <ShieldCheck className="text-[#1e3a5f]" size={24} />, title: 'Paiement sécurisé', desc: 'Stripe — Visa / Mastercard' },
        { icon: <RefreshCcw className="text-[#1e3a5f]" size={24} />, title: 'Retours faciles', desc: "14 jours pour changer d'avis" },
        { icon: <Headphones className="text-[#1e3a5f]" size={24} />, title: 'Service client', desc: 'Réponse sous 24h' },
    ];

    return (
        <div className="bg-white border-b border-stone-100">
            <div className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {items.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-[#f5efe0] rounded-lg flex items-center justify-center">
                                {item.icon}
                            </div>
                            <div>
                                <div className="font-semibold text-stone-800 text-sm">{item.title}</div>
                                <div className="text-stone-500 text-xs">{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    viewAllLink?: string;
    viewAllLabel?: string;
}

function SectionHeader({ title, subtitle, viewAllLink, viewAllLabel = 'Voir tout' }: SectionHeaderProps) {
    return (
        <div className="flex items-end justify-between mb-8">
            <div>
                <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#0f2240]">{title}</h2>
                {subtitle && <p className="text-stone-500 mt-1 text-sm">{subtitle}</p>}
            </div>
            {viewAllLink && (
                <Link href={viewAllLink} className="flex items-center gap-1 text-[#1e3a5f] font-semibold text-sm hover:gap-2 transition-all">
                    {viewAllLabel} <ChevronRight size={16} />
                </Link>
            )}
        </div>
    );
}

function CategoryGrid({ categories }: { categories: Category[] }) {
    const featured = categories?.slice(0, 8) || [];

    return (
        <section className="py-16 bg-[#fdf8f0]">
            <div className="max-w-7xl mx-auto px-4">
                <SectionHeader
                    title="Parcourir par thème"
                    subtitle="Trouvez les livres qui vous correspondent"
                    viewAllLink={route('shop.index')}
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3">
                    {featured.map((cat) => (
                        <Link
                            key={cat.id}
                            href={route('shop.category', cat.slug)}
                            className="group flex flex-col items-center gap-2 p-4 bg-white rounded-xl hover:bg-[#1e3a5f] transition-all duration-300 hover:shadow-md text-center"
                        >
                            <div className="w-12 h-12 bg-[#f5efe0] group-hover:bg-white/10 rounded-lg flex items-center justify-center text-2xl transition-colors">
                                {getCategoryIcon(cat.name)}
                            </div>
                            <span className="text-xs font-medium text-stone-700 group-hover:text-white transition-colors leading-tight">
                                {cat.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}

function getCategoryIcon(name: string): ReactNode {
    const map: Record<string, ReactNode> = {
        'Croyance': <Star size={22} />,
        'Fiqh': <Scale size={22} />,
        'Hadith': <BookMarked size={22} />,
        'Coran': <BookOpen size={22} />,
        'Éducation': <GraduationCap size={22} />,
        'Femme': <Heart size={22} />,
        'Enfants': <Smile size={22} />,
        'Biographies': <User size={22} />,
        'Mariage': <Heart size={22} />,
        'Famille': <HomeIcon size={22} />,
        'Comportement': <Gem size={22} />,
        'Langue arabe': <Languages size={22} />,
    };
    return map[name] ?? <BookOpen size={22} />;
}

interface ProductSectionProps {
    title: string;
    subtitle?: string;
    products: Product[];
    viewAllLink?: string;
}

function ProductSection({ title, subtitle, products, viewAllLink }: ProductSectionProps) {
    if (!products?.length) return null;

    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4">
                <SectionHeader title={title} subtitle={subtitle} viewAllLink={viewAllLink} />
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                    {products.slice(0, 5).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function PromoBanner() {
    return (
        <section className="py-6">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-4">
                    <Link href={route('shop.sale')} className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1e3a5f] to-[#2d5a8e] p-8 flex flex-col justify-between min-h-48">
                        <div className="text-white">
                            <div className="text-[#c9a84c] font-bold text-sm uppercase tracking-wider mb-2">Promotions</div>
                            <h3 className="text-2xl md:text-3xl font-serif font-bold leading-tight">Jusqu'à -40%<br />sur une sélection</h3>
                            <p className="text-white/70 mt-2 text-sm">Profitez de nos offres spéciales</p>
                        </div>
                        <span className="inline-flex items-center gap-2 text-white font-semibold mt-4 group-hover:gap-3 transition-all">
                            Voir les promotions <ChevronRight size={18} />
                        </span>
                    </Link>

                    <Link href={route('resellers.index')} className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#1a2e4a] to-[#2a4a7a] p-8 flex flex-col justify-between min-h-48">
                        <div className="text-white">
                            <div className="text-[#c9a84c] font-bold text-sm uppercase tracking-wider mb-2">Éditions Taous</div>
                            <h3 className="text-2xl md:text-3xl font-serif font-bold leading-tight">Achat en gros<br />pour revendeurs</h3>
                            <p className="text-white/70 mt-2 text-sm">-40% dès 5 exemplaires</p>
                        </div>
                        <span className="inline-flex items-center gap-2 text-white font-semibold mt-4 group-hover:gap-3 transition-all">
                            En savoir plus <ChevronRight size={18} />
                        </span>
                    </Link>
                </div>
            </div>
        </section>
    );
}

interface DisplayReview {
    id?: number;
    name?: string;
    author_name?: string;
    text?: string;
    content?: string;
    rating: number;
    is_verified_purchase?: boolean;
}

function TestimonialsSection({ reviews }: { reviews: Review[] }) {
    const defaults: DisplayReview[] = [
        { id: 1, name: 'Aicha B.', text: 'Livraison rapide et livres en parfait état. Je commande ici régulièrement, toujours satisfaite !', rating: 5 },
        { id: 2, name: 'Ibrahim M.', text: 'La meilleure librairie islamique en ligne. Le catalogue est très complet, les prix sont corrects.', rating: 5 },
        { id: 3, name: 'Khadija R.', text: 'Excellent service client, ils ont répondu à toutes mes questions. Je recommande vivement.', rating: 5 },
        { id: 4, name: "Youssef A.", text: "J'ai commandé plusieurs packs pour ma médersa. Livraison impeccable et réduction professionnelle appréciée.", rating: 5 },
    ];

    const displayReviews: DisplayReview[] = reviews?.length ? reviews.map(r => ({
        id: r.id,
        author_name: r.author_name,
        content: r.content,
        rating: r.rating,
        is_verified_purchase: r.is_verified_purchase,
    })) : defaults;

    return (
        <section className="py-16 bg-[#fdf8f0]">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-serif font-bold text-[#0f2240]">Ce que disent nos clients</h2>
                    <div className="flex items-center justify-center gap-2 mt-3">
                        <div className="flex">
                            {[1,2,3,4,5].map(i => <Star key={i} size={18} className="text-[#c9a84c] fill-[#c9a84c]" />)}
                        </div>
                        <span className="text-stone-600 font-medium">4.9/5 — Plus de 500 avis vérifiés</span>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {displayReviews.map((review, i) => (
                        <div key={review.id ?? i} className="bg-white rounded-xl p-6 shadow-sm">
                            <div className="flex mb-3">
                                {[1,2,3,4,5].map(j => (
                                    <Star key={j} size={14} className={j <= (review.rating || 5) ? 'text-[#c9a84c] fill-[#c9a84c]' : 'text-stone-200'} />
                                ))}
                            </div>
                            <p className="text-stone-600 text-sm leading-relaxed italic mb-4">"{review.text || review.content}"</p>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-[#1e3a5f] rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {(review.name || review.author_name || '?')[0]}
                                </div>
                                <div>
                                    <div className="font-semibold text-stone-800 text-sm">{review.name || review.author_name}</div>
                                    {review.is_verified_purchase && <div className="text-xs text-[#1e3a5f]">✓ Achat vérifié</div>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function AboutSection() {
    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-block bg-[#f5efe0] text-[#1e3a5f] text-sm font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
                            Notre histoire
                        </div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-[#0f2240] mb-6 leading-tight">
                            Librairie Taous &<br />Éditions Taous
                        </h2>
                        <p className="text-stone-600 leading-relaxed mb-4">
                            Depuis notre création, Librairie Taous s'est imposée comme une référence de confiance pour les musulmans francophones en quête de livres islamiques de qualité.
                        </p>
                        <p className="text-stone-600 leading-relaxed mb-6">
                            Nous proposons une sélection rigoureuse d'ouvrages couvrant toutes les disciplines de l'islam : croyance, fiqh, hadith, Coran, éducation, famille et bien plus encore.
                        </p>
                        <p className="text-stone-600 leading-relaxed mb-8">
                            Les <strong className="text-[#1e3a5f]">Éditions Taous</strong> constituent notre maison d'édition propre, garantissant des publications soigneusement vérifiées, accessibles et fidèles aux sources authentiques.
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                            {[
                                { value: '+1000', label: 'Références' },
                                { value: '+5000', label: 'Clients' },
                                { value: '10+', label: "Ans d'expérience" },
                            ].map((stat, i) => (
                                <div key={i} className="text-center p-4 bg-[#fdf8f0] rounded-xl">
                                    <div className="text-2xl font-bold text-[#1e3a5f] font-serif">{stat.value}</div>
                                    <div className="text-stone-500 text-xs mt-1">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div className="bg-[#1e3a5f] rounded-2xl p-6 text-white">
                                <BookOpen size={32} className="text-[#c9a84c] mb-3" />
                                <h3 className="font-serif font-bold text-lg mb-2">Catalogue complet</h3>
                                <p className="text-white/70 text-sm">+1000 références soigneusement sélectionnées</p>
                            </div>
                            <div className="bg-[#f5efe0] rounded-2xl p-6">
                                <Award size={32} className="text-[#1e3a5f] mb-3" />
                                <h3 className="font-serif font-bold text-lg text-[#0f2240] mb-2">Éditions propres</h3>
                                <p className="text-stone-500 text-sm">Publications vérifiées et fidèles aux sources</p>
                            </div>
                        </div>
                        <div className="space-y-4 mt-8">
                            <div className="bg-[#f5efe0] rounded-2xl p-6">
                                <Truck size={32} className="text-[#1e3a5f] mb-3" />
                                <h3 className="font-serif font-bold text-lg text-[#0f2240] mb-2">Livraison rapide</h3>
                                <p className="text-stone-500 text-sm">France, Belgique, et toute l'Europe</p>
                            </div>
                            <div className="bg-[#c9a84c] rounded-2xl p-6 text-white">
                                <Users size={32} className="text-white/80 mb-3" />
                                <h3 className="font-serif font-bold text-lg mb-2">B2B & Revendeurs</h3>
                                <p className="text-white/70 text-sm">Conditions spéciales pour librairies et grossistes</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function PreorderSection({ products }: { products: Product[] }) {
    if (!products?.length) return null;

    return (
        <section className="py-16 bg-gradient-to-r from-[#1a2e4a] to-[#1e3a5f]">
            <div className="max-w-7xl mx-auto px-4">
                <div className="text-center mb-10">
                    <div className="inline-block bg-[#c9a84c] text-white text-sm font-bold px-4 py-2 rounded-full mb-4">
                        Bientôt disponibles
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-white">Précommandes en cours</h2>
                    <p className="text-white/70 mt-2">Réservez dès maintenant, nous vous livrerons à la sortie</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {products.slice(0, 4).map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

                <div className="text-center mt-10">
                    <Link href={route('shop.preorders')} className="inline-flex items-center gap-2 border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#1e3a5f] transition-colors">
                        Toutes les précommandes <ChevronRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}

function DonationSection() {
    return (
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="bg-gradient-to-r from-[#fdf8f0] to-[#f5efe0] rounded-3xl p-8 md:p-12 border border-[#c9a84c]/20">
                    <div className="max-w-2xl mx-auto text-center">
                        <div className="flex justify-center mb-4"><Gift size={48} className="text-[#c9a84c]" /></div>
                        <h2 className="text-3xl font-serif font-bold text-[#0f2240] mb-4">
                            Don Sadaqa — Offrir un livre
                        </h2>
                        <p className="text-stone-600 leading-relaxed mb-6">
                            Offrez le cadeau de la connaissance à quelqu'un dans le besoin. Pour la modique somme d'un livre, vous pouvez offrir un Coran ou un ouvrage islamique à une personne qui n'en a pas les moyens.
                        </p>
                        <p className="text-[#1e3a5f] font-semibold italic mb-8">
                            "Lorsque le fils d'Adam meurt, ses actions s'arrêtent sauf pour trois choses : une sadaqa jariya, une connaissance utile, ou un enfant vertueux qui prie pour lui." — Prophète ﷺ
                        </p>
                        <Link href={route('donation')} className="inline-flex items-center gap-2 bg-[#c9a84c] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#e8c97a] transition-colors text-lg">
                            Faire un don de livre <Heart size={18} className="inline" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

interface HomeProps {
    newProducts: Product[];
    bestsellerProducts: Product[];
    saleProducts: Product[];
    featuredProducts: Product[];
    preorderProducts: Product[];
    recentReviews: Review[];
    banners: Banner[];
    categories: Category[];
}

export default function Home({
    newProducts,
    bestsellerProducts,
    saleProducts,
    preorderProducts,
    recentReviews,
    banners,
    categories,
}: HomeProps) {
    return (
        <MainLayout>
            <HeroSection banners={banners} />
            <TrustBar />

            <ProductSection
                title="Nouveautés"
                subtitle="Les dernières publications de notre catalogue"
                products={newProducts}
                viewAllLink={route('shop.new')}
            />

            <CategoryGrid categories={categories} />

            <ProductSection
                title="Meilleures ventes"
                subtitle="Les livres les plus appréciés de notre communauté"
                products={bestsellerProducts}
                viewAllLink={route('shop.bestsellers')}
            />

            <PromoBanner />

            <ProductSection
                title="Promotions du moment"
                subtitle="Profitez de nos offres spéciales"
                products={saleProducts}
                viewAllLink={route('shop.sale')}
            />

            <PreorderSection products={preorderProducts} />

            <AboutSection />

            <TestimonialsSection reviews={recentReviews} />

            <DonationSection />
        </MainLayout>
    );
}
