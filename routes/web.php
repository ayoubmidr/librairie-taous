<?php

use App\Http\Controllers\Account\AccountController;
use App\Http\Controllers\Checkout\CheckoutController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Shop\CartController;
use App\Http\Controllers\Shop\ProductController;
use App\Http\Controllers\StaticPageController;
use App\Http\Controllers\WishlistController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\DonationController;
use App\Http\Controllers\ResellerController;
use App\Http\Controllers\PublisherController;
use App\Http\Controllers\NewsletterController;
use App\Http\Controllers\ShippingRequestController;
use Illuminate\Support\Facades\Route;

// ─── Home ───────────────────────────────────────────────────────────────────
Route::get('/', [HomeController::class, 'index'])->name('home');

// ─── Shop ────────────────────────────────────────────────────────────────────
Route::prefix('boutique')->name('shop.')->group(function () {
    Route::get('/', [ProductController::class, 'index'])->name('index');
    Route::get('/nouveautes', [ProductController::class, 'newProducts'])->name('new');
    Route::get('/meilleures-ventes', [ProductController::class, 'bestsellers'])->name('bestsellers');
    Route::get('/promotions', [ProductController::class, 'saleProducts'])->name('sale');
    Route::get('/precommandes', [ProductController::class, 'preorders'])->name('preorders');
    Route::get('/packs', [ProductController::class, 'packs'])->name('packs');
    Route::get('/categorie/{slug}', [ProductController::class, 'category'])->name('category');
});

// ─── Products ────────────────────────────────────────────────────────────────
Route::get('/livres/{product:slug}', [ProductController::class, 'show'])->name('products.show');

// ─── Publishers ──────────────────────────────────────────────────────────────
Route::get('/maisons-edition', [PublisherController::class, 'index'])->name('publishers.index');
Route::get('/maisons-edition/{slug}', [PublisherController::class, 'show'])->name('publishers.show');

// ─── Search ──────────────────────────────────────────────────────────────────
Route::get('/recherche', [SearchController::class, 'index'])->name('search');

// ─── Cart ────────────────────────────────────────────────────────────────────
Route::prefix('panier')->name('cart.')->group(function () {
    Route::get('/', [CartController::class, 'index'])->name('index');
    Route::post('/ajouter', [CartController::class, 'add'])->name('add');
    Route::patch('/mettre-a-jour/{item}', [CartController::class, 'update'])->name('update');
    Route::delete('/supprimer/{item}', [CartController::class, 'remove'])->name('remove');
    Route::post('/code-promo', [CartController::class, 'applyCoupon'])->name('coupon');
    Route::delete('/code-promo', [CartController::class, 'removeCoupon'])->name('coupon.remove');
});

// ─── Checkout ────────────────────────────────────────────────────────────────
Route::prefix('commande')->name('checkout.')->group(function () {
    Route::get('/', [CheckoutController::class, 'index'])->name('index');
    Route::post('/frais-livraison', [CheckoutController::class, 'shippingRates'])->name('shipping-rates');
    Route::post('/creer-paiement', [CheckoutController::class, 'createPaymentIntent'])->name('create-payment-intent');
    Route::get('/paiement/{order}', [CheckoutController::class, 'payment'])->name('payment');
    Route::get('/confirmation', [CheckoutController::class, 'success'])->name('success');
});

// ─── Stripe Webhook ──────────────────────────────────────────────────────────
Route::post('/stripe/webhook', [CheckoutController::class, 'stripeWebhook'])->name('stripe.webhook');

// ─── Wishlist ────────────────────────────────────────────────────────────────
Route::post('/favoris/toggle', [WishlistController::class, 'toggle'])->name('wishlist.toggle');

// ─── Account ─────────────────────────────────────────────────────────────────
Route::prefix('mon-compte')->name('account.')->middleware('auth')->group(function () {
    Route::get('/', [AccountController::class, 'index'])->name('index');
    Route::get('/commandes', [AccountController::class, 'orders'])->name('orders');
    Route::get('/commandes/{order}', [AccountController::class, 'showOrder'])->name('orders.show');
    Route::get('/favoris', [AccountController::class, 'wishlist'])->name('wishlist');
    Route::get('/adresses', [AccountController::class, 'addresses'])->name('addresses');
    Route::post('/adresses', [AccountController::class, 'storeAddress'])->name('addresses.store');
    Route::delete('/adresses/{id}', [AccountController::class, 'destroyAddress'])->name('addresses.destroy');
    Route::get('/parametres', [AccountController::class, 'settings'])->name('settings');
    Route::put('/parametres', [AccountController::class, 'updateSettings'])->name('settings.update');
});

// ─── Static Pages ────────────────────────────────────────────────────────────
Route::get('/a-propos', [StaticPageController::class, 'about'])->name('about');
Route::get('/contact', [ContactController::class, 'show'])->name('contact');
Route::post('/contact', [ContactController::class, 'send'])->name('contact.send');
Route::get('/faq', [StaticPageController::class, 'faq'])->name('faq');
Route::get('/revendeurs', [ResellerController::class, 'show'])->name('resellers.index');
Route::post('/revendeurs/demande', [ResellerController::class, 'request'])->name('resellers.request');
Route::get('/don-sadaqa', [DonationController::class, 'show'])->name('donation');
Route::post('/don-sadaqa', [DonationController::class, 'store'])->name('donation.store');
Route::get('/suivi-commande', [StaticPageController::class, 'trackOrder'])->name('track-order');
Route::get('/pages/{slug}', [StaticPageController::class, 'show'])->name('pages.show');

// ─── International Shipping ───────────────────────────────────────────────────
Route::get('/livraison-internationale', [ShippingRequestController::class, 'show'])->name('shipping.international');
Route::post('/livraison-internationale', [ShippingRequestController::class, 'store'])->name('shipping.international.store');

// ─── Newsletter ───────────────────────────────────────────────────────────────
Route::post('/newsletter', [NewsletterController::class, 'subscribe'])->name('newsletter.subscribe');

// ─── Auth ─────────────────────────────────────────────────────────────────────
require __DIR__.'/auth.php';
