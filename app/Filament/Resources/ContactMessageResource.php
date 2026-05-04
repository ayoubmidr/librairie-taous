<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ContactMessageResource\Pages;
use App\Models\ContactMessage;
use Filament\Forms;
use Filament\Schemas\Schema;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class ContactMessageResource extends Resource
{
    protected static ?string $model = ContactMessage::class;

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Forms\Components\TextInput::make('name')->label('Nom')->disabled(),
            Forms\Components\TextInput::make('email')->label('Email')->disabled(),
            Forms\Components\TextInput::make('phone')->label('Téléphone')->disabled(),
            Forms\Components\TextInput::make('subject')->label('Sujet')->disabled(),
            Forms\Components\Textarea::make('message')->label('Message')->disabled()->rows(4)->columnSpanFull(),
            Forms\Components\Textarea::make('reply')->label('Réponse')->rows(4)->columnSpanFull(),
            Forms\Components\Toggle::make('is_read')->label('Lu'),
        ])->columns(2);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')->label('Nom')->searchable(),
                Tables\Columns\TextColumn::make('email')->label('Email')->searchable(),
                Tables\Columns\TextColumn::make('subject')->label('Sujet')->limit(40),
                Tables\Columns\BadgeColumn::make('type')->colors(['gray' => 'general', 'warning' => 'reseller', 'primary' => 'order']),
                Tables\Columns\IconColumn::make('is_read')->label('Lu')->boolean(),
                Tables\Columns\TextColumn::make('created_at')->label('Date')->dateTime('d/m/Y H:i')->sortable(),
            ])
            ->defaultSort('created_at', 'desc')
            ->actions([Tables\Actions\EditAction::make()]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListContactMessages::route('/'),
            'edit' => Pages\EditContactMessage::route('/{record}/edit'),
        ];
    }
}
