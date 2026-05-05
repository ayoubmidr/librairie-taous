<?php

namespace App\Http\Controllers;

use App\Models\Publisher;
use App\Models\Product;
use Inertia\Inertia;

class PublisherController extends Controller
{
    public function index()
    {
        $publishers = Publisher::withCount('products')
            ->orderByDesc('is_our_editions')
            ->orderBy('name')
            ->get();
        return Inertia::render('Publishers/Index', compact('publishers'));
    }

    public function show(string $slug)
    {
        $publisher = Publisher::where('slug', $slug)->firstOrFail();
        $products = Product::with(['category', 'authors'])
            ->where('publisher_id', $publisher->id)
            ->where('is_active', true)
            ->paginate(24);

        return Inertia::render('Publishers/Show', compact('publisher', 'products'));
    }
}
