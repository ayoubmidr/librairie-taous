import { useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Heart } from 'lucide-react';

const AMOUNTS = [5, 10, 20, 50];

export default function Donation() {
    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        donor_name: '',
        donor_email: '',
        amount: 10,
        message: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('donation.store'));
    };

    return (
        <MainLayout title="Don Sadaqa — Offrir un livre">
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="text-5xl mb-4">📿</div>
                    <h1 className="text-4xl font-serif font-bold text-[#0f2b1c] mb-4">Don Sadaqa</h1>
                    <p className="text-stone-600 text-lg max-w-2xl mx-auto">
                        Offrez le cadeau de la connaissance. Pour chaque don reçu, nous offrons un livre islamique à quelqu'un dans le besoin.
                    </p>
                </div>

                {/* Hadith */}
                <div className="bg-[#fdf8f0] border border-[#c9a84c]/20 rounded-2xl p-8 mb-12 text-center">
                    <p className="text-[#1a4731] text-lg font-semibold italic leading-relaxed">
                        "Lorsque le fils d'Adam meurt, ses actions s'arrêtent sauf pour trois choses : une sadaqa jariya, une connaissance utile, ou un enfant vertueux qui prie pour lui."
                    </p>
                    <p className="text-stone-500 mt-3 font-medium">— Rapporté par Muslim</p>
                </div>

                {wasSuccessful ? (
                    <div className="bg-white rounded-2xl border border-green-200 p-12 text-center">
                        <div className="text-5xl mb-4">🤲</div>
                        <h2 className="text-2xl font-serif font-bold text-[#0f2b1c] mb-3">Barak Allahu feek !</h2>
                        <p className="text-stone-600">Votre don a été enregistré. Qu'Allah vous en récompense.</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl border border-stone-100 p-8">
                        <h2 className="text-2xl font-serif font-bold text-[#0f2b1c] mb-6">Faire un don</h2>
                        <form onSubmit={submit} className="space-y-6">
                            {/* Amount selection */}
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-3">Montant du don</label>
                                <div className="grid grid-cols-4 gap-3 mb-3">
                                    {AMOUNTS.map(amount => (
                                        <button
                                            key={amount}
                                            type="button"
                                            onClick={() => setData('amount', amount)}
                                            className={`py-3 rounded-lg font-semibold text-sm transition-colors border-2 ${data.amount === amount ? 'border-[#1a4731] bg-[#1a4731] text-white' : 'border-stone-200 text-stone-600 hover:border-[#1a4731]'}`}
                                        >
                                            {amount} €
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="number"
                                    min="1"
                                    value={data.amount}
                                    onChange={e => setData('amount', parseFloat(e.target.value))}
                                    className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731]"
                                    placeholder="Ou entrez un montant personnalisé"
                                />
                                {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Votre prénom (optionnel)</label>
                                    <input
                                        type="text"
                                        value={data.donor_name}
                                        onChange={e => setData('donor_name', e.target.value)}
                                        className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731]"
                                        placeholder="Anonyme"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Email (pour le reçu) *</label>
                                    <input
                                        type="email"
                                        value={data.donor_email}
                                        onChange={e => setData('donor_email', e.target.value)}
                                        className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731]"
                                        placeholder="votre@email.com"
                                    />
                                    {errors.donor_email && <p className="text-red-500 text-xs mt-1">{errors.donor_email}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Message (optionnel)</label>
                                <textarea
                                    value={data.message}
                                    onChange={e => setData('message', e.target.value)}
                                    rows={3}
                                    className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731] resize-none"
                                    placeholder="Pour qui faites-vous ce don ? Un message pour le bénéficiaire ?"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 bg-[#c9a84c] text-white py-4 rounded-lg font-bold text-lg hover:bg-[#e8c97a] transition-colors disabled:opacity-50"
                            >
                                <Heart size={20} />
                                {processing ? 'Traitement...' : `Faire un don de ${data.amount} €`}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
