<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverview extends BaseWidget
{
    protected function getStats(): array
    {
        $todayRevenue = Order::where('payment_status', 'paid')
            ->whereDate('created_at', today())
            ->sum('total');

        $monthRevenue = Order::where('payment_status', 'paid')
            ->whereMonth('created_at', now()->month)
            ->sum('total');

        $pendingOrders = Order::where('status', 'pending')->count();

        return [
            Stat::make('Chiffre d\'affaires aujourd\'hui', '€' . number_format($todayRevenue, 2))
                ->description('Commandes payées')
                ->color('success')
                ->icon('heroicon-o-banknotes'),

            Stat::make('CA ce mois', '€' . number_format($monthRevenue, 2))
                ->description('Mois en cours')
                ->color('primary')
                ->icon('heroicon-o-chart-bar'),

            Stat::make('Commandes en attente', $pendingOrders)
                ->description('À traiter')
                ->color('warning')
                ->icon('heroicon-o-clock'),

            Stat::make('Clients', User::where('role', 'customer')->count())
                ->description('Total clients inscrits')
                ->color('info')
                ->icon('heroicon-o-users'),

            Stat::make('Produits actifs', Product::where('status', 'active')->count())
                ->description('Dans le catalogue')
                ->color('gray')
                ->icon('heroicon-o-book-open'),

            Stat::make('Commandes totales', Order::count())
                ->description('Toutes commandes')
                ->color('gray')
                ->icon('heroicon-o-shopping-bag'),
        ];
    }
}
