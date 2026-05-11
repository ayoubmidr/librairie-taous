<?php

namespace App\Filament\Pages\Auth;

class Login extends \Filament\Pages\Auth\Login
{
    public function mount(): void
    {
        if (auth()->check()) {
            $this->redirect(filament()->getUrl());
            return;
        }

        $this->redirect(route('login'));
    }
}
