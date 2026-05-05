import MainLayout from '@/Layouts/MainLayout';
import { Heart, Gift, ExternalLink, BookOpen, Users, ShieldCheck } from 'lucide-react';

export default function Donation() {
    return (
        <MainLayout title="Don Sadaqa — Offrir un livre">
            <div className="max-w-4xl mx-auto px-4 py-12">

                {/* Header */}
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-5">
                        <div className="w-20 h-20 bg-[#fdf8f0] rounded-full flex items-center justify-center">
                            <Gift size={40} className="text-[#c9a84c]" />
                        </div>
                    </div>
                    <h1 className="text-4xl font-serif font-bold text-[#0f2240] mb-4">Don Sadaqa</h1>
                    <p className="text-stone-600 text-lg max-w-2xl mx-auto leading-relaxed">
                        Offrez le cadeau de la connaissance. Pour chaque don reçu, nous offrons un livre islamique à quelqu'un dans le besoin.
                    </p>
                </div>

                {/* Hadith */}
                <div className="bg-[#fdf8f0] border border-[#c9a84c]/30 rounded-2xl p-8 mb-10 text-center">
                    <p className="text-[#1e3a5f] text-lg font-semibold italic leading-relaxed">
                        "Lorsque le fils d'Adam meurt, ses actions s'arrêtent sauf pour trois choses : une sadaqa jariya, une connaissance utile, ou un enfant vertueux qui prie pour lui."
                    </p>
                    <p className="text-stone-500 mt-3 font-medium">— Rapporté par Muslim</p>
                </div>

                {/* Pourquoi donner */}
                <div className="grid md:grid-cols-3 gap-5 mb-10">
                    {[
                        {
                            icon: <BookOpen size={26} className="text-[#1e3a5f]" />,
                            title: 'Un livre, une vie changée',
                            desc: 'Chaque don permet d\'offrir un livre islamique à une personne qui n\'en a pas les moyens.',
                        },
                        {
                            icon: <Users size={26} className="text-[#1e3a5f]" />,
                            title: 'Géré par une ASBL',
                            desc: 'Les dons sont gérés par l\'ASBL Taous, une association officielle dédiée à la diffusion de la connaissance islamique.',
                        },
                        {
                            icon: <ShieldCheck size={26} className="text-[#1e3a5f]" />,
                            title: 'Transparent & sécurisé',
                            desc: 'Vous serez redirigé vers le site officiel de l\'ASBL Taous pour effectuer votre don en toute sécurité.',
                        },
                    ].map((item, i) => (
                        <div key={i} className="bg-white rounded-xl border border-stone-100 p-6 text-center">
                            <div className="w-12 h-12 bg-[#f5efe0] rounded-xl flex items-center justify-center mx-auto mb-4">
                                {item.icon}
                            </div>
                            <h3 className="font-bold text-stone-800 mb-2">{item.title}</h3>
                            <p className="text-stone-500 text-sm leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>

                {/* CTA principal — redirection ASBL */}
                <div className="bg-gradient-to-br from-[#0f2240] to-[#1e3a5f] rounded-2xl p-10 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-16 w-32 h-32 bg-[#c9a84c]/10 rounded-full translate-y-1/2" />

                    <div className="relative z-10">
                        <div className="flex justify-center mb-5">
                            <div className="w-16 h-16 bg-[#c9a84c]/20 rounded-full flex items-center justify-center">
                                <Heart size={32} className="text-[#c9a84c]" />
                            </div>
                        </div>
                        <h2 className="text-2xl font-serif font-bold text-white mb-3">
                            Faire un don via l'ASBL Taous
                        </h2>
                        <p className="text-stone-300 mb-2 max-w-md mx-auto leading-relaxed">
                            Le formulaire de don est disponible directement sur le site de notre association.
                        </p>
                        <p className="text-stone-400 text-sm mb-8 font-mono">asbltaous.com</p>

                        <a
                            href="https://asbltaous.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-3 bg-[#c9a84c] text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-[#e8c97a] transition-colors shadow-lg"
                        >
                            <Heart size={20} />
                            Faire un don sur asbltaous.com
                            <ExternalLink size={18} />
                        </a>

                        <p className="text-stone-400 text-xs mt-6">
                            Qu'Allah vous en récompense — Barak Allahu feekum
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
