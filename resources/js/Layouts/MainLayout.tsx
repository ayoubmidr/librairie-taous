import { useState, useEffect, ReactNode } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { ShoppingBag, Search, Menu, X, ChevronDown, Heart, User, Phone, Mail, Truck, BookOpen, Leaf, GraduationCap, Sparkles, Star, Droplets } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { PageProps, AuthUser } from '@/types';

interface NavbarProps {
    cartCount: number;
    user: AuthUser | null;
}

const megaMenuCategories = [
    { label: 'Livres', icon: BookOpen, href: route('shop.index'), desc: 'Tous nos livres islamiques' },
    { label: 'Santé', icon: Leaf, href: route('shop.category', 'sante'), desc: 'Bien-être & médecine' },
    { label: 'Enfants & Éducation', icon: GraduationCap, href: route('shop.category', 'enfants-education'), desc: 'Pour les jeunes esprits' },
    { label: 'Mariage', icon: Sparkles, href: route('shop.category', 'mariage'), desc: 'Préparer et célébrer' },
    { label: 'Croyance', icon: Star, href: route('shop.category', 'croyance'), desc: 'Aqida & foi islamique' },
    { label: 'Parfum', icon: Droplets, href: route('shop.category', 'parfum'), desc: 'Parfums & attars' },
];

