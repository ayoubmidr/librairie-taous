import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { CheckCircle, Package, Mail, ChevronRight } from 'lucide-react';
import { Order } from '@/types';

interface CheckoutSuccessProps {
    order: Order;
}

export default function CheckoutSuccess({ order }: CheckoutSuccessProps) {
    return (
        <MainLayout title="Commande confirmée">
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} className="text-green-500" />
                </div>

                <h1 className="text-3xl font-serif font-bold text-[#0f2b1c] mb-4">
                    Commande confirmée !
                </h1>

                <p className="text-stone-600 mb-2">
                    Merci pour votre commande, {order?.first_name} !
                </p>
                <p className="text-stone-500 text-sm mb-8">
                    Un email de confirmation a été envoyé à <strong>{order?.email}</strong>
                </p>

                <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-8 text-left">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-stone-800">Récapitulatif</h2>
                        <span className="text-[#1a4731] font-mono font-bold">{order?.order_number}</span>
                    </div>

                    <div className="space-y-3">
                        {order?.items?.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span className="text-stone-600">{item.product_name} <span className="text-stone-400">x{item.quantity}</span></span>
                                <span className="font-medium">{parseFloat(String(item.total)).toFixed(2)} €</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-stone-100 mt-4 pt-4 space-y-2 text-sm">
                        <div className="flex justify-between text-stone-500">
                            <span>Livraison</span>
                            <span>{parseFloat(String(order?.shipping_cost || 0)).toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between font-bold text-base">
                            <span>Total payé</span>
                            <span className="text-[#1a4731]">{parseFloat(String(order?.total || 0)).toFixed(2)} €</span>
                        </div>
                    </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-8">
                    <div className="bg-[#fdf8f0] rounded-xl p-4 flex gap-3">
                        <Package size={20} className="text-[#1a4731] flex-shrink-0 mt-0.5" />
                        <div className="text-left text-sm">
                            <p className="font-semibold text-stone-800">Expédition</p>
                            <p className="text-stone-500">Votre commande sera expédiée sous 24-48h</p>
                        </div>
                    </div>
                    <div className="bg-[#fdf8f0] rounded-xl p-4 flex gap-3">
                        <Mail size={20} className="text-[#1a4731] flex-shrink-0 mt-0.5" />
                        <div className="text-left text-sm">
                            <p className="font-semibold text-stone-800">Email de suivi</p>
                            <p className="text-stone-500">Vous recevrez un email avec le numéro de suivi</p>
                        </div>
                    </div>
                </div>

                {order?.has_preorder && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-8 text-sm text-orange-700 text-left">
                        <p className="font-medium mb-1">⚠️ Votre commande contient des articles en précommande</p>
                        <p>Ces articles seront expédiés séparément à leur date de disponibilité.</p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {order?.id && (
                        <Link href={route('account.orders.show', order.id)} className="btn-primary">
                            Suivre ma commande <ChevronRight size={16} />
                        </Link>
                    )}
                    <Link href={route('shop.index')} className="btn-secondary">
                        Continuer mes achats
                    </Link>
                </div>
            </div>
        </MainLayout>
    );
}
