import { useForm } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('password.store'));
    };

    return (
        <MainLayout title="Nouveau mot de passe">
            <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-serif font-bold text-[#0f2b1c]">Nouveau mot de passe</h1>
                        <p className="text-stone-500 mt-2 text-sm">Choisissez un nouveau mot de passe sécurisé.</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
                        <form onSubmit={submit} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731]"
                                    readOnly
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Nouveau mot de passe</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="w-full border border-stone-200 rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:border-[#1a4731]"
                                        placeholder="Minimum 8 caractères"
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
                                    className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731]"
                                    placeholder="Répétez votre mot de passe"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#1a4731] text-white py-3.5 rounded-lg font-semibold hover:bg-[#2d7a52] transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
