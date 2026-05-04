<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    public function toggle(Request $request)
    {
        $request->validate(['product_id' => 'required|exists:products,id']);

        $user = $request->user();
        if (! $user) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        $productId = $request->product_id;
        $exists = $user->wishlists()->where('product_id', $productId)->exists();

        if ($exists) {
            $user->wishlists()->detach($productId);
            return response()->json(['added' => false]);
        }

        $user->wishlists()->attach($productId);
        return response()->json(['added' => true]);
    }
}
