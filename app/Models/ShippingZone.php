<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ShippingZone extends Model
{
    protected $fillable = ['name', 'countries', 'is_active', 'sort_order'];

    protected $casts = [
        'countries' => 'array',
        'is_active' => 'boolean',
    ];

    public function rates()
    {
        return $this->hasMany(ShippingRate::class);
    }

    public static function findForCountry(string $country): ?self
    {
        return self::where('is_active', true)
            ->get()
            ->first(fn($zone) => in_array($country, $zone->countries));
    }
}
