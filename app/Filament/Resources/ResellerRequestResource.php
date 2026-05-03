<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ResellerRequestResource\Pages;
use App\Models\ResellerRequest;
use App\Models\User;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ResellerRequestResource extends Resource
{
    protected static ?string $model = ResellerRequest::class;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\TextInput::make('company_name')->label('Entreprise')->disabled(),
            Forms\Components\TextInput::make('contact_name')->label('Contact')->disabled(),
            Forms\Components\TextInput::make('email')->label('Email')->disabled(),
            Forms\Components\TextInput::make('phone')->label('Téléphone')->disabled(),
            Forms\Components\TextInput::make('country')->label('Pays')->disabled(),
            Forms\Components\TextInput::make('vat_number')->label('N° TVA')->disabled(),
            Forms\Components\Select::make('type')->label('Type')
                ->options(['reseller' => 'Revendeur', 'wholesaler' => 'Grossiste'])->disabled(),
            Forms\Components\Textarea::make('message')->label('Message')->disabled()->columnSpanFull(),
            Forms\Components\Select::make('status')
                ->label('Statut')
                ->options(['pending' => 'En attente', 'approved' => 'Approuvé', 'rejected' => 'Refusé'])
                ->live(),
            Forms\Components\Textarea::make('admin_notes')->label('Notes admin')->rows(3)->columnSpanFull(),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('company_name')->label('Entreprise')->searchable(),
                Tables\Columns\TextColumn::make('contact_name')->label('Contact'),
                Tables\Columns\TextColumn::make('email')->searchable(),
                Tables\Columns\TextColumn::make('country')->label('Pays'),
                Tables\Columns\BadgeColumn::make('type')->colors(['primary' => 'reseller', 'warning' => 'wholesaler']),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors(['warning' => 'pending', 'success' => 'approved', 'danger' => 'rejected']),
                Tables\Columns\TextColumn::make('created_at')->label('Date')->dateTime('d/m/Y'),
            ])
            ->defaultSort('created_at', 'desc')
            ->actions([Tables\Actions\EditAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListResellerRequests::route('/'),
            'edit' => Pages\EditResellerRequest::route('/{record}/edit'),
        ];
    }
}
