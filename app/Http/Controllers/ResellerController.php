<?php

namespace App\Http\Controllers;

use App\Models\ResellerRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResellerController extends Controller
{
    public function show()
    {
        return Inertia::render('Resellers');
    }

    public function request(Request $request)
    {
        $validated = $request->validate([
            'business_name' => 'required|string|max:255',
            'contact_name'  => 'required|string|max:255',
            'email'         => 'required|email|max:255',
            'phone'         => 'nullable|string|max:30',
            'city'          => 'nullable|string|max:100',
            'message'       => 'nullable|string|max:2000',
        ]);

        ResellerRequest::create(array_merge($validated, ['status' => 'pending']));

        return back()->with('success', 'Votre demande a été envoyée. Nous vous contacterons sous 48h.');
    }
}
