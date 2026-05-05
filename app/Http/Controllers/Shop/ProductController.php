<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Concerns\FormatsProducts;
use App\Models\Category;
use App\Models\Product;
use App\Models\Publisher;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    use FormatsProducts;

    public function index(Request $request)
    {
        $query = Product::active()
            ->with(['category', 'authors', 'images' => fn($q) => $q->where('is_primary', true)]);

        $this->applyFilters($query, $request);

        $products = $query->paginate(24)->through(fn($p) => $this->formatProduct($p));
        $categories = Category::where('is_active', true)->orderBy('sort_order')->get();
        $publishers = Publisher::where('is_active', true)->orderBy('name')->get(['id', 'name', 'slug', 'is_our_editions']);

        return Inertia::render('Shop/Index', [
            'products' => $products,
            'categories' => $categories,
            'publishers' => $publishers,
            'filters' => $request->only(['price', 'category', 'availability', 'language', 'publisher', 'is_new', 'sort']),
            'title' => 'Tous les livres',
        ]);
    }

    public function show(Product $product)
    {
        if ($product->status !== 'active') abort(404);

        $product->increment('views_count');

        $product->load([
            'category', 'publisher', 'authors', 'tags',
            'images',
            'bulkDiscounts' => fn($q) => $q->where('is_active', true)->orderBy('min_quantity'),
            'approvedReviews',
        ]);

        $relatedProducts = Product::active()
            ->where('id', '!=', $product->id)
            ->where('category_id', $product->category_id)
            ->with(['category', 'authors', 'images' => fn($q) => $q->where('is_primary', true)])
            ->take(5)
            ->get()
            ->map(fn($p) => $this->formatProduct($p));

        return Inertia::render('Shop/Product', [
            'product' => [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'isbn' => $product->isbn,
                'short_description' => $product->short_description,
                'description' => $product->description,
                'price' => $product->price,
                'compare_price' => $product->compare_price,
                'discount_percent' => $product->discount_percent,
                'reseller_price' => $product->reseller_price,
                'wholesaler_price' => $product->wholesaler_price,
                'stock' => $product->stock,
                'type' => $product->type,
                'preorder_date' => $product->preorder_date,
                'preorder_message' => $product->preorder_message,
                'language' => $product->language,
                'format' => $product->format,
                'pages' => $product->pages,
                'weight' => $product->weight,
                'is_new' => $product->is_new,
                'is_bestseller' => $product->is_bestseller,
                'is_on_sale' => $product->is_on_sale,
                'is_out_of_stock' => $product->is_out_of_stock,
                'is_low_stock' => $product->is_low_stock,
                'main_image_url' => $product->main_image_url,
                'images' => $product->images->map(fn($i) => ['url' => $i->url, 'alt' => $i->alt])->toArray(),
                'category' => $product->category ? ['name' => $product->category->name, 'slug' => $product->category->slug] : null,
                'publisher' => $product->publisher ? ['name' => $product->publisher->name, 'slug' => $product->publisher->slug] : null,
                'authors' => $product->authors->map(fn($a) => ['name' => $a->name])->toArray(),
                'bulk_discounts' => $product->bulkDiscounts->map(fn($d) => [
                    'min_quantity' => $d->min_quantity,
                    'discount_percent' => $d->discount_percent,
                    'is_active' => $d->is_active,
                ])->toArray(),
                'average_rating' => round($product->approvedReviews->avg('rating') ?? 0, 1),
                'reviews_count' => $product->approvedReviews->count(),
                'in_wishlist' => auth()->check() ? auth()->user()->wishlists()->where('product_id', $product->id)->exists() : false,
                'meta_title' => $product->meta_title,
                'meta_description' => $product->meta_description,
            ],
            'relatedProducts' => $relatedProducts,
            'reviews' => $product->approvedReviews->map(fn($r) => [
                'id' => $r->id,
                'author_name' => $r->author_name,
                'rating' => $r->rating,
                'title' => $r->title,
                'content' => $r->content,
                'is_verified_purchase' => $r->is_verified_purchase,
                'created_at' => $r->created_at,
            ])->toArray(),
        ]);
    }

    public function category(Request $request, string $slug)
    {
        $category = Category::where('slug', $slug)->where('is_active', true)->firstOrFail();

        $query = Product::active()
            ->where('category_id', $category->id)
            ->with(['category', 'authors', 'images' => fn($q) => $q->where('is_primary', true)]);

        $this->applyFilters($query, $request);

        $products = $query->paginate(24)->through(fn($p) => $this->formatProduct($p));
        $categories = Category::where('is_active', true)->orderBy('sort_order')->get();
        $publishers = Publisher::where('is_active', true)->orderBy('name')->get(['id', 'name', 'slug', 'is_our_editions']);

        return Inertia::render('Shop/Index', [
            'products' => $products,
            'categories' => $categories,
            'publishers' => $publishers,
            'currentCategory' => $category,
            'filters' => $request->only(['price', 'category', 'availability', 'language', 'publisher', 'is_new', 'sort']),
            'title' => $category->name,
        ]);
    }

    public function newProducts()
    {
        $products = Product::active()->where('is_new', true)
            ->with(['category', 'authors', 'images' => fn($q) => $q->where('is_primary', true)])
            ->latest()
            ->paginate(24)
            ->through(fn($p) => $this->formatProduct($p));

        $publishers = Publisher::where('is_active', true)->orderBy('name')->get(['id', 'name', 'slug', 'is_our_editions']);

        return Inertia::render('Shop/Index', [
            'products' => $products,
            'categories' => Category::where('is_active', true)->get(),
            'publishers' => $publishers,
            'filters' => [],
            'title' => 'Nouveautés',
        ]);
    }

    public function bestsellers()
    {
        $publishers = Publisher::where('is_active', true)->orderBy('name')->get(['id', 'name', 'slug', 'is_our_editions']);

        return $this->filteredPage('is_bestseller', true, 'Meilleures ventes', 'Shop/Index', $publishers);
    }

    public function saleProducts()
    {
        $products = Product::active()->onSale()
            ->orderBy('discount_percent', 'desc')
            ->with(['category', 'authors', 'images' => fn($q) => $q->where('is_primary', true)])
            ->paginate(24)
            ->through(fn($p) => $this->formatProduct($p));

        $publishers = Publisher::where('is_active', true)->orderBy('name')->get(['id', 'name', 'slug', 'is_our_editions']);

        return Inertia::render('Shop/Index', [
            'products' => $products,
            'categories' => Category::where('is_active', true)->get(),
            'publishers' => $publishers,
            'filters' => [],
            'title' => 'Promotions',
        ]);
    }

    public function preorders()
    {
        $publishers = Publisher::where('is_active', true)->orderBy('name')->get(['id', 'name', 'slug', 'is_our_editions']);

        $products = Product::active()->preorder()
            ->with(['category', 'authors', 'images' => fn($q) => $q->where('is_primary', true)])
            ->paginate(24)
            ->through(fn($p) => $this->formatProduct($p));

        return Inertia::render('Shop/Index', [
            'products' => $products,
            'categories' => Category::where('is_active', true)->get(),
            'publishers' => $publishers,
            'filters' => [],
            'title' => 'Précommandes',
        ]);
    }

    public function packs()
    {
        $products = Product::active()->where('type', 'pack')
            ->with(['category', 'authors', 'images' => fn($q) => $q->where('is_primary', true)])
            ->paginate(24)
            ->through(fn($p) => $this->formatProduct($p));

        return Inertia::render('Shop/Packs', [
            'products' => $products,
        ]);
    }

    private function filteredPage(string $field, $value, string $title, string $view, $publishers = [])
    {
        $products = Product::active()->where($field, $value)
            ->with(['category', 'authors', 'images' => fn($q) => $q->where('is_primary', true)])
            ->paginate(24)
            ->through(fn($p) => $this->formatProduct($p));

        return Inertia::render($view, [
            'products' => $products,
            'categories' => Category::where('is_active', true)->get(),
            'publishers' => $publishers,
            'filters' => [],
            'title' => $title,
        ]);
    }

    private function applyFilters($query, Request $request): void
    {
        if ($category = $request->get('category')) {
            $query->whereHas('category', fn($q) => $q->where('slug', $category));
        }

        if ($publisher = $request->get('publisher')) {
            $query->whereHas('publisher', fn($q) => $q->where('slug', $publisher));
        }

        if ($request->get('is_new')) {
            $query->where('is_new', true);
        }

        if ($price = $request->get('price')) {
            [$min, $max] = explode('-', $price);
            $query->whereBetween('price', [(float)$min, (float)$max]);
        }

        if ($availability = $request->get('availability')) {
            if ($availability === 'in_stock') $query->where('stock', '>', 0)->where('type', '!=', 'preorder');
            if ($availability === 'preorder') $query->where('type', 'preorder');
        }

        if ($language = $request->get('language')) {
            $query->where('language', $language);
        }

        $sort = $request->get('sort', 'newest');
        match($sort) {
            'price_asc' => $query->orderBy('price'),
            'price_desc' => $query->orderBy('price', 'desc'),
            'bestselling' => $query->orderBy('sales_count', 'desc'),
            'name_asc' => $query->orderBy('name'),
            default => $query->latest(),
        };
    }
}
