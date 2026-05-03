import { Link } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import { Package, Heart, MapPin, Settings, ChevronRight, ShoppingBag, Clock } from 'lucide-react';
import { AuthUser, Order, OrderStatus } from '@/types';
import { ReactNode } from 'react';

interface OrderStatusBadgeProps {
    status: OrderStatus;
}

function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
    const colors: Record<OrderStatus, string> = {
        pending: 'bg-yellow-100 text-yellow-700',
        confirmed: 'bg-blue-100 text-blue-700',
        preparing: 'bg-indigo-100 text-indigo-700',
        shipped: 'bg-purple-100 text-purple-700',
        delivered: 'bg-green-100 text-green-700',
        cancelled: 'bg-red-100 text-red-700',
        refunded: 'bg-gray-100 text-gray-700',
    };
    const labels: Record<OrderStatus, string> = {
        pending: 'En attente', confirmed: 'Confirmée', preparing: 'En préparation',
        shipped: 'Expédiée', delivered: 'Livrée', cancelled: 'Annulée', refunded: 'Remboursée',
    };
    return (
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${colors[status] || 'bg-gray-100 text-gray-700'}`}>
            {labels[status] || status}
        </span>
    );
}

interface AccountIndexProps {
    user: AuthUser;
    recentOrders: Order[];
    ordersCount: number;
    wishlistCount: number;
}

interface MenuItem {
    href: string;
    icon: ReactNode;
    label: string;
    count?: number;
}

export default function AccountIndex({ user, recentOrders, ordersCount, wishlistCount }: AccountIndexProps) {
    const menuItems: MenuItem[] = [
        { href: route('account.orders'), icon: <Package size={20} />, label: 'Mes commandes', count: ordersCount },
        { href: route('account.wishlist'), icon: <Heart size={20} />, label: 'Mes favoris', count: wishlistCount },
        { href: route('account.addresses'), icon: <MapPin size={20} />, label: 'Mes adresses' },
        { href: route('account.settings'), icon: <Settings size={20} />, label: 'Paramètres' },
    ];

    return (
        <MainLayout title="Mon compte">
            <div className="max-w-5xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-16 h-16 bg-[#1a4731] rounded-2xl flex items-center justify-center text-white text-2xl font-serif font-bold">
                        {user.name[0]}
                    </div>
                    <div>
                        <h1 className="text-2xl font-serif font-bold text-[#0f2b1c]">{user.name}</h1>
                        <p className="text-stone-500">{user.email}</p>
                        {user.role === 'reseller' && user.reseller_status === 'approved' && (
                            <span className="inline-block mt-1 text-xs bg-[#c9a84c] text-white px-2 py-0.5 rounded-full font-semibold">
                                Revendeur approuvé
                            </span>
                        )}
                    </div>
                </div>

                {/* Quick Nav */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                    {menuItems.map((item) => (
                        <Link key={item.label} href={item.href} className="bg-white rounded-xl border border-stone-100 p-5 hover:border-[#1a4731] hover:shadow-sm transition-all group">
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-10 h-10 bg-[#f5efe0] rounded-lg flex items-center justify-center text-[#1a4731] group-hover:bg-[#1a4731] group-hover:text-white transition-colors">
                                    {item.icon}
                                </div>
                                {item.count !== undefined && (
                                    <span className="text-2xl font-bold text-[#1a4731]">{item.count}</span>
                                )}
                            </div>
                            <p className="font-medium text-stone-700 text-sm">{item.label}</p>
                        </Link>
                    ))}
                </div>

                {/* Recent Orders */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-serif font-semibold text-stone-800">Dernières commandes</h2>
                        <Link href={route('account.orders')} className="text-sm text-[#1a4731] hover:underline flex items-center gap-1">
                            Voir tout <ChevronRight size={14} />
                        </Link>
                    </div>

                    {recentOrders?.length > 0 ? (
                        <div className="space-y-3">
                            {recentOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={route('account.orders.show', order.id)}
                                    className="flex items-center gap-4 bg-white rounded-xl border border-stone-100 p-4 hover:border-stone-200 hover:shadow-sm transition-all"
                                >
                                    <div className="w-10 h-10 bg-[#f5efe0] rounded-lg flex items-center justify-center flex-shrink-0">
                                        <ShoppingBag size={18} className="text-[#1a4731]" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="font-mono text-sm font-semibold text-stone-800">{order.order_number}</span>
                                            <OrderStatusBadge status={order.status} />
                                        </div>
                                        <p className="text-stone-400 text-xs">
                                            {new Date(order.created_at).toLocaleDateString('fr-FR')} — {order.items_count} article{(order.items_count ?? 0) > 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-bold text-[#1a4731]">{parseFloat(String(order.total)).toFixed(2)} €</p>
                                    </div>
                                    <ChevronRight size={16} className="text-stone-300" />
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-stone-100 p-10 text-center">
                            <Clock size={40} className="text-stone-200 mx-auto mb-4" />
                            <p className="text-stone-500 mb-4">Vous n'avez pas encore de commandes</p>
                            <Link href={route('shop.index')} className="btn-primary text-sm">
                                Découvrir la boutique
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
