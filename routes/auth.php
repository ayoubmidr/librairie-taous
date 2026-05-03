<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\NewPasswordController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('connexion', [AuthenticatedSessionController::class, 'create'])->name('login');
    Route::post('connexion', [AuthenticatedSessionController::class, 'store']);

    Route::get('inscription', [RegisteredUserController::class, 'create'])->name('register');
    Route::post('inscription', [RegisteredUserController::class, 'store']);

    Route::get('mot-de-passe-oublie', [PasswordResetLinkController::class, 'create'])->name('password.request');
    Route::post('mot-de-passe-oublie', [PasswordResetLinkController::class, 'store'])->name('password.email');

    Route::get('reinitialiser-mot-de-passe/{token}', [NewPasswordController::class, 'create'])->name('password.reset');
    Route::post('reinitialiser-mot-de-passe', [NewPasswordController::class, 'store'])->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::post('deconnexion', [AuthenticatedSessionController::class, 'destroy'])->name('logout');
});
