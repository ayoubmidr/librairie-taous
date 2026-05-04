<?php

namespace App\Http\Controllers\Concerns;

use App\Models\Product;

trait FormatsProducts
{
    protected function formatProduct(Product $product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'slug' => $product->slug,
            'price' => $product->price,
            'compare_price' => $product->compare_price,
            'discount_percent' => $product->discount_percent,
            'main_image_url' => $product->main_image_url,
            'category' => $product->category ? ['name' => $product->category->name, 'slug' => $product->category->slug] : null,
            'authors' => $product->authors->map(fn($a) => ['name' => $a->name])->toArray(),
            'is_new' => $product->is_new,
            'is_bestseller' => $product->is_bestseller,
            'is_on_sale' => $product->is_on_sale,
            'is_out_of_stock' => $product->is_out_of_stock,
            'is_low_stock' => $product->is_low_stock,
            'type' => $product->type,
            'preorder_date' => $product->preorder_date,
            'stock' => $product->stock,
            'average_rating' => $product->average_rating,
            'reviews_count' => $product->approvedReviews()->count(),
        ];
    }
}
