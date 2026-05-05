<?php

namespace App\Http\Controllers;

use App\Models\Coupon;
use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    const WELCOME_CODE = 'BIENVENUE10';

    public function subscribe(Request $request)
    {
        $validated = $request->validate(['email' => 'required|email|max:255']);

        $subscriber = NewsletterSubscriber::where('email', $validated['email'])->first();

        if ($subscriber) {
            return response()->json([
                'message' => 'Vous êtes déjà abonné !',
                'already_subscribed' => true,
                'coupon_code' => self::WELCOME_CODE,
            ]);
        }

        NewsletterSubscriber::create(['email' => $validated['email'], 'is_active' => true]);

        Coupon::firstOrCreate(['code' => self::WELCOME_CODE], [
            'description' => '-10% pour les nouveaux abonnés newsletter',
            'type' => 'percent',
            'value' => 10,
            'is_active' => true,
        ]);

        return response()->json([
            'message' => 'Inscription réussie !',
            'coupon_code' => self::WELCOME_CODE,
        ]);
    }
}
