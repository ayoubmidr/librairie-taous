<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Product extends Model
{
    use HasSlug, SoftDeletes, Searchable;

    protected $fillable = [
        'name', 'slug', 'sku', 'isbn', 'short_description', 'description',
        'publisher_id', 'category_id', 'price', 'compare_price', 'cost_price',
        'reseller_price', 'wholesaler_price', 'stock', 'low_stock_threshold',
        'track_stock', 'status', 'type', 'preorder_date', 'preorder_message',
        'language', 'format', 'pages', 'weight', 'dimensions',
        'is_featured', 'is_new', 'is_bestseller', 'is_on_sale', 'is_digital',
        'bulk_discount_enabled', 'views_count', 'sales_count',
        'meta_title', 'meta_description',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'compare_price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'reseller_price' => 'decimal:2',
        'wholesaler_price' => 'decimal:2',
        'weight' => 'decimal:3',
        'preorder_date' => 'date',
        'track_stock' => 'boolean',
        'is_featured' => 'boolean',
        'is_new' => 'boolean',
        'is_bestseller' => 'boolean',
        'is_on_sale' => 'boolean',
        'is_digital' => 'boolean',
        'bulk_discount_enabled' => 'boolean',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->short_description,
            'authors' => $this->authors->pluck('name')->join(', '),
            'publisher' => $this->publisher?->name,
            'category' => $this->category?->name,
            'isbn' => $this->isbn,
            'language' => $this->language,
            'price' => (float) $this->price,
            'is_new' => $this->is_new,
            'is_on_sale' => $this->is_on_sale,
            'status' => $this->status,
            'type' => $this->type,
        ];
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function publisher()
    {
        return $this->belongsTo(Publisher::class);
    }

    public function authors()
    {
        return $this->belongsToMany(Author::class, 'product_author');
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

    public function tags()
    {
        return $this->belongsToMany(Tag::class, 'product_tag');
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function approvedReviews()
    {
        return $this->hasMany(Review::class)->where('is_approved', true);
    }

    public function bulkDiscounts()
    {
        return $this->hasMany(BulkDiscount::class)->orderBy('min_quantity');
    }

    public function getIsAvailableAttribute(): bool
    {
        if ($this->status !== 'active') return false;
        if ($this->type === 'preorder') return true;
        if (!$this->track_stock) return true;
        return $this->stock > 0;
    }

    public function getIsOutOfStockAttribute(): bool
    {
        return $this->track_stock && $this->stock <= 0 && $this->type !== 'preorder';
    }

    public function getIsLowStockAttribute(): bool
    {
        return $this->track_stock && $this->stock > 0 && $this->stock <= $this->low_stock_threshold;
    }

    public function getDiscountPercentAttribute(): ?int
    {
        if (!$this->compare_price || $this->compare_price <= $this->price) return null;
        return (int) round((($this->compare_price - $this->price) / $this->compare_price) * 100);
    }

    public function getPriceForUser(?User $user): float
    {
        if ($user?->isApprovedWholesaler() && $this->wholesaler_price) {
            return (float) $this->wholesaler_price;
        }
        if ($user?->isApprovedReseller() && $this->reseller_price) {
            return (float) $this->reseller_price;
        }
        return (float) $this->price;
    }

    public function getBulkPriceForQuantity(int $quantity): float
    {
        if (!$this->bulk_discount_enabled) return (float) $this->price;

        $discount = $this->bulkDiscounts()
            ->where('min_quantity', '<=', $quantity)
            ->orderBy('min_quantity', 'desc')
            ->first();

        if (!$discount) return (float) $this->price;

        return round($this->price * (1 - $discount->discount_percent / 100), 2);
    }

    public function getMainImageUrlAttribute(): string
    {
        $primary = $this->images->firstWhere('is_primary', true) ?? $this->images->first();
        return $primary
            ? asset('storage/' . $primary->path)
            : asset('images/product-placeholder.jpg');
    }

    public function getAverageRatingAttribute(): float
    {
        return $this->approvedReviews->avg('rating') ?? 0;
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeNew($query)
    {
        return $query->where('is_new', true);
    }

    public function scopeBestseller($query)
    {
        return $query->where('is_bestseller', true);
    }

    public function scopeOnSale($query)
    {
        return $query->where('is_on_sale', true)->whereNotNull('compare_price');
    }

    public function scopePreorder($query)
    {
        return $query->where('type', 'preorder');
    }
}
