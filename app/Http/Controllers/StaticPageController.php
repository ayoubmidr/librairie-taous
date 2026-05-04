<?php

namespace App\Http\Controllers;

use App\Models\Faq;
use App\Models\Page;
use Inertia\Inertia;

class StaticPageController extends Controller
{
    public function about()
    {
        return Inertia::render('About');
    }

    public function faq()
    {
        $faqs = Faq::orderBy('sort_order')->get();
        return Inertia::render('FAQ', compact('faqs'));
    }

    public function show(string $slug)
    {
        $page = Page::where('slug', $slug)->where('is_active', true)->firstOrFail();
        return Inertia::render('Pages/Show', compact('page'));
    }

    public function trackOrder()
    {
        return Inertia::render('TrackOrder');
    }
}
