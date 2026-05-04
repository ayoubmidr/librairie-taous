<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function index(Request $request)
    {
        $query = $request->get('q', '');

        $products = Product::with(['category', 'authors'])
            ->where('is_active', true)
            ->where(function ($q) use ($query) {
                $q->where('name', 'like', "%{$query}%")
                  ->orWhere('description', 'like', "%{$query}%")
                  ->orWhere('isbn', 'like', "%{$query}%")
                  ->orWhereHas('authors', fn($a) => $a->where('name', 'like', "%{$query}%"))
                  ->orWhereHas('publisher', fn($p) => $p->where('name', 'like', "%{$query}%"));
            })
            ->latest()
            ->paginate(24);

        return Inertia::render('Search', [
            'products' => $products,
            'query'    => $query,
        ]);
    }
}
