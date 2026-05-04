import { useForm, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useState } from 'react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <MainLayout title="Connexion">
            <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-[#1e3a5f] rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <span className="text-white font-serif text-3xl font-bold">T</span>
                        </div>
                        <h1 className="text-2xl font-serif font-bold text-[#0f2240]">Bienvenue !</h1>
                        <p className="text-stone-500 mt-1">Connectez-vous à votre compte</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Adresse email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]/20"
                                    placeholder="votre@email.com"
                                    autoComplete="email"
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
                                        className="w-full border border-stone-200 rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]/20"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400">
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)} className="rounded border-stone-300 text-[#1e3a5f]" />
                                    <span className="text-sm text-stone-600">Se souvenir de moi</span>
                                </label>
                                <Link href={route('password.request')} className="text-sm text-[#1e3a5f] hover:underline">
                                    Mot de passe oublié ?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] text-white py-3.5 rounded-lg font-semibold hover:bg-[#2d5a8e] transition-colors disabled:opacity-50"
                            >
                                <LogIn size={18} />
                                {processing ? 'Connexion...' : 'Se connecter'}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-stone-500">
                            Pas encore de compte ?{' '}
                            <Link href={route('register')} className="text-[#1e3a5f] font-semibold hover:underline">
                                Créer un compte
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
