import { useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Contact() {
    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('contact.send'));
    };

    return (
        <MainLayout title="Contact">
            <div className="max-w-6xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-[#0f2b1c] mb-4">Contactez-nous</h1>
                    <p className="text-stone-500 text-lg">Notre équipe vous répond sous 24h</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Info */}
                    <div className="space-y-6">
                        {[
                            { icon: <Phone size={20} />, title: 'Téléphone', text: '+33 1 23 45 67 89', sub: 'Lun-Ven 9h-18h' },
                            { icon: <Mail size={20} />, title: 'Email', text: 'contact@librairietaous.com', sub: 'Réponse sous 24h' },
                            { icon: <MapPin size={20} />, title: 'Adresse', text: '12 rue de la Paix', sub: '75001 Paris, France' },
                            { icon: <Clock size={20} />, title: 'Horaires', text: 'Lundi — Vendredi', sub: '9h00 — 18h00' },
                        ].map((item, i) => (
                            <div key={i} className="flex gap-4 p-5 bg-white rounded-xl border border-stone-100">
                                <div className="w-10 h-10 bg-[#f5efe0] rounded-lg flex items-center justify-center text-[#1a4731] flex-shrink-0">
                                    {item.icon}
                                </div>
                                <div>
                                    <p className="font-semibold text-stone-800 text-sm">{item.title}</p>
                                    <p className="text-stone-600 text-sm">{item.text}</p>
                                    <p className="text-stone-400 text-xs">{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Form */}
                    <div className="md:col-span-2 bg-white rounded-2xl border border-stone-100 p-8">
                        {wasSuccessful ? (
                            <div className="text-center py-12">
                                <div className="text-5xl mb-4">✅</div>
                                <h2 className="text-2xl font-serif font-bold text-[#0f2b1c] mb-3">Message envoyé !</h2>
                                <p className="text-stone-600">Nous vous répondrons dans les 24 heures.</p>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Nom complet *</label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731]"
                                            placeholder="Mohammed Dupont"
                                        />
                                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={e => setData('email', e.target.value)}
                                            className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731]"
                                            placeholder="votre@email.com"
                                        />
                                        {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Sujet</label>
                                    <input
                                        type="text"
                                        value={data.subject}
                                        onChange={e => setData('subject', e.target.value)}
                                        className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731]"
                                        placeholder="Objet de votre message"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Message *</label>
                                    <textarea
                                        value={data.message}
                                        onChange={e => setData('message', e.target.value)}
                                        rows={6}
                                        className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731] resize-none"
                                        placeholder="Votre message..."
                                    />
                                    {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-[#1a4731] text-white py-3.5 rounded-lg font-semibold hover:bg-[#2d7a52] transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Envoi en cours...' : 'Envoyer le message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
