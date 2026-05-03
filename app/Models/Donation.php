<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Donation extends Model
{
    protected $fillable = [
        'user_id', 'product_id', 'donor_name', 'donor_email',
        'recipient_name', 'recipient_email', 'recipient_address',
        'amount', 'message', 'status', 'stripe_payment_intent_id',
    ];

    protected $casts = ['amount' => 'decimal:2'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
