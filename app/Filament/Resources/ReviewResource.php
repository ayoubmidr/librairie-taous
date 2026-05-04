<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ReviewResource\Pages;
use App\Models\Review;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ReviewResource extends Resource
{
    protected static ?string $model = Review::class;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\Select::make('product_id')->label('Produit')
                ->relationship('product', 'name')->searchable()->required(),
            Forms\Components\TextInput::make('author_name')->label('Auteur')->required(),
            Forms\Components\TextInput::make('author_email')->label('Email'),
            Forms\Components\Select::make('rating')->label('Note')
                ->options([1 => '1 ★', 2 => '2 ★★', 3 => '3 ★★★', 4 => '4 ★★★★', 5 => '5 ★★★★★']),
            Forms\Components\TextInput::make('title')->label('Titre'),
            Forms\Components\Textarea::make('content')->label('Contenu')->rows(4)->columnSpanFull(),
            Forms\Components\Toggle::make('is_approved')->label('Approuvé'),
            Forms\Components\Toggle::make('is_verified_purchase')->label('Achat vérifié'),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('product.name')->label('Produit')->searchable()->limit(30),
                Tables\Columns\TextColumn::make('author_name')->label('Auteur')->searchable(),
                Tables\Columns\TextColumn::make('rating')->label('Note'),
                Tables\Columns\TextColumn::make('title')->label('Titre')->limit(40),
                Tables\Columns\IconColumn::make('is_approved')->label('Approuvé')->boolean(),
                Tables\Columns\TextColumn::make('created_at')->label('Date')->dateTime('d/m/Y'),
            ])
            ->filters([Tables\Filters\TernaryFilter::make('is_approved')->label('Approuvé')])
            ->actions([Tables\Actions\EditAction::make(), Tables\Actions\DeleteAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListReviews::route('/'),
            'edit' => Pages\EditReview::route('/{record}/edit'),
        ];
    }
}
