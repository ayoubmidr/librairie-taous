<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Models\Product;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;
    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\Tabs::make('Produit')->tabs([
                Forms\Components\Tabs\Tab::make('Général')->schema([
                    Forms\Components\TextInput::make('name')
                        ->label('Titre')->required()->maxLength(255)->live(onBlur: true),
                    Forms\Components\TextInput::make('slug')
                        ->label('Slug')->required()->unique(ignoreRecord: true),
                    Forms\Components\TextInput::make('sku')->label('SKU')->unique(ignoreRecord: true),
                    Forms\Components\TextInput::make('isbn')->label('ISBN'),
                    Forms\Components\Select::make('category_id')
                        ->label('Catégorie')
                        ->relationship('category', 'name')
                        ->searchable()->preload(),
                    Forms\Components\Select::make('publisher_id')
                        ->label('Maison d\'édition')
                        ->relationship('publisher', 'name')
                        ->searchable()->preload(),
                    Forms\Components\Select::make('authors')
                        ->label('Auteur(s)')
                        ->relationship('authors', 'name')
                        ->multiple()->searchable()->preload(),
                    Forms\Components\Select::make('tags')
                        ->label('Tags')
                        ->relationship('tags', 'name')
                        ->multiple()->searchable()->preload()->createOptionForm([
                            Forms\Components\TextInput::make('name')->required(),
                        ]),
                    Forms\Components\Textarea::make('short_description')
                        ->label('Description courte')->rows(3),
                    Forms\Components\RichEditor::make('description')
                        ->label('Description complète')->columnSpanFull(),
                ])->columns(2),

                Forms\Components\Tabs\Tab::make('Prix & Stock')->schema([
                    Forms\Components\TextInput::make('price')
                        ->label('Prix')->numeric()->prefix('€')->required(),
                    Forms\Components\TextInput::make('compare_price')
                        ->label('Prix barré (promo)')->numeric()->prefix('€'),
                    Forms\Components\TextInput::make('cost_price')
                        ->label('Prix coûtant')->numeric()->prefix('€'),
                    Forms\Components\TextInput::make('reseller_price')
                        ->label('Prix revendeur')->numeric()->prefix('€'),
                    Forms\Components\TextInput::make('wholesaler_price')
                        ->label('Prix grossiste')->numeric()->prefix('€'),
                    Forms\Components\TextInput::make('stock')
                        ->label('Stock')->numeric()->default(0),
                    Forms\Components\TextInput::make('low_stock_threshold')
                        ->label('Seuil stock bas')->numeric()->default(5),
                    Forms\Components\Toggle::make('track_stock')
                        ->label('Gérer le stock')->default(true),
                    Forms\Components\Toggle::make('bulk_discount_enabled')
                        ->label('Réductions volume activées'),
                ])->columns(2),

                Forms\Components\Tabs\Tab::make('Statut & Type')->schema([
                    Forms\Components\Select::make('status')
                        ->label('Statut')
                        ->options(['active' => 'Actif', 'inactive' => 'Inactif', 'draft' => 'Brouillon'])
                        ->default('active'),
                    Forms\Components\Select::make('type')
                        ->label('Type')
                        ->options(['simple' => 'Simple', 'preorder' => 'Précommande', 'pack' => 'Pack'])
                        ->default('simple'),
                    Forms\Components\DatePicker::make('preorder_date')
                        ->label('Date précommande estimée')
                        ->visible(fn ($get) => $get('type') === 'preorder'),
                    Forms\Components\Textarea::make('preorder_message')
                        ->label('Message précommande')
                        ->visible(fn ($get) => $get('type') === 'preorder'),
                    Forms\Components\Toggle::make('is_featured')->label('Mis en avant'),
                    Forms\Components\Toggle::make('is_new')->label('Nouveauté'),
                    Forms\Components\Toggle::make('is_bestseller')->label('Meilleure vente'),
                    Forms\Components\Toggle::make('is_on_sale')->label('En promotion'),
                ])->columns(2),

                Forms\Components\Tabs\Tab::make('Détails')->schema([
                    Forms\Components\Select::make('language')
                        ->label('Langue')
                        ->options(['fr' => 'Français', 'ar' => 'Arabe', 'en' => 'Anglais', 'bilingual' => 'Bilingue'])
                        ->default('fr'),
                    Forms\Components\TextInput::make('format')->label('Format'),
                    Forms\Components\TextInput::make('pages')->label('Nombre de pages')->numeric(),
                    Forms\Components\TextInput::make('weight')->label('Poids (kg)')->numeric(),
                    Forms\Components\TextInput::make('dimensions')->label('Dimensions'),
                ])->columns(2),

                Forms\Components\Tabs\Tab::make('Images')->schema([
                    Forms\Components\Repeater::make('images')
                        ->relationship()
                        ->schema([
                            Forms\Components\FileUpload::make('path')
                                ->label('Image')
                                ->image()
                                ->directory('products')
                                ->required(),
                            Forms\Components\TextInput::make('alt')->label('Alt text'),
                            Forms\Components\Toggle::make('is_primary')->label('Image principale'),
                            Forms\Components\TextInput::make('sort_order')->label('Ordre')->numeric()->default(0),
                        ])
                        ->columns(2)
                        ->columnSpanFull(),
                ]),

                Forms\Components\Tabs\Tab::make('SEO')->schema([
                    Forms\Components\TextInput::make('meta_title')->label('Meta Title'),
                    Forms\Components\Textarea::make('meta_description')->label('Meta Description')->rows(3),
                ])->columns(1),
            ])->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('images.path')
                    ->label('Image')
                    ->circular(false)
                    ->square()
                    ->size(50)
                    ->disk('public'),
                Tables\Columns\TextColumn::make('name')->label('Produit')->searchable()->sortable()->limit(40),
                Tables\Columns\TextColumn::make('category.name')->label('Catégorie')->sortable(),
                Tables\Columns\TextColumn::make('publisher.name')->label('Éditeur')->sortable(),
                Tables\Columns\TextColumn::make('price')->label('Prix')->money('EUR')->sortable(),
                Tables\Columns\TextColumn::make('stock')->label('Stock')->sortable()
                    ->color(fn ($record) => $record->stock <= 0 ? 'danger' : ($record->stock <= 5 ? 'warning' : 'success')),
                Tables\Columns\BadgeColumn::make('status')->label('Statut')
                    ->colors(['warning' => 'draft', 'danger' => 'inactive', 'success' => 'active']),
                Tables\Columns\BadgeColumn::make('type')->label('Type')
                    ->colors(['primary' => 'preorder', 'warning' => 'pack']),
                Tables\Columns\IconColumn::make('is_featured')->label('Mis en avant')->boolean(),
                Tables\Columns\IconColumn::make('is_new')->label('Nouveauté')->boolean(),
                Tables\Columns\TextColumn::make('sales_count')->label('Ventes')->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('status')->options(['active' => 'Actif', 'inactive' => 'Inactif', 'draft' => 'Brouillon']),
                Tables\Filters\SelectFilter::make('type')->options(['simple' => 'Simple', 'preorder' => 'Précommande', 'pack' => 'Pack']),
                Tables\Filters\SelectFilter::make('category_id')->label('Catégorie')->relationship('category', 'name'),
                Tables\Filters\TernaryFilter::make('is_featured')->label('Mis en avant'),
                Tables\Filters\TernaryFilter::make('is_new')->label('Nouveauté'),
                Tables\Filters\TernaryFilter::make('is_on_sale')->label('En promotion'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('created_at', 'desc');
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()->with(['category', 'publisher', 'images']);
    }
}
