import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { MapPin, Plus, Trash2, Star } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Address } from '@/types';

interface AddressesProps {
    addresses: Address[];
}

export default function Addresses({ addresses }: AddressesProps) {
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState<Partial<Address>>({
        first_name: '', last_name: '', address_line1: '', city: '', postal_code: '', country: 'FR',
    });

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(route('account.addresses.destroy', id));
            router.reload({ only: ['addresses'] });
            toast.success('Adresse supprimée');
        } catch {
            toast.error('Erreur');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await axios.post(route('account.addresses.store'), form);
            router.reload({ only: ['addresses'] });
            setShowForm(false);
            toast.success('Adresse ajoutée');
        } catch {
            toast.error('Erreur lors de l\'ajout');
        }
    };

    return (
        <MainLayout title="Mes adresses">
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <Link href={route('account.index')} className="text-stone-400 hover:text-[#1a4731] text-sm">Mon compte</Link>
                        <span className="text-stone-300">/</span>
                        <h1 className="text-2xl font-serif font-bold text-[#0f2b1c]">Mes adresses</h1>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-[#1a4731] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2d7a52] transition-colors"
                    >
                        <Plus size={16} /> Ajouter
                    </button>
                </div>

                {showForm && (
                    <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6">
                        <h2 className="font-semibold text-stone-800 mb-4">Nouvelle adresse</h2>
                        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
                            {[
                                { key: 'first_name', label: 'Prénom', required: true },
                                { key: 'last_name', label: 'Nom', required: true },
                                { key: 'address_line1', label: 'Adresse', required: true, full: true },
                                { key: 'city', label: 'Ville', required: true },
                                { key: 'postal_code', label: 'Code postal', required: true },
                                { key: 'country', label: 'Pays', required: true },
                            ].map(field => (
                                <div key={field.key} className={field.full ? 'col-span-2' : ''}>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">{field.label}{field.required ? ' *' : ''}</label>
                                    <input
                                        type="text"
                                        value={(form as Record<string, string | undefined>)[field.key] || ''}
                                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                        className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#1a4731]"
                                    />
                                </div>
                            ))}
                            <div className="col-span-2 flex gap-3 pt-2">
                                <button type="submit" className="flex-1 bg-[#1a4731] text-white py-3 rounded-lg font-semibold hover:bg-[#2d7a52] transition-colors text-sm">
                                    Sauvegarder
                                </button>
                                <button type="button" onClick={() => setShowForm(false)} className="flex-1 border border-stone-200 text-stone-600 py-3 rounded-lg font-semibold text-sm">
                                    Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {addresses?.length > 0 ? (
                    <div className="space-y-4">
                        {addresses.map(address => (
                            <div key={address.id} className="bg-white rounded-xl border border-stone-100 p-5 flex items-start gap-4">
                                <div className="w-10 h-10 bg-[#f5efe0] rounded-lg flex items-center justify-center flex-shrink-0">
                                    <MapPin size={18} className="text-[#1a4731]" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-stone-800">{address.first_name} {address.last_name}</p>
                                    <p className="text-stone-600 text-sm">{address.address_line1}</p>
                                    {address.address_line2 && <p className="text-stone-500 text-sm">{address.address_line2}</p>}
                                    <p className="text-stone-600 text-sm">{address.postal_code} {address.city}, {address.country}</p>
                                    {address.is_default && (
                                        <span className="inline-flex items-center gap-1 mt-1 text-xs text-[#c9a84c] font-semibold">
                                            <Star size={12} fill="currentColor" /> Adresse par défaut
                                        </span>
                                    )}
                                </div>
                                {address.id && (
                                    <button onClick={() => handleDelete(address.id!)} className="text-stone-300 hover:text-red-500 transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-stone-100 p-12 text-center">
                        <MapPin size={40} className="text-stone-200 mx-auto mb-4" />
                        <p className="text-stone-500">Aucune adresse enregistrée</p>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
