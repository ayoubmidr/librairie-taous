<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PublisherResource\Pages;
use App\Models\Publisher;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class PublisherResource extends Resource
{
    protected static ?string $model = Publisher::class;
    protected static ?string $label = 'Maison d\'édition';
    protected static ?string $pluralLabel = 'Maisons d\'édition';
    protected static ?int $navigationSort = 4;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\TextInput::make('name')->label('Nom')->required(),
            Forms\Components\TextInput::make('slug')->label('Slug')->unique(ignoreRecord: true),
            Forms\Components\FileUpload::make('logo')->label('Logo')->image()->directory('publishers'),
            Forms\Components\TextInput::make('website')->label('Site web'),
            Forms\Components\TextInput::make('country')->label('Pays'),
            Forms\Components\Textarea::make('description')->label('Description')->rows(4)->columnSpanFull(),
            Forms\Components\Toggle::make('is_our_editions')->label('Nos propres éditions (Éditions Taous)'),
            Forms\Components\Toggle::make('is_active')->label('Actif')->default(true),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('logo')->disk('public')->size(40),
                Tables\Columns\TextColumn::make('name')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('products_count')->label('Produits')->counts('products'),
                Tables\Columns\IconColumn::make('is_our_editions')->label('Éditions Taous')->boolean(),
                Tables\Columns\IconColumn::make('is_active')->label('Actif')->boolean(),
            ])
            ->actions([Tables\Actions\EditAction::make(), Tables\Actions\DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPublishers::route('/'),
            'create' => Pages\CreatePublisher::route('/create'),
            'edit' => Pages\EditPublisher::route('/{record}/edit'),
        ];
    }
}
