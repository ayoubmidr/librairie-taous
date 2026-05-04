<?php

namespace App\Filament\Resources\ResellerRequestResource\Pages;

use App\Filament\Resources\ResellerRequestResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditResellerRequest extends EditRecord
{
    protected static string $resource = ResellerRequestResource::class;

    protected function getHeaderActions(): array
    {
        return [Actions\DeleteAction::make()];
    }
}
