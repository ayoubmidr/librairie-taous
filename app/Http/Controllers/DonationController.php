<?php

namespace App\Http\Controllers;

use App\Models\Donation;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DonationController extends Controller
{
    public function show()
    {
        return Inertia::render('Donation');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'donor_name'  => 'nullable|string|max:255',
            'donor_email' => 'required|email|max:255',
            'amount'      => 'required|numeric|min:1',
            'message'     => 'nullable|string|max:1000',
        ]);

        Donation::create(array_merge($validated, ['status' => 'pending']));

        return back()->with('success', 'Merci pour votre générosité ! Votre don Sadaqa a été enregistré.');
    }
}
