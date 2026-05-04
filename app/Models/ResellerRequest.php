<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ResellerRequest extends Model
{
    protected $fillable = [
        'user_id', 'company_name', 'contact_name', 'email', 'phone',
        'country', 'city', 'vat_number', 'website', 'type',
        'message', 'status', 'admin_notes', 'reviewed_at',
    ];

    protected $casts = ['reviewed_at' => 'datetime'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
