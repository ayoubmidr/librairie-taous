<?php

namespace App\Filament\Resources;

use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class UserResource extends Resource
{
    protected static ?string $model = User::class;
    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\TextInput::make('name')->label('Nom')->required(),
            Forms\Components\TextInput::make('email')->label('Email')->email()->required(),
            Forms\Components\TextInput::make('phone')->label('Téléphone'),
            Forms\Components\Select::make('role')
                ->label('Rôle')
                ->options(['customer' => 'Client', 'reseller' => 'Revendeur', 'wholesaler' => 'Grossiste', 'admin' => 'Admin']),
            Forms\Components\Select::make('reseller_status')
                ->label('Statut revendeur')
                ->options(['pending' => 'En attente', 'approved' => 'Approuvé', 'rejected' => 'Refusé']),
            Forms\Components\TextInput::make('company_name')->label('Entreprise'),
            Forms\Components\TextInput::make('vat_number')->label('N° TVA'),
            Forms\Components\Select::make('country')
                ->label('Pays')
                ->options(['FR' => 'France', 'BE' => 'Belgique', 'CH' => 'Suisse', 'MA' => 'Maroc'])
                ->default('FR'),
            Forms\Components\Toggle::make('is_active')->label('Actif')->default(true),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->label('Nom')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('email')->label('Email')->searchable(),
                Tables\Columns\TextColumn::make('phone')->label('Téléphone'),
                Tables\Columns\BadgeColumn::make('role')->label('Rôle')
                    ->colors(['gray' => 'customer', 'warning' => 'reseller', 'danger' => 'wholesaler', 'success' => 'admin']),
                Tables\Columns\TextColumn::make('orders_count')->label('Commandes')->counts('orders')->sortable(),
                Tables\Columns\IconColumn::make('is_active')->label('Actif')->boolean(),
                Tables\Columns\TextColumn::make('created_at')->label('Inscrit le')->dateTime('d/m/Y')->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('role')->options(['customer' => 'Client', 'reseller' => 'Revendeur', 'wholesaler' => 'Grossiste']),
            ])
            ->actions([Tables\Actions\EditAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
