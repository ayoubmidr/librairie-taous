<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CategoryResource\Pages;
use App\Models\Category;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class CategoryResource extends Resource
{
    protected static ?string $model = Category::class;
    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\TextInput::make('name')->label('Nom')->required(),
            Forms\Components\TextInput::make('slug')->label('Slug')->unique(ignoreRecord: true),
            Forms\Components\Select::make('parent_id')
                ->label('Catégorie parente')
                ->relationship('parent', 'name')
                ->searchable()->preload()->nullable(),
            Forms\Components\FileUpload::make('image')->label('Image')->image()->directory('categories'),
            Forms\Components\TextInput::make('icon')->label('Icône'),
            Forms\Components\Textarea::make('description')->label('Description')->rows(3),
            Forms\Components\TextInput::make('sort_order')->label('Ordre')->numeric()->default(0),
            Forms\Components\Toggle::make('is_active')->label('Actif')->default(true),
            Forms\Components\Toggle::make('show_in_menu')->label('Afficher dans le menu')->default(true),
            Forms\Components\TextInput::make('meta_title')->label('Meta Title'),
            Forms\Components\Textarea::make('meta_description')->label('Meta Description')->rows(2),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('image')->label('Image')->disk('public')->size(40),
                Tables\Columns\TextColumn::make('name')->label('Nom')->searchable()->sortable(),
                Tables\Columns\TextColumn::make('parent.name')->label('Parent'),
                Tables\Columns\TextColumn::make('products_count')->label('Produits')
                    ->counts('products'),
                Tables\Columns\IconColumn::make('is_active')->label('Actif')->boolean(),
                Tables\Columns\IconColumn::make('show_in_menu')->label('Menu')->boolean(),
                Tables\Columns\TextColumn::make('sort_order')->label('Ordre')->sortable(),
            ])
            ->actions([Tables\Actions\EditAction::make(), Tables\Actions\DeleteAction::make()])
            ->reorderable('sort_order');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCategories::route('/'),
            'create' => Pages\CreateCategory::route('/create'),
            'edit' => Pages\EditCategory::route('/{record}/edit'),
        ];
    }
}
