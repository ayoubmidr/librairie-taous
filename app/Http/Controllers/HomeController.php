<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\FormatsProducts;
use App\Models\Banner;
use App\Models\Category;
use App\Models\Product;
use App\Models\Review;
use Inertia\Inertia;

class HomeController extends Controller
{
    use FormatsProducts;
    public function index()
    {
        $newProducts = Product::active()->new()
            ->with(['category', 'authors', 'images' => fn($q) => $q->where('is_primary', true)])
            ->latest()
            ->take(10)
            ->get()
            ->map(fn($p) => $this->formatProduct($p));

        $bestsellerProducts = Product::active()->bestseller()
            ->with(['category', 'authors', 'images' => fn($q) => $q->where('is_primary', true)])
            ->orderBy('sales_count', 'desc')
            ->take(10)
            ->get()
            ->map(fn($p) => $this->formatProduct($p));

        $saleProducts = Product::active()->onSale()
            ->with(['category', 'authors', 'images' => fn($q) => $q->where('is_primary', true)])
            ->take(10)
            ->get()
            ->map(fn($p) => $this->formatProduct($p));

        $preorderProducts = Product::active()->preorder()
            ->with(['category', 'authors', 'images' => fn($q) => $q->where('is_primary', true)])
            ->take(8)
            ->get()
            ->map(fn($p) => $this->formatProduct($p));

        $featuredProducts = Product::active()->featured()
            ->with(['category', 'authors', 'images' => fn($q) => $q->where('is_primary', true)])
            ->take(8)
            ->get()
            ->map(fn($p) => $this->formatProduct($p));

        $banners = Banner::active()->forPosition('home_hero')->get();

        $recentReviews = Review::where('is_approved', true)
            ->latest()
            ->take(4)
            ->get();

        return Inertia::render('Home', [
            'newProducts' => $newProducts,
            'bestsellerProducts' => $bestsellerProducts,
            'saleProducts' => $saleProducts,
            'preorderProducts' => $preorderProducts,
            'featuredProducts' => $featuredProducts,
            'banners' => $banners,
            'recentReviews' => $recentReviews,
        ]);
    }

}
