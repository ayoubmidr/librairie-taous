import { useForm, Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';

export default function ForgotPassword() {
    const { data, setData, post, processing, errors, wasSuccessful } = useForm({
        email: '',
    });

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <MainLayout title="Mot de passe oublié">
            <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-serif font-bold text-[#0f2b1c]">Mot de passe oublié</h1>
                        <p className="text-stone-500 mt-2 text-sm">
                            Entrez votre email et nous vous enverrons un lien de réinitialisation.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
                        {wasSuccessful ? (
                            <div className="text-center py-4">
                                <div className="text-4xl mb-3">✅</div>
                                <p className="text-stone-600">Un email de réinitialisation a été envoyé si ce compte existe.</p>
                            </div>
                        ) : (
                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Adresse email</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full border border-stone-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#1a4731]"
                                        placeholder="votre@email.com"
                                        autoComplete="email"
                                        autoFocus
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-[#1a4731] text-white py-3.5 rounded-lg font-semibold hover:bg-[#2d7a52] transition-colors disabled:opacity-50"
                                >
                                    {processing ? 'Envoi...' : 'Envoyer le lien'}
                                </button>
                            </form>
                        )}

                        <div className="mt-6 text-center text-sm text-stone-500">
                            <Link href={route('login')} className="text-[#1a4731] font-semibold hover:underline">
                                ← Retour à la connexion
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
