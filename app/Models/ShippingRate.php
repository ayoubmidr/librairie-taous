<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingRate extends Model
{
    protected $fillable = [
        'shipping_zone_id', 'name', 'type', 'rate',
        'min_weight', 'max_weight', 'min_order_amount', 'max_order_amount',
        'free_shipping_threshold', 'estimated_days_min', 'estimated_days_max', 'is_active',
    ];

    protected $casts = [
        'rate' => 'decimal:2',
        'min_weight' => 'decimal:3',
        'max_weight' => 'decimal:3',
        'min_order_amount' => 'decimal:2',
        'max_order_amount' => 'decimal:2',
        'free_shipping_threshold' => 'decimal:2',
        'is_active' => 'boolean',
    ];

    public function zone()
    {
        return $this->belongsTo(ShippingZone::class, 'shipping_zone_id');
    }

    public function calculateRate(float $orderTotal, float $weight): float
    {
        if ($this->free_shipping_threshold && $orderTotal >= $this->free_shipping_threshold) {
            return 0;
        }
        return (float) $this->rate;
    }
}
