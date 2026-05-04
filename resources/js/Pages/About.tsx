import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { BookOpen, Award, Users, Truck, Heart, Star } from 'lucide-react';

export default function About() {
    return (
        <MainLayout title="À propos — Librairie Taous">
            {/* Hero */}
            <section className="bg-gradient-to-r from-[#0f2240] to-[#1e3a5f] py-20">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="inline-block bg-white/10 text-white text-sm font-bold px-4 py-2 rounded-full mb-6 uppercase tracking-wider">
                        Notre histoire
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-6">
                        Librairie Taous &<br />Éditions Taous
                    </h1>
                    <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto">
                        Depuis 2015, votre référence pour les livres islamiques en français. Une librairie fondée avec passion pour rendre la connaissance islamique accessible à tous.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="bg-white border-b border-stone-100">
                <div className="max-w-5xl mx-auto px-4 py-10">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { value: '+1000', label: 'Références', icon: <BookOpen size={24} /> },
                            { value: '+5000', label: 'Clients satisfaits', icon: <Users size={24} /> },
                            { value: '10+', label: "Ans d'expérience", icon: <Star size={24} /> },
                            { value: '15+', label: 'Pays livrés', icon: <Truck size={24} /> },
                        ].map((stat, i) => (
                            <div key={i} className="p-4">
                                <div className="flex justify-center text-[#c9a84c] mb-2">{stat.icon}</div>
                                <div className="text-3xl font-bold text-[#1e3a5f] font-serif">{stat.value}</div>
                                <div className="text-stone-500 text-sm mt-1">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Story */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="prose prose-stone max-w-none">
                        <h2 className="text-3xl font-serif font-bold text-[#0f2240] mb-6">Notre mission</h2>
                        <p className="text-stone-600 leading-relaxed text-lg mb-6">
                            Librairie Taous est née d'une conviction simple : chaque musulman francophone devrait avoir accès à des livres islamiques de qualité, dans sa langue, à des prix raisonnables.
                        </p>
                        <p className="text-stone-600 leading-relaxed mb-6">
                            Fondée en 2015, notre librairie en ligne s'est construite autour d'une sélection rigoureuse d'ouvrages couvrant toutes les disciplines de l'islam : 'aqida (croyance), fiqh (jurisprudence), hadith, Coran et tafsir, éducation islamique, vie familiale, biographies des savants et bien plus encore.
                        </p>
                        <p className="text-stone-600 leading-relaxed mb-6">
                            Nous travaillons avec les meilleures maisons d'édition islamiques francophones pour vous proposer des ouvrages authentiques, traduits et vérifiés par des savants compétents.
                        </p>

                        <h2 className="text-3xl font-serif font-bold text-[#0f2240] mt-12 mb-6">Les Éditions Taous</h2>
                        <p className="text-stone-600 leading-relaxed mb-6">
                            En parallèle de notre activité de librairie, nous avons fondé les <strong className="text-[#1e3a5f]">Éditions Taous</strong> — notre propre maison d'édition islamique.
                        </p>
                        <p className="text-stone-600 leading-relaxed mb-6">
                            Chaque ouvrage publié sous notre label fait l'objet d'une vérification scrupuleuse quant à la conformité de son contenu aux sources authentiques de l'islam : le Coran et la Sunna selon la compréhension des pieux prédécesseurs.
                        </p>
                        <p className="text-stone-600 leading-relaxed mb-6">
                            Les Éditions Taous proposent également des prix spéciaux pour les revendeurs, librairies et associations islamiques souhaitant distribuer nos publications. Des réductions de 40% à 50% sont disponibles à partir de 5 exemplaires.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-16 bg-[#fdf8f0]">
                <div className="max-w-5xl mx-auto px-4">
                    <h2 className="text-3xl font-serif font-bold text-[#0f2240] text-center mb-12">Nos engagements</h2>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: <BookOpen size={32} />, title: 'Authenticité', desc: 'Chaque ouvrage est sélectionné pour sa conformité aux sources authentiques de l\'islam.' },
                            { icon: <Award size={32} />, title: 'Qualité', desc: 'Des traductions soignées et des mises en page lisibles pour une lecture agréable.' },
                            { icon: <Heart size={32} />, title: 'Engagement', desc: 'Une partie de nos bénéfices est reversée à des associations caritatives islamiques.' },
                        ].map((val, i) => (
                            <div key={i} className="bg-white rounded-2xl p-8 text-center shadow-sm">
                                <div className="flex justify-center text-[#1e3a5f] mb-4">{val.icon}</div>
                                <h3 className="font-serif font-bold text-xl text-[#0f2240] mb-3">{val.title}</h3>
                                <p className="text-stone-600 text-sm leading-relaxed">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-serif font-bold text-[#0f2240] mb-4">Rejoignez notre communauté</h2>
                    <p className="text-stone-600 mb-8">Découvrez notre catalogue de plus de 1000 références islamiques</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href={route('shop.index')} className="inline-flex items-center justify-center gap-2 bg-[#1e3a5f] text-white px-8 py-4 rounded-lg font-semibold hover:bg-[#2d5a8e] transition-colors">
                            Parcourir le catalogue
                        </Link>
                        <Link href={route('contact')} className="inline-flex items-center justify-center gap-2 border-2 border-[#1e3a5f] text-[#1e3a5f] px-8 py-4 rounded-lg font-semibold hover:bg-[#1e3a5f] hover:text-white transition-colors">
                            Nous contacter
                        </Link>
                    </div>
                </div>
            </section>
        </MainLayout>
    );
}
