<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Publisher extends Model
{
    use HasSlug;

    protected $fillable = [
        'name', 'slug', 'description', 'logo', 'website',
        'country', 'is_our_editions', 'is_active',
    ];

    protected $casts = [
        'is_our_editions' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function bulkDiscounts()
    {
        return $this->hasMany(BulkDiscount::class);
    }

    public function getLogoUrlAttribute(): ?string
    {
        return $this->logo ? asset('storage/' . $this->logo) : null;
    }
}
