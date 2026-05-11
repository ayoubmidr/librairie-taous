<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        $cart = $this->getFormattedCart();
        $summary = $this->calculateSummary();

        return Inertia::render('Cart', [
            'cart' => $cart,
            'summary' => $summary,
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'integer|min:1|max:100',
        ]);

        $product = Product::findOrFail($request->product_id);

        if (!$product->is_available) {
            return response()->json(['message' => 'Ce produit n\'est pas disponible.'], 422);
        }

        $cart = session('cart', []);
        $key = 'product_' . $product->id;

        $quantity = $request->get('quantity', 1);

        if (isset($cart[$key])) {
            $cart[$key]['quantity'] += $quantity;
        } else {
            $cart[$key] = [
                'id' => $key,
                'product_id' => $product->id,
                'product_name' => $product->name,
                'product_slug' => $product->slug,
                'image' => $product->main_image_url,
                'price' => (float) $product->price,
                'quantity' => $quantity,
                'is_preorder' => $product->type === 'preorder',
                'preorder_date' => $product->preorder_date,
                'authors' => $product->authors->pluck('name')->join(', '),
            ];
        }

        session(['cart' => $cart]);

        return response()->json(['message' => 'Ajouté au panier', 'cart_count' => collect($cart)->sum('quantity')]);
    }

    public function update(Request $request, string $itemId)
    {
        $request->validate(['quantity' => 'required|integer|min:1|max:100']);

        $cart = session('cart', []);

        if (isset($cart[$itemId])) {
            $cart[$itemId]['quantity'] = $request->quantity;
            session(['cart' => $cart]);
        }

        return response()->json(['success' => true]);
    }

    public function remove(string $itemId)
    {
        $cart = session('cart', []);
        unset($cart[$itemId]);
        session(['cart' => $cart]);

        return response()->json(['success' => true]);
    }

    public function applyCoupon(Request $request)
    {
        $request->validate(['code' => 'required|string']);

        $coupon = Coupon::where('code', strtoupper($request->code))->first();

        if (!$coupon || !$coupon->isValid()) {
            return response()->json(['message' => 'Code promo invalide ou expiré.'], 422);
        }

        session(['coupon_code' => $coupon->code]);

        return response()->json(['success' => true, 'discount' => $coupon->value]);
    }

    public function removeCoupon()
    {
        session()->forget('coupon_code');
        return response()->json(['success' => true]);
    }

    private function getFormattedCart(): array
    {
        return array_values(session('cart', []));
    }

    private function calculateSummary(): array
    {
        $cart = session('cart', []);
        $subtotal = collect($cart)->sum(fn($item) => $item['price'] * $item['quantity']);

        $couponDiscount = 0;
        if ($code = session('coupon_code')) {
            $coupon = Coupon::where('code', $code)->where('is_active', true)->first();
            if ($coupon) {
                $couponDiscount = $coupon->calculateDiscount($subtotal);
            }
        }

        $shipping = $subtotal >= 50 ? 0 : 5.90;
        $total = max(0, $subtotal - $couponDiscount + $shipping);

        return [
            'subtotal' => round($subtotal, 2),
            'coupon_discount' => round($couponDiscount, 2),
            'coupon' => session('coupon_code'),
            'shipping' => $shipping,
            'total' => round($total, 2),
        ];
    }
}
