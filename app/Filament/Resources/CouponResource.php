<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CouponResource\Pages;
use App\Models\Coupon;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class CouponResource extends Resource
{
    protected static ?string $model = Coupon::class;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\TextInput::make('code')->label('Code')->required()->uppercase(),
            Forms\Components\TextInput::make('description')->label('Description'),
            Forms\Components\Select::make('type')
                ->label('Type')->options(['percent' => 'Pourcentage %', 'fixed' => 'Montant fixe €']),
            Forms\Components\TextInput::make('value')->label('Valeur')->numeric()->required(),
            Forms\Components\TextInput::make('min_order_amount')->label('Montant min. commande')->numeric()->prefix('€'),
            Forms\Components\TextInput::make('max_uses')->label('Utilisations max')->numeric(),
            Forms\Components\TextInput::make('max_uses_per_user')->label('Max par utilisateur')->numeric(),
            Forms\Components\DateTimePicker::make('starts_at')->label('Début'),
            Forms\Components\DateTimePicker::make('expires_at')->label('Expiration'),
            Forms\Components\Toggle::make('is_active')->label('Actif')->default(true),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('code')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('type')->formatStateUsing(fn ($state) => $state === 'percent' ? '%' : '€'),
                Tables\Columns\TextColumn::make('value')->label('Valeur'),
                Tables\Columns\TextColumn::make('used_count')->label('Utilisations'),
                Tables\Columns\TextColumn::make('expires_at')->label('Expiration')->dateTime('d/m/Y'),
                Tables\Columns\IconColumn::make('is_active')->label('Actif')->boolean(),
            ])
            ->actions([Tables\Actions\EditAction::make(), Tables\Actions\DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCoupons::route('/'),
            'create' => Pages\CreateCoupon::route('/create'),
            'edit' => Pages\EditCoupon::route('/{record}/edit'),
        ];
    }
}
