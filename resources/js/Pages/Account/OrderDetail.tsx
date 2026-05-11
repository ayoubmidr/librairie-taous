import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { Order, OrderStatus } from '@/types';

interface OrderDetailProps {
    order: Order;
}

const STATUS_STEPS: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'shipped', 'delivered'];

const STATUS_LABELS: Record<OrderStatus, string> = {
    pending: 'En attente', confirmed: 'Confirmée', preparing: 'En préparation',
    shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée', refunded: 'Remboursée',
};

export default function OrderDetail({ order }: OrderDetailProps) {
    const currentStep = STATUS_STEPS.indexOf(order.status);
    const isCancelled = order.status === 'cancelled' || order.status === 'refunded';

    return (
        <MainLayout title={`Commande ${order.order_number}`}>
            <div className="max-w-4xl mx-auto px-4 py-10">
                <div className="flex items-center gap-3 mb-8">
                    <Link href={route('account.index')} className="text-stone-400 hover:text-[#1a4731] text-sm">Mon compte</Link>
                    <span className="text-stone-300">/</span>
                    <Link href={route('account.orders')} className="text-stone-400 hover:text-[#1a4731] text-sm">Commandes</Link>
                    <span className="text-stone-300">/</span>
                    <h1 className="text-2xl font-serif font-bold text-[#0f2b1c]">{order.order_number}</h1>
                </div>

                {/* Status tracker */}
                {!isCancelled && (
                    <div className="bg-white rounded-2xl border border-stone-100 p-6 mb-6">
                        <div className="flex items-center justify-between">
                            {STATUS_STEPS.map((step, i) => (
                                <div key={step} className="flex items-center">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                                            currentStep > i ? 'bg-[#1a4731] text-white' :
                                            currentStep === i ? 'border-2 border-[#1a4731] text-[#1a4731]' :
                                            'border-2 border-stone-200 text-stone-300'
                                        }`}>
                                            {currentStep > i ? <CheckCircle size={18} /> : i + 1}
                                        </div>
                                        <span className={`text-xs mt-1 hidden sm:block ${currentStep >= i ? 'text-[#1a4731] font-medium' : 'text-stone-400'}`}>
                                            {STATUS_LABELS[step]}
                                        </span>
                                    </div>
                                    {i < STATUS_STEPS.length - 1 && (
                                        <div className={`w-8 sm:w-16 h-0.5 mx-2 ${currentStep > i ? 'bg-[#1a4731]' : 'bg-stone-200'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {isCancelled && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                        <p className="text-red-700 font-medium">Cette commande a été {order.status === 'cancelled' ? 'annulée' : 'remboursée'}.</p>
                    </div>
                )}

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Items */}
                    <div className="md:col-span-2 bg-white rounded-xl border border-stone-100 p-6">
                        <h2 className="font-semibold text-stone-800 mb-4">Articles commandés</h2>
                        <div className="space-y-4">
                            {order.items?.map(item => (
                                <div key={item.id} className="flex gap-4">
                                    {item.product_image && (
                                        <img src={item.product_image} alt={item.product_name} className="w-16 h-20 object-cover rounded-lg flex-shrink-0" />
                                    )}
                                    <div className="flex-1">
                                        {item.product_slug ? (
                                            <Link href={route('products.show', item.product_slug)} className="font-medium text-stone-800 hover:text-[#1a4731] text-sm">
                                                {item.product_name}
                                            </Link>
                                        ) : (
                                            <p className="font-medium text-stone-800 text-sm">{item.product_name}</p>
                                        )}
                                        <p className="text-stone-400 text-sm mt-1">Qté : {item.quantity} × {parseFloat(String(item.price)).toFixed(2)} €</p>
                                        {item.is_preorder && <span className="inline-block text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full mt-1">Précommande</span>}
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-stone-800">{parseFloat(String(item.total)).toFixed(2)} €</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-stone-100 mt-6 pt-4 space-y-2 text-sm">
                            <div className="flex justify-between text-stone-600">
                                <span>Sous-total</span><span>{parseFloat(String(order.subtotal ?? 0)).toFixed(2)} €</span>
                            </div>
                            {(order.discount_amount ?? 0) > 0 && (
                                <div className="flex justify-between text-green-600">
                                    <span>Réduction</span><span>-{parseFloat(String(order.discount_amount ?? 0)).toFixed(2)} €</span>
                                </div>
                            )}
                            <div className="flex justify-between text-stone-600">
                                <span>Livraison</span><span>{parseFloat(String(order.shipping_cost ?? 0)).toFixed(2)} €</span>
                            </div>
                            <div className="flex justify-between font-bold text-lg pt-2 border-t border-stone-100">
                                <span>Total</span><span className="text-[#1a4731]">{parseFloat(String(order.total ?? 0)).toFixed(2)} €</span>
                            </div>
                        </div>
                    </div>

                    {/* Info sidebar */}
                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-stone-100 p-5">
                            <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
                                <Package size={16} className="text-[#1a4731]" /> Livraison
                            </h3>
                            {order.shipping_address && (
                                <div className="text-sm text-stone-600 space-y-1">
                                    <p>{(order.shipping_address as Record<string, string>)['first_name']} {(order.shipping_address as Record<string, string>)['last_name']}</p>
                                    <p>{(order.shipping_address as Record<string, string>)['address_line1']}</p>
                                    <p>{(order.shipping_address as Record<string, string>)['postal_code']} {(order.shipping_address as Record<string, string>)['city']}</p>
                                    <p>{(order.shipping_address as Record<string, string>)['country']}</p>
                                </div>
                            )}
                            {order.tracking_number && (
                                <div className="mt-3 pt-3 border-t border-stone-100">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Truck size={14} className="text-[#1a4731]" />
                                        <span className="text-stone-600">N° de suivi : </span>
                                    </div>
                                    {order.tracking_url ? (
                                        <a href={order.tracking_url} target="_blank" rel="noopener noreferrer" className="text-[#1a4731] font-mono text-sm hover:underline">
                                            {order.tracking_number}
                                        </a>
                                    ) : (
                                        <span className="font-mono text-sm text-stone-700">{order.tracking_number}</span>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="bg-white rounded-xl border border-stone-100 p-5">
                            <h3 className="font-semibold text-stone-800 mb-3 flex items-center gap-2">
                                <Clock size={16} className="text-[#1a4731]" /> Dates
                            </h3>
                            <div className="text-sm space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-stone-500">Commande</span>
                                    <span className="text-stone-700">{new Date(order.created_at).toLocaleDateString('fr-FR')}</span>
                                </div>
                                {order.shipped_at && (
                                    <div className="flex justify-between">
                                        <span className="text-stone-500">Expédition</span>
                                        <span className="text-stone-700">{new Date(order.shipped_at).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                )}
                                {order.delivered_at && (
                                    <div className="flex justify-between">
                                        <span className="text-stone-500">Livraison</span>
                                        <span className="text-stone-700">{new Date(order.delivered_at).toLocaleDateString('fr-FR')}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
