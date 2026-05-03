<?php

namespace App\Http\Controllers\Checkout;

use App\Http\Controllers\Controller;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ShippingRate;
use App\Models\ShippingZone;
use App\Notifications\OrderConfirmed;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class CheckoutController extends Controller
{
    public function index()
    {
        $cart = session('cart', []);

        if (empty($cart)) {
            return redirect()->route('cart.index');
        }

        $summary = $this->calculateSummary();

        return Inertia::render('Checkout/Index', [
            'cart' => array_values($cart),
            'summary' => $summary,
            'shippingRates' => null,
            'savedAddresses' => auth()->check() ? auth()->user()->addresses : [],
        ]);
    }

    public function shippingRates(Request $request)
    {
        $zone = ShippingZone::findForCountry($request->country);
        $rates = $zone ? $zone->rates()->where('is_active', true)->get() : collect();

        return response()->json($rates);
    }

    public function createPaymentIntent(Request $request)
    {
        $request->validate([
            'shipping_address' => 'required|array',
            'shipping_address.first_name' => 'required|string',
            'shipping_address.last_name' => 'required|string',
            'shipping_address.email' => 'required|email',
            'shipping_address.address_line1' => 'required|string',
            'shipping_address.city' => 'required|string',
            'shipping_address.postal_code' => 'required|string',
            'shipping_address.country' => 'required|string|size:2',
        ]);

        $cart = session('cart', []);
        if (empty($cart)) {
            return response()->json(['message' => 'Panier vide'], 422);
        }

        $summary = $this->calculateSummary();

        DB::beginTransaction();
        try {
            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => auth()->id(),
                'first_name' => $request->shipping_address['first_name'],
                'last_name' => $request->shipping_address['last_name'],
                'email' => $request->shipping_address['email'],
                'phone' => $request->shipping_address['phone'] ?? null,
                'shipping_address' => $request->shipping_address,
                'billing_address' => $request->shipping_address,
                'subtotal' => $summary['subtotal'],
                'shipping_cost' => $summary['shipping'],
                'discount_amount' => $summary['coupon_discount'],
                'tax_amount' => 0,
                'total' => $summary['total'],
                'coupon_code' => $summary['coupon'],
                'coupon_discount' => $summary['coupon_discount'],
                'status' => 'pending',
                'payment_status' => 'pending',
                'payment_method' => 'stripe',
                'has_preorder' => collect($cart)->some('is_preorder', true),
                'currency' => 'EUR',
            ]);

            $hasPreorder = false;
            foreach ($cart as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'product_name' => $item['product_name'],
                    'product_sku' => null,
                    'price' => $item['price'],
                    'original_price' => $item['price'],
                    'quantity' => $item['quantity'],
                    'total' => $item['price'] * $item['quantity'],
                    'is_preorder' => $item['is_preorder'] ?? false,
                    'preorder_date' => $item['preorder_date'] ?? null,
                ]);
                if ($item['is_preorder'] ?? false) $hasPreorder = true;
            }

            Stripe::setApiKey(config('services.stripe.secret'));
            $paymentIntent = PaymentIntent::create([
                'amount' => (int) ($summary['total'] * 100),
                'currency' => 'eur',
                'metadata' => ['order_number' => $order->order_number],
                'automatic_payment_methods' => ['enabled' => true],
            ]);

            $order->update(['stripe_payment_intent_id' => $paymentIntent->id]);

            DB::commit();

            session(['current_order' => $order->id]);

            return response()->json([
                'order_number' => $order->order_number,
                'client_secret' => $paymentIntent->client_secret,
                'stripe_key' => config('services.stripe.key'),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Erreur lors de la création de la commande: ' . $e->getMessage()], 500);
        }
    }

    public function payment(string $orderNumber)
    {
        $order = Order::where('order_number', $orderNumber)->firstOrFail();

        return Inertia::render('Checkout/Payment', [
            'order' => $order,
            'stripeKey' => config('services.stripe.key'),
        ]);
    }

    public function success(Request $request)
    {
        $orderId = session('current_order');
        $order = $orderId ? Order::with('items')->find($orderId) : null;

        if ($order) {
            $order->update(['status' => 'confirmed', 'payment_status' => 'paid']);

            foreach ($order->items as $item) {
                Product::where('id', $item->product_id)->increment('sales_count', $item->quantity);
                if (!($item->is_preorder)) {
                    Product::where('id', $item->product_id)->decrement('stock', $item->quantity);
                }
            }

            if ($coupon = session('coupon_code')) {
                Coupon::where('code', $coupon)->increment('used_count');
            }

            session()->forget(['cart', 'coupon_code', 'current_order']);

            try {
                $order->user?->notify(new OrderConfirmed($order));
            } catch (\Exception $e) {}
        }

        return Inertia::render('Checkout/Success', [
            'order' => $order ? [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'first_name' => $order->first_name,
                'email' => $order->email,
                'total' => $order->total,
                'shipping_cost' => $order->shipping_cost,
                'has_preorder' => $order->has_preorder,
                'items' => $order->items->map(fn($i) => [
                    'product_name' => $i->product_name,
                    'quantity' => $i->quantity,
                    'total' => $i->total,
                ])->toArray(),
            ] : null,
        ]);
    }

    public function stripeWebhook(Request $request)
    {
        Stripe::setApiKey(config('services.stripe.secret'));

        $payload = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        try {
            $event = \Stripe\Webhook::constructEvent(
                $payload, $sigHeader, config('services.stripe.webhook_secret')
            );
        } catch (\Exception $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        if ($event->type === 'payment_intent.succeeded') {
            $paymentIntent = $event->data->object;
            Order::where('stripe_payment_intent_id', $paymentIntent->id)
                ->update(['payment_status' => 'paid', 'status' => 'confirmed']);
        }

        return response()->json(['received' => true]);
    }

    private function calculateSummary(): array
    {
        $cart = session('cart', []);
        $subtotal = collect($cart)->sum(fn($item) => $item['price'] * $item['quantity']);

        $couponDiscount = 0;
        if ($code = session('coupon_code')) {
            $coupon = Coupon::where('code', $code)->where('is_active', true)->first();
            if ($coupon) $couponDiscount = $coupon->calculateDiscount($subtotal);
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
