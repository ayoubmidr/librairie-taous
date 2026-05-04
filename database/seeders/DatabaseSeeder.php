<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Banner;
use App\Models\BulkDiscount;
use App\Models\Category;
use App\Models\Faq;
use App\Models\Page;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Publisher;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $this->seedUsers();

        $categories = $this->seedCategories();
        $publishers = $this->seedPublishers();
        $authors = $this->seedAuthors();
        $products = $this->seedProducts($categories, $publishers, $authors);

        $this->seedBanners();
        $this->seedReviews($products);
        $this->seedFaqs();
        $this->seedPages();
    }

    private function seedUsers(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@librairietaous.test'],
            [
                'name' => 'Admin Taous',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'country' => 'FR',
                'is_active' => true,
            ],
        );

        User::updateOrCreate(
            ['email' => 'client@librairietaous.test'],
            [
                'name' => 'Client Demo',
                'password' => Hash::make('password'),
                'role' => 'customer',
                'country' => 'FR',
                'is_active' => true,
            ],
        );
    }

    private function seedCategories(): array
    {
        $items = [
            ['Croyance', 'Livres autour de la foi, des fondements et de la spiritualite.', 1],
            ['Coran et Tafsir', 'Corans, traductions, commentaires et sciences coraniques.', 2],
            ['Hadith', 'Collections de hadiths, commentaires et sciences du hadith.', 3],
            ['Education', 'Supports pour apprendre et transmettre aux enfants.', 4],
            ['Famille', 'Vie familiale, couple, parentalite et education.', 5],
            ['Langue arabe', 'Methodes, grammaire et vocabulaire arabe.', 6],
        ];

        $categories = [];

        foreach ($items as [$name, $description, $sortOrder]) {
            $slug = Str::slug($name);

            $categories[$slug] = Category::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'description' => $description,
                    'sort_order' => $sortOrder,
                    'is_active' => true,
                    'show_in_menu' => true,
                ],
            );
        }

        return $categories;
    }

    private function seedPublishers(): array
    {
        $items = [
            ['Editions Taous', true],
            ['Maison Ennour', false],
            ['Dar Al Muslim', false],
            ['Tawhid Editions', false],
        ];

        $publishers = [];

        foreach ($items as [$name, $isOurEditions]) {
            $slug = Str::slug($name);

            $publishers[$slug] = Publisher::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'description' => "Catalogue de {$name}.",
                    'country' => 'FR',
                    'is_our_editions' => $isOurEditions,
                    'is_active' => true,
                ],
            );
        }

        return $publishers;
    }

    private function seedAuthors(): array
    {
        $items = [
            'Imam An-Nawawi',
            'Ibn Al-Qayyim',
            'Ibn Kathir',
            'Abd Ar-Rahman As-Saadi',
            'Equipe pedagogique Taous',
        ];

        $authors = [];

        foreach ($items as $name) {
            $slug = Str::slug($name);

            $authors[$slug] = Author::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'bio' => "Auteur disponible dans le catalogue Librairie Taous.",
                    'is_active' => true,
                ],
            );
        }

        return $authors;
    }

    private function seedProducts(array $categories, array $publishers, array $authors): array
    {
        $items = [
            [
                'name' => 'Les fondements de la foi',
                'category' => 'croyance',
                'publisher' => 'editions-taous',
                'authors' => ['abd-ar-rahman-as-saadi'],
                'price' => 14.90,
                'compare_price' => null,
                'flags' => ['is_new' => true, 'is_featured' => true],
                'stock' => 40,
                'sales_count' => 18,
            ],
            [
                'name' => 'Le Noble Coran - traduction francaise',
                'category' => 'coran-et-tafsir',
                'publisher' => 'maison-ennour',
                'authors' => ['ibn-kathir'],
                'price' => 29.90,
                'compare_price' => 34.90,
                'flags' => ['is_bestseller' => true, 'is_on_sale' => true, 'is_featured' => true],
                'stock' => 25,
                'sales_count' => 72,
            ],
            [
                'name' => 'Les 40 hadiths de An-Nawawi',
                'category' => 'hadith',
                'publisher' => 'dar-al-muslim',
                'authors' => ['imam-an-nawawi'],
                'price' => 9.90,
                'compare_price' => null,
                'flags' => ['is_bestseller' => true],
                'stock' => 80,
                'sales_count' => 130,
            ],
            [
                'name' => 'Histoires prophetiques pour enfants',
                'category' => 'education',
                'publisher' => 'editions-taous',
                'authors' => ['equipe-pedagogique-taous'],
                'price' => 12.50,
                'compare_price' => null,
                'flags' => ['is_new' => true, 'is_featured' => true],
                'stock' => 55,
                'sales_count' => 24,
            ],
            [
                'name' => 'Guide pratique de la famille musulmane',
                'category' => 'famille',
                'publisher' => 'tawhid-editions',
                'authors' => ['ibn-al-qayyim'],
                'price' => 18.90,
                'compare_price' => 22.00,
                'flags' => ['is_on_sale' => true],
                'stock' => 31,
                'sales_count' => 42,
            ],
            [
                'name' => 'Methode arabe debutant - Tome 1',
                'category' => 'langue-arabe',
                'publisher' => 'editions-taous',
                'authors' => ['equipe-pedagogique-taous'],
                'price' => 16.90,
                'compare_price' => null,
                'flags' => ['is_new' => true],
                'stock' => 60,
                'sales_count' => 9,
            ],
            [
                'name' => 'Tafsir simplifie - precommande',
                'category' => 'coran-et-tafsir',
                'publisher' => 'editions-taous',
                'authors' => ['ibn-kathir'],
                'price' => 39.90,
                'compare_price' => null,
                'flags' => ['is_featured' => true],
                'stock' => 0,
                'sales_count' => 0,
                'type' => 'preorder',
            ],
        ];

        $products = [];

        foreach ($items as $index => $item) {
            $slug = Str::slug($item['name']);
            $flags = $item['flags'];
            $type = $item['type'] ?? 'simple';

            $product = Product::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $item['name'],
                    'sku' => 'TAOUS-' . str_pad((string) ($index + 1), 4, '0', STR_PAD_LEFT),
                    'short_description' => "Une selection Librairie Taous pour decouvrir {$item['name']}.",
                    'description' => "Ce livre de demonstration permet de remplir la boutique locale avec un catalogue realiste. Il sert aux tests de navigation, filtres, fiches produit et pages d'accueil.",
                    'publisher_id' => $publishers[$item['publisher']]->id,
                    'category_id' => $categories[$item['category']]->id,
                    'price' => $item['price'],
                    'compare_price' => $item['compare_price'],
                    'stock' => $item['stock'],
                    'status' => 'active',
                    'type' => $type,
                    'preorder_date' => $type === 'preorder' ? now()->addMonth()->toDateString() : null,
                    'preorder_message' => $type === 'preorder' ? 'Expedition prevue le mois prochain.' : null,
                    'language' => 'fr',
                    'format' => 'Broche',
                    'pages' => 220 + ($index * 35),
                    'is_featured' => $flags['is_featured'] ?? false,
                    'is_new' => $flags['is_new'] ?? false,
                    'is_bestseller' => $flags['is_bestseller'] ?? false,
                    'is_on_sale' => $flags['is_on_sale'] ?? false,
                    'bulk_discount_enabled' => $item['publisher'] === 'editions-taous',
                    'sales_count' => $item['sales_count'],
                ],
            );

            ProductImage::updateOrCreate(
                ['product_id' => $product->id, 'sort_order' => 1],
                [
                    'path' => 'products/' . $slug . '.jpg',
                    'alt' => $item['name'],
                    'is_primary' => true,
                ],
            );

            $authorIds = collect($item['authors'])
                ->map(fn (string $authorSlug) => $authors[$authorSlug]->id)
                ->all();

            $product->authors()->sync($authorIds);

            if ($product->bulk_discount_enabled) {
                foreach ([[5, 10], [10, 15], [20, 20]] as [$minimum, $discount]) {
                    BulkDiscount::updateOrCreate(
                        ['product_id' => $product->id, 'min_quantity' => $minimum],
                        ['discount_percent' => $discount, 'is_active' => true],
                    );
                }
            }

            $products[$slug] = $product;
        }

        return $products;
    }

    private function seedBanners(): void
    {
        Banner::updateOrCreate(
            ['position' => 'home_hero', 'sort_order' => 1],
            [
                'title' => 'Librairie Taous',
                'subtitle' => 'Livres islamiques, editions et supports pedagogiques.',
                'image' => 'banners/home-hero.jpg',
                'button_text' => 'Voir la boutique',
                'button_link' => '/boutique',
                'is_active' => true,
            ],
        );
    }

    private function seedReviews(array $products): void
    {
        $reviews = [
            ['les-fondements-de-la-foi', 'Amina B.', 5, 'Clair et utile', 'Un livre accessible et bien structure.'],
            ['le-noble-coran-traduction-francaise', 'Youssef M.', 5, 'Tres belle edition', 'La lecture est confortable et la livraison etait soignee.'],
            ['les-40-hadiths-de-an-nawawi', 'Sarah L.', 4, 'Bon format', 'Parfait pour une premiere lecture accompagnee.'],
        ];

        foreach ($reviews as [$productSlug, $authorName, $rating, $title, $content]) {
            Review::updateOrCreate(
                ['product_id' => $products[$productSlug]->id, 'author_name' => $authorName],
                [
                    'rating' => $rating,
                    'title' => $title,
                    'content' => $content,
                    'is_approved' => true,
                    'is_verified_purchase' => true,
                ],
            );
        }
    }

    private function seedFaqs(): void
    {
        $items = [
            ['Quels sont les delais de livraison ?', 'La livraison standard prend generalement 3 a 5 jours ouvres.', 'livraison', 1],
            ['Puis-je retourner un article ?', 'Oui, les retours sont possibles sous 14 jours si le produit est intact.', 'retours', 2],
            ['Proposez-vous des tarifs revendeurs ?', 'Oui, les editions Taous peuvent avoir des remises par quantite.', 'revendeurs', 3],
        ];

        foreach ($items as [$question, $answer, $category, $sortOrder]) {
            Faq::updateOrCreate(
                ['question' => $question],
                [
                    'answer' => $answer,
                    'category' => $category,
                    'sort_order' => $sortOrder,
                    'is_active' => true,
                ],
            );
        }
    }

    private function seedPages(): void
    {
        $items = [
            ['Mentions legales', 'mentions-legales', '<h2>Mentions legales</h2><p>Page de demonstration pour le site local.</p>', 1],
            ['Conditions generales de vente', 'cgv', '<h2>CGV</h2><p>Conditions de vente de demonstration.</p>', 2],
            ['Livraison et retours', 'livraison-retours', '<h2>Livraison</h2><p>Informations de livraison et de retours.</p>', 3],
        ];

        foreach ($items as [$title, $slug, $content, $sortOrder]) {
            Page::updateOrCreate(
                ['slug' => $slug],
                [
                    'title' => $title,
                    'content' => $content,
                    'sort_order' => $sortOrder,
                    'is_active' => true,
                ],
            );
        }
    }
}
