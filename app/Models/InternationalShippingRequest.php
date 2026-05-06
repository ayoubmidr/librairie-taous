<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InternationalShippingRequest extends Model
{
    protected $fillable = [
        'name',
        'email',
        'phone',
        'country',
        'cart_summary',
        'message',
        'status',
    ];

    protected $casts = [
        'cart_summary' => 'array',
    ];
}
