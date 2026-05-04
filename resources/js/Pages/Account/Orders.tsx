import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { Order, OrderStatus, PaginatedData } from '@/types';

interface OrdersProps {
    orders: PaginatedData<Order>;
}

const STATUS_COLORS: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    confirmed: 'bg-blue-100 text-blue-700',
    preparing: 'bg-indigo-100 text-indigo-700',
    shipped: 'bg-purple-100 text-purple-700',
    delivered: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
    refunded: 'bg-gray-100 text-gray-700',
};

const STATUS_LABELS: Record<OrderStatus, string> = {
    pending: 'En attente', confirmed: 'Confirmée', preparing: 'En préparation',
    shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée', refunded: 'Remboursée',
};

export default function Orders({ orders }: OrdersProps) {
    return (
        <MainLayout title="Mes commandes">
            <div className="max-w-4xl mx-auto px-4 py-10">
                <div className="flex items-center gap-3 mb-8">
                    <Link href={route('account.index')} className="text-stone-400 hover:text-[#1a4731] text-sm">Mon compte</Link>
                    <span className="text-stone-300">/</span>
                    <h1 className="text-2xl font-serif font-bold text-[#0f2b1c]">Mes commandes</h1>
                </div>

                {orders?.data?.length > 0 ? (
                    <div className="space-y-3">
                        {orders.data.map(order => (
                            <Link
                                key={order.id}
                                href={route('account.orders.show', order.id)}
                                className="flex items-center gap-4 bg-white rounded-xl border border-stone-100 p-5 hover:shadow-sm transition-all"
                            >
                                <div className="w-12 h-12 bg-[#f5efe0] rounded-xl flex items-center justify-center flex-shrink-0">
                                    <ShoppingBag size={20} className="text-[#1a4731]" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-mono font-semibold text-stone-800">{order.order_number}</span>
                                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                                            {STATUS_LABELS[order.status] || order.status}
                                        </span>
                                    </div>
                                    <p className="text-stone-400 text-sm">
                                        {new Date(order.created_at).toLocaleDateString('fr-FR')} · {order.items_count} article{(order.items_count ?? 0) > 1 ? 's' : ''}
                                    </p>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="font-bold text-[#1a4731] text-lg">{parseFloat(String(order.total)).toFixed(2)} €</p>
                                </div>
                                <ChevronRight size={16} className="text-stone-300 flex-shrink-0" />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl border border-stone-100 p-16 text-center">
                        <ShoppingBag size={48} className="text-stone-200 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-stone-700 mb-2">Aucune commande</h2>
                        <p className="text-stone-500 mb-6">Vous n'avez pas encore passé de commande.</p>
                        <Link href={route('shop.index')} className="btn-primary">
                            Découvrir notre catalogue
                        </Link>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
