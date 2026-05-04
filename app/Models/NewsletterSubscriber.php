<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NewsletterSubscriber extends Model
{
    protected $fillable = ['email', 'name', 'is_active', 'confirmed_at'];

    protected $casts = [
        'is_active' => 'boolean',
        'confirmed_at' => 'datetime',
    ];
}
