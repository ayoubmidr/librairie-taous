<?php

namespace App\Http\Controllers;

use App\Models\InternationalShippingRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShippingRequestController extends Controller
{
    public function show()
    {
        $cart = array_values(session('cart', []));
        $subtotal = collect($cart)->sum(fn($item) => $item['price'] * $item['quantity']);

        return Inertia::render('ShippingRequest', [
            'cart'     => $cart,
            'subtotal' => round($subtotal, 2),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'    => 'required|string|max:255',
            'email'   => 'required|email|max:255',
            'phone'   => 'nullable|string|max:30',
            'country' => 'required|string|max:100',
            'message' => 'nullable|string|max:3000',
        ]);

        $cart = array_values(session('cart', []));
        $subtotal = collect($cart)->sum(fn($item) => $item['price'] * $item['quantity']);

        InternationalShippingRequest::create(array_merge($validated, [
            'cart_summary' => [
                'items'    => collect($cart)->map(fn($item) => [
                    'name'     => $item['product_name'],
                    'quantity' => $item['quantity'],
                    'price'    => $item['price'],
                ]),
                'subtotal' => round($subtotal, 2),
            ],
        ]));

        return back()->with('success', 'Votre demande a bien été envoyée ! Nous vous contacterons rapidement par WhatsApp ou email avec un tarif personnalisé.');
    }
}
