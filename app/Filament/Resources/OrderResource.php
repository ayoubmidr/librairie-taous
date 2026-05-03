<?php

namespace App\Filament\Resources;

use App\Filament\Resources\OrderResource\Pages;
use App\Models\Order;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class OrderResource extends Resource
{
    protected static ?string $model = Order::class;
    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\Section::make('Informations commande')->schema([
                Forms\Components\TextInput::make('order_number')->label('N° commande')->disabled(),
                Forms\Components\Select::make('status')
                    ->label('Statut')
                    ->options([
                        'pending' => 'En attente',
                        'confirmed' => 'Confirmée',
                        'preparing' => 'En préparation',
                        'shipped' => 'Expédiée',
                        'delivered' => 'Livrée',
                        'cancelled' => 'Annulée',
                        'refunded' => 'Remboursée',
                    ]),
                Forms\Components\Select::make('payment_status')
                    ->label('Statut paiement')
                    ->options([
                        'pending' => 'En attente',
                        'paid' => 'Payé',
                        'failed' => 'Échoué',
                        'refunded' => 'Remboursé',
                    ]),
                Forms\Components\TextInput::make('tracking_number')->label('Numéro de suivi'),
                Forms\Components\TextInput::make('tracking_url')->label('URL de suivi'),
                Forms\Components\Textarea::make('admin_notes')->label('Notes admin')->rows(3),
            ])->columns(2),

            Forms\Components\Section::make('Client')->schema([
                Forms\Components\TextInput::make('first_name')->label('Prénom')->disabled(),
                Forms\Components\TextInput::make('last_name')->label('Nom')->disabled(),
                Forms\Components\TextInput::make('email')->label('Email')->disabled(),
                Forms\Components\TextInput::make('phone')->label('Téléphone')->disabled(),
            ])->columns(2),

            Forms\Components\Section::make('Montants')->schema([
                Forms\Components\TextInput::make('subtotal')->label('Sous-total')->prefix('€')->disabled(),
                Forms\Components\TextInput::make('shipping_cost')->label('Frais de livraison')->prefix('€')->disabled(),
                Forms\Components\TextInput::make('discount_amount')->label('Remise')->prefix('€')->disabled(),
                Forms\Components\TextInput::make('total')->label('Total')->prefix('€')->disabled(),
            ])->columns(2),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('order_number')->label('Commande')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('email')->label('Client')->searchable(),
                Tables\Columns\TextColumn::make('total')->label('Total')->money('EUR')->sortable(),
                Tables\Columns\BadgeColumn::make('status')->label('Statut')
                    ->colors([
                        'warning' => 'pending',
                        'primary' => 'confirmed',
                        'indigo' => 'preparing',
                        'purple' => 'shipped',
                        'success' => 'delivered',
                        'danger' => 'cancelled',
                        'gray' => 'refunded',
                    ])
                    ->formatStateUsing(fn ($state) => match($state) {
                        'pending' => 'En attente',
                        'confirmed' => 'Confirmée',
                        'preparing' => 'En préparation',
                        'shipped' => 'Expédiée',
                        'delivered' => 'Livrée',
                        'cancelled' => 'Annulée',
                        'refunded' => 'Remboursée',
                        default => $state,
                    }),
                Tables\Columns\BadgeColumn::make('payment_status')->label('Paiement')
                    ->colors(['warning' => 'pending', 'success' => 'paid', 'danger' => 'failed', 'gray' => 'refunded'])
                    ->formatStateUsing(fn ($state) => match($state) {
                        'pending' => 'En attente', 'paid' => 'Payé',
                        'failed' => 'Échoué', 'refunded' => 'Remboursé', default => $state,
                    }),
                Tables\Columns\IconColumn::make('has_preorder')->label('Préco')->boolean(),
                Tables\Columns\TextColumn::make('created_at')->label('Date')->dateTime('d/m/Y H:i')->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')->options([
                    'pending' => 'En attente', 'confirmed' => 'Confirmée',
                    'preparing' => 'En préparation', 'shipped' => 'Expédiée',
                    'delivered' => 'Livrée', 'cancelled' => 'Annulée',
                ]),
                Tables\Filters\SelectFilter::make('payment_status')->options([
                    'pending' => 'En attente', 'paid' => 'Payé',
                    'failed' => 'Échoué', 'refunded' => 'Remboursé',
                ]),
            ])
            ->actions([Tables\Actions\EditAction::make()])
            ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListOrders::route('/'),
            'edit' => Pages\EditOrder::route('/{record}/edit'),
        ];
    }
}