function Navbar({ cartCount, user }: NavbarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const [categoriesOpen, setCategoriesOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            window.location.href = route('search') + '?q=' + encodeURIComponent(searchQuery);
        }
    };

    const navLinks = [
        { label: 'Accueil', href: route('home') },
        { label: 'Nouveautés', href: route('shop.new') },
        { label: 'Promotions', href: route('shop.sale') },
        { label: 'Éditions', href: route('publishers.index') },
        { label: 'Revendeurs', href: route('resellers.index') },
        { label: 'Packs', href: route('shop.packs') },
    ];

    return (
        <>
            {/* Top Bar */}
            <div className="bg-[#1e3a5f] text-white py-2 text-sm hidden md:block">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <div className="flex items-center gap-6 text-stone-200 text-xs">
                        <span className="flex items-center gap-1">
                            <Phone size={12} /> +33 1 23 45 67 89
                        </span>
                        <span className="flex items-center gap-1">
                            <Mail size={12} /> contact@librairietaous.com
                        </span>
                        <span className="flex items-center gap-1"><Truck size={12} /> Livraison gratuite dès 50€ en France</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                        {user ? (
                            <Link href={route('account.index')} className="hover:text-[#c9a84c] transition-colors">
                                Mon compte
                            </Link>
                        ) : (
                            <>
                                <Link href={route('login')} className="hover:text-[#c9a84c] transition-colors">Connexion</Link>
                                <Link href={route('register')} className="hover:text-[#c9a84c] transition-colors">Inscription</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'} border-b border-stone-100`}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center justify-between h-16 md:h-20">
                        {/* Logo */}
                        <Link href={route('home')} className="flex items-center gap-3 flex-shrink-0">
                            <div className="w-10 h-10 bg-[#1e3a5f] rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg font-serif">T</span>
                            </div>
                            <div className="hidden sm:block">
                                <div className="font-serif text-xl font-bold text-[#1e3a5f] leading-tight">Librairie Taous</div>
                                <div className="text-xs text-[#c9a84c] font-medium tracking-wider">ÉDITIONS ISLAMIQUES</div>
                            </div>
                        </Link>

                        {/* Desktop Search */}
                        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Rechercher un livre, auteur, éditeur..."
                                    className="w-full pl-4 pr-12 py-2.5 border-2 border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#1e3a5f] transition-colors"
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-[#1e3a5f] transition-colors">
                                    <Search size={18} />
                                </button>
                            </div>
                        </form>

                        {/* Icons */}
                        <div className="flex items-center gap-3">
                            <button onClick={() => setSearchOpen(!searchOpen)} className="md:hidden p-2 text-stone-600 hover:text-[#1e3a5f]">
                                <Search size={20} />
                            </button>
                            {user && (
                                <Link href={route('account.wishlist')} className="hidden sm:flex p-2 text-stone-600 hover:text-[#1e3a5f] transition-colors">
                                    <Heart size={20} />
                                </Link>
                            )}
                            <Link href={route('account.index')} className="hidden sm:flex p-2 text-stone-600 hover:text-[#1e3a5f] transition-colors">
                                <User size={20} />
                            </Link>
                            <Link href={route('cart.index')} className="relative p-2 text-stone-600 hover:text-[#1e3a5f] transition-colors">
                                <ShoppingBag size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 bg-[#1e3a5f] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                                        {cartCount > 99 ? '99+' : cartCount}
                                    </span>
                                )}
                            </Link>
                            <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 text-stone-600">
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search */}
                    {searchOpen && (
                        <form onSubmit={handleSearch} className="md:hidden py-3 border-t border-stone-100">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Rechercher..."
                                    className="w-full pl-4 pr-12 py-2.5 border-2 border-stone-200 rounded-lg text-sm focus:outline-none focus:border-[#1e3a5f]"
                                    autoFocus
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                                    <Search size={18} />
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Desktop Nav */}
                <nav className="hidden md:block border-t border-stone-100 bg-white">
                    <div className="max-w-7xl mx-auto px-4">
                        <ul className="flex items-center gap-0">
                            {/* Catégories mega menu */}
                            <li className="relative group">
                                <button className="flex items-center gap-1 px-3 py-3.5 text-sm font-medium text-stone-700 hover:text-[#1e3a5f] hover:bg-stone-50 transition-colors rounded">
                                    Catégories <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-200" />
                                </button>
                                <div className="absolute top-full left-0 bg-white shadow-xl border border-stone-100 rounded-xl w-[420px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="p-4">
                                        <div className="grid grid-cols-2 gap-2">
                                            {megaMenuCategories.map((cat) => {
                                                const Icon = cat.icon;
                                                return (
                                                    <Link
                                                        key={cat.label}
                                                        href={cat.href}
                                                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#f5efe0] transition-colors group/item"
                                                    >
                                                        <div className="w-9 h-9 bg-[#1e3a5f]/8 rounded-lg flex items-center justify-center flex-shrink-0 group-hover/item:bg-[#1e3a5f] transition-colors">
                                                            <Icon size={16} className="text-[#1e3a5f] group-hover/item:text-white transition-colors" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-semibold text-stone-800 group-hover/item:text-[#1e3a5f] transition-colors leading-tight">
                                                                {cat.label}
                                                            </div>
                                                            <div className="text-xs text-stone-400 mt-0.5">{cat.desc}</div>
                                                        </div>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                        <div className="border-t border-stone-100 mt-3 pt-3">
                                            <Link
                                                href={route('shop.index')}
                                                className="flex items-center justify-center gap-2 w-full py-2 text-sm font-semibold text-[#1e3a5f] hover:bg-stone-50 rounded-lg transition-colors"
                                            >
                                                Voir tous les livres →
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </li>

                            {/* Regular nav links */}
                            {navLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="block px-3 py-3.5 text-sm font-medium text-stone-700 hover:text-[#1e3a5f] hover:bg-stone-50 transition-colors rounded"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </nav>

                {/* Mobile Nav */}
                {isOpen && (
                    <div className="md:hidden border-t border-stone-100 bg-white shadow-lg">
                        <nav className="p-4 space-y-1">
                            <Link
                                href={route('home')}
                                className="block px-4 py-3 text-stone-700 font-medium hover:bg-stone-50 hover:text-[#1e3a5f] rounded-lg transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Accueil
                            </Link>
                            <Link
                                href={route('shop.new')}
                                className="block px-4 py-3 text-stone-700 font-medium hover:bg-stone-50 hover:text-[#1e3a5f] rounded-lg transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Nouveautés
                            </Link>
                            <Link
                                href={route('shop.sale')}
                                className="block px-4 py-3 text-stone-700 font-medium hover:bg-stone-50 hover:text-[#1e3a5f] rounded-lg transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                Promotions
                            </Link>

                            {/* Mobile categories accordion */}
                            <div>
                                <button
                                    onClick={() => setCategoriesOpen(!categoriesOpen)}
                                    className="w-full flex items-center justify-between px-4 py-3 text-stone-700 font-medium hover:bg-stone-50 hover:text-[#1e3a5f] rounded-lg transition-colors"
                                >
                                    Catégories
                                    <ChevronDown size={16} className={`transition-transform duration-200 ${categoriesOpen ? 'rotate-180' : ''}`} />
                                </button>
                                {categoriesOpen && (
                                    <div className="ml-4 space-y-1 mt-1">
                                        {megaMenuCategories.map((cat) => (
                                            <Link
                                                key={cat.label}
                                                href={cat.href}
                                                className="block px-4 py-2.5 text-sm text-stone-600 hover:bg-stone-50 hover:text-[#1e3a5f] rounded-lg transition-colors"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {cat.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {navLinks.slice(2).map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="block px-4 py-3 text-stone-700 font-medium hover:bg-stone-50 hover:text-[#1e3a5f] rounded-lg transition-colors"
                                    onClick={() => setIsOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}

                            {!user && (
                                <div className="border-t border-stone-100 pt-3 mt-3 space-y-1">
                                    <Link href={route('login')} className="block px-4 py-3 text-stone-700 font-medium hover:bg-stone-50 rounded-lg">
                                        Connexion
                                    </Link>
                                    <Link href={route('register')} className="block px-4 py-3 bg-[#1e3a5f] text-white font-medium rounded-lg text-center">
                                        Inscription
                                    </Link>
                                </div>
                            )}
                        </nav>
                    </div>
                )}
            </header>
        </>
    );
}

function Footer() {
    const handleNewsletterSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <footer className="bg-[#0f2240] text-stone-300 mt-16">
            {/* Newsletter */}
            <div className="bg-[#1e3a5f] py-10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h3 className="text-white text-2xl font-serif font-bold mb-2">Restez informé de nos nouveautés</h3>
                    <p className="text-stone-300 mb-6 text-sm">Recevez nos nouvelles publications, promotions et actualités islamiques</p>
                    <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
                        <input
                            type="email"
                            placeholder="Votre adresse email"
                            className="flex-1 px-4 py-3 rounded-lg text-stone-800 focus:outline-none text-sm"
                        />
                        <button type="submit" className="px-6 py-3 bg-[#c9a84c] text-white font-semibold rounded-lg hover:bg-[#e8c97a] transition-colors text-sm">
                            S'abonner
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
                {/* Brand */}
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 bg-[#c9a84c] rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold font-serif">T</span>
                        </div>
                        <span className="text-white font-serif text-lg font-bold">Librairie Taous</span>
                    </div>
                    <p className="text-stone-400 text-sm leading-relaxed mb-4">
                        Votre libraire islamique en ligne. Livres en français, Corans, et publications des Éditions Taous — livrés en Europe.
                    </p>
                    <div className="flex gap-3">
                        {['Facebook', 'Instagram', 'YouTube'].map((social) => (
                            <a key={social} href="#" className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#c9a84c] transition-colors text-xs">
                                {social[0]}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Categories */}
                <div>
                    <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Catégories</h4>
                    <ul className="space-y-2 text-sm">
                        {[
                            { label: 'Livres', slug: '' },
                            { label: 'Croyance', slug: 'croyance' },
                            { label: 'Santé', slug: 'sante' },
                            { label: 'Enfants & Éducation', slug: 'enfants-education' },
                            { label: 'Mariage', slug: 'mariage' },
                            { label: 'Parfum', slug: 'parfum' },
                        ].map((cat) => (
                            <li key={cat.label}>
                                <Link
                                    href={cat.slug ? route('shop.category', cat.slug) : route('shop.index')}
                                    className="hover:text-[#c9a84c] transition-colors"
                                >
                                    {cat.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Service Client */}
                <div>
                    <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Service client</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href={route('faq')} className="hover:text-[#c9a84c] transition-colors">FAQ</Link></li>
                        <li><Link href={route('contact')} className="hover:text-[#c9a84c] transition-colors">Contact</Link></li>
                        <li><Link href={route('pages.show', 'livraison-retours')} className="hover:text-[#c9a84c] transition-colors">Livraison & Retours</Link></li>
                        <li><Link href={route('pages.show', 'paiements-securises')} className="hover:text-[#c9a84c] transition-colors">Paiements sécurisés</Link></li>
                        <li><Link href={route('track-order')} className="hover:text-[#c9a84c] transition-colors">Suivre ma commande</Link></li>
                        <li><Link href={route('resellers.index')} className="hover:text-[#c9a84c] transition-colors">Revendeurs / Gros</Link></li>
                        <li><Link href={route('donation')} className="hover:text-[#c9a84c] transition-colors">Don Sadaqa</Link></li>
                    </ul>
                </div>

                {/* Légal */}
                <div>
                    <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Informations</h4>
                    <ul className="space-y-2 text-sm">
                        <li><Link href={route('about')} className="hover:text-[#c9a84c] transition-colors">À propos</Link></li>
                        <li><Link href={route('pages.show', 'nos-engagements')} className="hover:text-[#c9a84c] transition-colors">Nos engagements</Link></li>
                        <li><Link href={route('pages.show', 'mentions-legales')} className="hover:text-[#c9a84c] transition-colors">Mentions légales</Link></li>
                        <li><Link href={route('pages.show', 'cgv')} className="hover:text-[#c9a84c] transition-colors">CGV</Link></li>
                        <li><Link href={route('pages.show', 'politique-confidentialite')} className="hover:text-[#c9a84c] transition-colors">Confidentialité</Link></li>
                        <li><Link href={route('pages.show', 'politique-retours')} className="hover:text-[#c9a84c] transition-colors">Politique de retour</Link></li>
                    </ul>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 py-6">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-stone-500 text-xs">
                        © {new Date().getFullYear()} Librairie Taous — Éditions Taous. Tous droits réservés.
                    </p>
                    <div className="flex items-center gap-3">
                        <span className="text-stone-500 text-xs">Paiement sécurisé :</span>
                        {['VISA', 'MC', 'CB', 'Stripe'].map((p) => (
                            <span key={p} className="bg-white/10 text-stone-300 text-xs px-2 py-1 rounded font-mono">
                                {p}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

interface MainLayoutProps {
    children: ReactNode;
    title?: string;
    description?: string;
}

export default function MainLayout({ children, title, description }: MainLayoutProps) {
    const { auth, cartCount } = usePage<PageProps>().props;

    return (
        <>
            <Helmet>
                {title && <title>{title}</title>}
                {description && <meta name="description" content={description} />}
            </Helmet>

            <div className="min-h-screen flex flex-col bg-stone-50">
                <Navbar
                    cartCount={cartCount as number}
                    user={auth?.user ?? null}
                />

                <main className="flex-1">
                    {children}
                </main>

                <Footer />
            </div>
        </>
    );
}
