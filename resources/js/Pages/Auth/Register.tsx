import { useForm, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('register'));
    };

    return (
        <MainLayout title="Créer un compte">
            <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#1a4731] rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-serif text-3xl font-bold">T</span>
                        </div>
                        <h1 className="text-2xl font-serif font-bold text-[#0f2b1c]">Créer un compte</h1>
                        <p className="text-stone-500 mt-1">Rejoignez la communauté Librairie Taous</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Nom complet</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    placeholder="Mohammed Dupont"
                                    className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731]"
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Adresse email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    placeholder="votre@email.com"
                                    className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731]"
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Mot de passe</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder="Minimum 8 caractères"
                                        className="w-full border border-stone-200 rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:border-[#1a4731]"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Confirmer le mot de passe</label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={e => setData('password_confirmation', e.target.value)}
                                    placeholder="Répétez votre mot de passe"
                                    className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731]"
                                />
                            </div>

                            <p className="text-xs text-stone-400">
                                En créant un compte, vous acceptez nos{' '}
                                <Link href={route('pages.show', 'cgv')} className="text-[#1a4731] hover:underline">CGV</Link>{' '}
                                et notre{' '}
                                <Link href={route('pages.show', 'politique-confidentialite')} className="text-[#1a4731] hover:underline">politique de confidentialité</Link>.
                            </p>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 bg-[#1a4731] text-white py-3.5 rounded-lg font-semibold hover:bg-[#2d7a52] transition-colors disabled:opacity-50"
                            >
                                <UserPlus size={18} />
                                {processing ? 'Création...' : 'Créer mon compte'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-stone-500">
                            Déjà un compte ?{' '}
                            <Link href={route('login')} className="text-[#1a4731] font-semibold hover:underline">
                                Se connecter
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
