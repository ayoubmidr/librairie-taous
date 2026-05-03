<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Illuminate\Http\Request;

class NewsletterController extends Controller
{
    public function subscribe(Request $request)
    {
        $validated = $request->validate(['email' => 'required|email|max:255']);

        NewsletterSubscriber::firstOrCreate(['email' => $validated['email']], ['is_active' => true]);

        return response()->json(['message' => 'Inscription réussie !']);
    }
}
