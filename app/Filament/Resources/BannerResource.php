<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BannerResource\Pages;
use App\Models\Banner;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class BannerResource extends Resource
{
    protected static ?string $model = Banner::class;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\TextInput::make('title')->label('Titre')->required(),
            Forms\Components\Textarea::make('subtitle')->label('Sous-titre')->rows(2),
            Forms\Components\FileUpload::make('image')->label('Image (desktop)')->image()->directory('banners')->required(),
            Forms\Components\FileUpload::make('mobile_image')->label('Image (mobile)')->image()->directory('banners'),
            Forms\Components\TextInput::make('button_text')->label('Texte bouton'),
            Forms\Components\TextInput::make('button_link')->label('Lien bouton'),
            Forms\Components\Select::make('position')
                ->label('Position')
                ->options([
                    'home_hero' => 'Accueil - Hero',
                    'home_promo' => 'Accueil - Promo',
                    'shop_top' => 'Boutique - Haut',
                ]),
            Forms\Components\TextInput::make('sort_order')->label('Ordre')->numeric()->default(0),
            Forms\Components\Toggle::make('is_active')->label('Actif')->default(true),
            Forms\Components\DateTimePicker::make('starts_at')->label('Début'),
            Forms\Components\DateTimePicker::make('ends_at')->label('Fin'),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')->disk('public')->size(60),
                Tables\Columns\TextColumn::make('title')->searchable(),
                Tables\Columns\TextColumn::make('position')->label('Position'),
                Tables\Columns\IconColumn::make('is_active')->label('Actif')->boolean(),
                Tables\Columns\TextColumn::make('sort_order')->label('Ordre')->sortable(),
            ])
            ->actions([Tables\Actions\EditAction::make(), Tables\Actions\DeleteAction::make()])
            ->reorderable('sort_order');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListBanners::route('/'),
            'create' => Pages\CreateBanner::route('/create'),
            'edit' => Pages\EditBanner::route('/{record}/edit'),
        ];
    }
}
