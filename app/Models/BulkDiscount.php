<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BulkDiscount extends Model
{
    protected $fillable = [
        'product_id', 'publisher_id', 'min_quantity',
        'discount_percent', 'applies_to_all_editions_taous', 'is_active',
    ];

    protected $casts = [
        'applies_to_all_editions_taous' => 'boolean',
        'is_active' => 'boolean',
        'discount_percent' => 'decimal:2',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function publisher()
    {
        return $this->belongsTo(Publisher::class);
    }
}
