import { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { ChevronDown } from 'lucide-react';
import { Faq } from '@/types';

interface FAQProps {
    faqs: Faq[];
}

export default function FAQ({ faqs }: FAQProps) {
    const [openId, setOpenId] = useState<number | null>(null);

    const defaultFaqs: Faq[] = faqs?.length ? faqs : [
        { id: 1, question: 'Quels sont les délais de livraison ?', answer: 'Pour la France métropolitaine, comptez 3 à 5 jours ouvrés avec Colissimo. La livraison express (Chronopost) est disponible en 1-2 jours ouvrés.' },
        { id: 2, question: 'Puis-je retourner un article ?', answer: 'Oui, vous disposez de 14 jours après réception pour retourner tout article non ouvert dans son emballage d\'origine. Les frais de retour sont à votre charge sauf en cas d\'erreur de notre part.' },
        { id: 3, question: 'Comment bénéficier des prix revendeurs ?', answer: 'Pour accéder aux tarifs professionnels sur les Éditions Taous, créez un compte et soumettez une demande de compte revendeur. Nous la traiterons sous 48h.' },
        { id: 4, question: 'Les paiements sont-ils sécurisés ?', answer: 'Oui, tous les paiements sont traités par Stripe, leader mondial du paiement en ligne. Vos données bancaires ne nous parviennent jamais directement.' },
        { id: 5, question: 'Livrez-vous à l\'étranger ?', answer: 'Nous livrons dans toute l\'Europe, en Afrique du Nord et dans certains pays du Moyen-Orient. Les tarifs varient selon la destination.' },
        { id: 6, question: 'Qu\'est-ce que les Éditions Taous ?', answer: 'Les Éditions Taous sont notre maison d\'édition propre. Nous publions des ouvrages islamiques soigneusement sélectionnés, traduits et édités pour les musulmans francophones.' },
    ];

    const categories = [...new Set(defaultFaqs.map(f => f.category).filter(Boolean))];

    return (
        <MainLayout title="Foire aux questions">
            <div className="max-w-3xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-[#0f2240] mb-4">Foire aux questions</h1>
                    <p className="text-stone-500 text-lg">Trouvez rapidement les réponses à vos questions</p>
                </div>

                <div className="space-y-3">
                    {defaultFaqs.map((faq) => (
                        <div key={faq.id} className="bg-white rounded-xl border border-stone-100 overflow-hidden">
                            <button
                                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                                className="w-full flex items-center justify-between p-5 text-left hover:bg-stone-50 transition-colors"
                            >
                                <span className="font-semibold text-stone-800 pr-4">{faq.question}</span>
                                <ChevronDown
                                    size={20}
                                    className={`text-[#1e3a5f] flex-shrink-0 transition-transform ${openId === faq.id ? 'rotate-180' : ''}`}
                                />
                            </button>
                            {openId === faq.id && (
                                <div className="px-5 pb-5">
                                    <p className="text-stone-600 leading-relaxed">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-12 bg-[#fdf8f0] rounded-2xl p-8 text-center border border-[#c9a84c]/20">
                    <h2 className="text-xl font-serif font-bold text-[#0f2240] mb-3">Vous n'avez pas trouvé votre réponse ?</h2>
                    <p className="text-stone-600 mb-6">Notre équipe est disponible pour répondre à toutes vos questions</p>
                    <a href={route('contact')} className="inline-flex items-center gap-2 bg-[#1e3a5f] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#2d5a8e] transition-colors">
                        Nous contacter
                    </a>
                </div>
            </div>
        </MainLayout>
    );
}
