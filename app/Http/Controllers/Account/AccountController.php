<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccountController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        $user = auth()->user();
        $recentOrders = $user->orders()
            ->with('items')
            ->latest()
            ->take(5)
            ->get()
            ->map(fn($o) => [
                'id' => $o->id,
                'order_number' => $o->order_number,
                'status' => $o->status,
                'total' => $o->total,
                'items_count' => $o->items->count(),
                'created_at' => $o->created_at,
            ]);

        return Inertia::render('Account/Index', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'reseller_status' => $user->reseller_status,
                'company_name' => $user->company_name,
            ],
            'recentOrders' => $recentOrders,
            'ordersCount' => $user->orders()->count(),
            'wishlistCount' => $user->wishlists()->count(),
        ]);
    }

    public function orders()
    {
        $orders = auth()->user()->orders()
            ->with('items')
            ->latest()
            ->paginate(10)
            ->through(fn($o) => [
                'id' => $o->id,
                'order_number' => $o->order_number,
                'status' => $o->status,
                'payment_status' => $o->payment_status,
                'total' => $o->total,
                'items_count' => $o->items->count(),
                'created_at' => $o->created_at,
                'tracking_number' => $o->tracking_number,
            ]);

        return Inertia::render('Account/Orders', ['orders' => $orders]);
    }

    public function showOrder(Order $order)
    {
        if ($order->user_id !== auth()->id()) abort(403);

        $order->load('items.product');

        return Inertia::render('Account/OrderDetail', [
            'order' => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'status_label' => $order->status_label,
                'payment_status' => $order->payment_status,
                'shipping_address' => $order->shipping_address,
                'subtotal' => $order->subtotal,
                'shipping_cost' => $order->shipping_cost,
                'discount_amount' => $order->discount_amount,
                'total' => $order->total,
                'tracking_number' => $order->tracking_number,
                'tracking_url' => $order->tracking_url,
                'shipped_at' => $order->shipped_at,
                'delivered_at' => $order->delivered_at,
                'created_at' => $order->created_at,
                'has_preorder' => $order->has_preorder,
                'items' => $order->items->map(fn($i) => [
                    'id' => $i->id,
                    'product_name' => $i->product_name,
                    'price' => $i->price,
                    'quantity' => $i->quantity,
                    'total' => $i->total,
                    'is_preorder' => $i->is_preorder,
                    'product_slug' => $i->product?->slug,
                    'product_image' => $i->product?->main_image_url,
                ])->toArray(),
            ],
        ]);
    }

    public function wishlist()
    {
        $products = auth()->user()->wishlists()
            ->with(['category', 'images' => fn($q) => $q->where('is_primary', true)])
            ->paginate(16);

        return Inertia::render('Account/Wishlist', ['products' => $products]);
    }

    public function addresses()
    {
        return Inertia::render('Account/Addresses', [
            'addresses' => auth()->user()->addresses,
        ]);
    }

    public function settings()
    {
        return Inertia::render('Account/Settings', [
            'user' => auth()->user(),
        ]);
    }

    public function updateSettings(Request $request)
    {
        $user = auth()->user();
        $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
        ]);

        $user->update($request->only(['name', 'phone']));

        return back()->with('success', 'Profil mis à jour avec succès.');
    }

    public function storeAddress(Request $request)
    {
        $request->validate([
            'first_name'   => 'required|string|max:100',
            'last_name'    => 'required|string|max:100',
            'address_line1'=> 'required|string|max:255',
            'city'         => 'required|string|max:100',
            'postal_code'  => 'required|string|max:20',
            'country'      => 'required|string|max:2',
        ]);

        auth()->user()->addresses()->create($request->only([
            'first_name', 'last_name', 'address_line1', 'address_line2', 'city', 'postal_code', 'country',
        ]));

        return response()->json(['message' => 'Adresse ajoutée'], 201);
    }

    public function destroyAddress(int $id)
    {
        $address = auth()->user()->addresses()->findOrFail($id);
        $address->delete();

        return response()->json(['message' => 'Adresse supprimée']);
    }
}
