import { useForm, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { AuthUser } from '@/types';

interface SettingsProps {
    user: AuthUser;
}

export default function Settings({ user }: SettingsProps) {
    const { data, setData, put, processing, errors, wasSuccessful } = useForm({
        name: user.name,
        email: user.email,
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('account.settings.update'));
    };

    return (
        <MainLayout title="Paramètres du compte">
            <div className="max-w-2xl mx-auto px-4 py-10">
                <div className="flex items-center gap-3 mb-8">
                    <Link href={route('account.index')} className="text-stone-400 hover:text-[#1a4731] text-sm">Mon compte</Link>
                    <span className="text-stone-300">/</span>
                    <h1 className="text-2xl font-serif font-bold text-[#0f2b1c]">Paramètres</h1>
                </div>

                {wasSuccessful && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 text-green-700 text-sm font-medium">
                        ✅ Vos informations ont été mises à jour.
                    </div>
                )}

                <div className="bg-white rounded-2xl border border-stone-100 p-8">
                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <h2 className="font-semibold text-stone-800 mb-4">Informations personnelles</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Nom complet</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731]"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731]"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="border-t border-stone-100 pt-6">
                            <h2 className="font-semibold text-stone-800 mb-4">Changer le mot de passe</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Mot de passe actuel</label>
                                    <input
                                        type="password"
                                        value={data.current_password}
                                        onChange={e => setData('current_password', e.target.value)}
                                        className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731]"
                                        placeholder="Laissez vide si vous ne changez pas"
                                    />
                                    {errors.current_password && <p className="text-red-500 text-xs mt-1">{errors.current_password}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Nouveau mot de passe</label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={e => setData('password', e.target.value)}
                                        className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731]"
                                        placeholder="Minimum 8 caractères"
                                    />
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Confirmer le nouveau mot de passe</label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731]"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full bg-[#1a4731] text-white py-3.5 rounded-lg font-semibold hover:bg-[#2d7a52] transition-colors disabled:opacity-50"
                        >
                            {processing ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
                        </button>
                    </form>
                </div>
            </div>
        </MainLayout>
    );
}
