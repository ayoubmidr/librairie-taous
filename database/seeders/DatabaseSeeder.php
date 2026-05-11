<?php

namespace Database\Seeders;

use App\Models\Author;
use App\Models\Banner;
use App\Models\BulkDiscount;
use App\Models\Category;
use App\Models\Faq;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\OrderItem;
use App\Models\Page;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Publisher;
use App\Models\Review;
use App\Models\ShippingRate;
use App\Models\ShippingZone;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // ── Truncate all tables (idempotent re-seed) ───────────────────────
        Schema::disableForeignKeyConstraints();
        DB::table('product_author')->truncate();
        DB::table('product_tag')->truncate();
        DB::table('bulk_discounts')->truncate();
        DB::table('product_images')->truncate();
        DB::table('wishlists')->truncate();
        DB::table('reviews')->truncate();
        DB::table('order_items')->truncate();
        DB::table('orders')->truncate();
        DB::table('coupons')->truncate();
        DB::table('products')->truncate();
        DB::table('tags')->truncate();
        DB::table('authors')->truncate();
        DB::table('publishers')->truncate();
        DB::table('categories')->truncate();
        DB::table('shipping_rates')->truncate();
        DB::table('shipping_zones')->truncate();
        DB::table('banners')->truncate();
        DB::table('faqs')->truncate();
        DB::table('pages')->truncate();
        DB::table('addresses')->truncate();
        DB::table('users')->truncate();
        Schema::enableForeignKeyConstraints();

        // ── Users ──────────────────────────────────────────────────────────
        User::create([
            'name'     => 'Admin Taous',
            'email'    => 'admin@librairietaous.com',
            'password' => Hash::make('password'),
            'role'     => 'admin',
        ]);

        $customer = User::create([
            'name'     => 'Aicha Benali',
            'email'    => 'aicha@example.com',
            'password' => Hash::make('password'),
            'role'     => 'customer',
        ]);

        User::create([
            'name'            => 'Ibrahim Librairie',
            'email'           => 'reseller@example.com',
            'password'        => Hash::make('password'),
            'role'            => 'reseller',
            'reseller_status' => 'approved',
            'company_name'    => 'Librairie Al-Furqan',
        ]);

        // ── Categories ─────────────────────────────────────────────────────
        $categories = [
            'Croyance'       => "Ouvrages sur l'aqida et la foi islamique",
            'Fiqh'           => 'Jurisprudence islamique et règles pratiques',
            'Hadith'         => 'Sciences des hadiths et collections prophétiques',
            'Coran & Tafsir' => 'Corans, traductions et commentaires',
            'Éducation'      => "Pédagogie islamique et livres d'apprentissage",
            'Femme & Famille'=> "Ouvrages dédiés à la femme et à la vie familiale",
            'Enfants'        => 'Livres islamiques pour les jeunes',
            'Biographies'    => 'Vie du Prophète ﷺ et des grands savants',
            'Langue arabe'   => "Méthodes et grammaires pour l'apprentissage de l'arabe",
            'Comportement'   => "Éthique islamique, adab et amélioration de soi",
        ];

        $catModels = [];
        foreach ($categories as $name => $desc) {
            $catModels[$name] = Category::create([
                'name'        => $name,
                'slug'        => Str::slug($name),
                'description' => $desc,
            ]);
        }

        // ── Publishers ─────────────────────────────────────────────────────
        $taous = Publisher::create([
            'name'            => 'Éditions Taous',
            'slug'            => 'editions-taous',
            'is_our_editions' => true,
        ]);

        $publishers = [$taous];
        foreach ([
            ['Dar Al-Muslim', 'dar-al-muslim'],
            ['Al-Hadith Éditions', 'al-hadith-editions'],
            ['Tawhid Éditions', 'tawhid-editions'],
            ["Maison d'Ennour", 'maison-d-ennour'],
        ] as [$name, $slug]) {
            $publishers[] = Publisher::create(['name' => $name, 'slug' => $slug, 'is_our_editions' => false]);
        }

        // ── Authors ────────────────────────────────────────────────────────
        $authorNames = [
            'Sheikh Saleh Al-Fawzan', 'Ibn Taymiyya', 'Ibn Al-Qayyim',
            'Imam An-Nawawi', 'Cheikh Abdel Razzak Al-Badr', 'Dr. Bilal Philips',
            'Tariq Ramadan', 'Hani Ramadan', 'Yusuf Al-Qaradawi', 'Muhammad Ibn Ibrahim',
        ];
        $authors = [];
        foreach ($authorNames as $name) {
            $authors[] = Author::create(['name' => $name, 'slug' => Str::slug($name)]);
        }

        // ── Products ───────────────────────────────────────────────────────
        $productsData = [
            ['Les Fondements de la Foi Islamique', $taous, $catModels['Croyance'], [$authors[0]], 14.90, null, 'fr', true, true, true, 120, 256, 'Broché', true, 'simple', null,
                "Un ouvrage de référence sur les fondements de la croyance islamique selon le Coran et la Sunna. Accessible et rigoureux, il guide le lecteur dans les piliers de l'aqida sunnite."],
            ['La Femme Musulmane — Guide Pratique', $taous, $catModels['Femme & Famille'], [$authors[0]], 12.90, null, 'fr', false, true, true, 80, 192, 'Broché', true, 'simple', null,
                "Un guide complet et pratique pour la femme musulmane, couvrant les domaines de la prière, du jeûne, de la famille et des droits en islam."],
            ['Éducation Islamique — Méthode Complète', $taous, $catModels['Éducation'], [$authors[4]], 18.90, null, 'fr', true, false, true, 60, 320, 'Relié', true, 'simple', null,
                "Une méthode pédagogique complète pour enseigner l'islam aux enfants et aux adolescents. Programmes structurés par niveau, exercices pratiques inclus."],
            ["L'Arbre Béni — Histoires pour Enfants", $taous, $catModels['Enfants'], [$authors[0]], 9.90, null, 'fr', true, false, false, 200, 96, 'Cartonné', true, 'simple', null,
                "Un recueil de belles histoires islamiques pour les enfants de 4 à 10 ans, illustrées et adaptées à leur âge pour transmettre les valeurs de l'islam avec douceur."],
            ['Sahih Al-Bukhari — Traduction Française Intégrale', $publishers[1], $catModels['Hadith'], [$authors[3]], 45.00, 55.00, 'fr', false, true, true, 30, 1248, 'Relié', false, 'simple', null,
                "La traduction française complète et annotée du Sahih d'Al-Bukhari, la collection la plus authentique des hadiths du Prophète Muhammad ﷺ."],
            ['Le Noble Coran — Traduction et Commentaires', $publishers[4], $catModels['Coran & Tafsir'], [], 29.90, null, 'bilingual', false, true, true, 100, 768, 'Relié', false, 'simple', null,
                "Une traduction soignée du Coran en français avec les commentaires essentiels, texte arabe en regard. Format luxueux avec couverture rigide."],
            ["Zad Al-Maad — Provisions pour le Voyage", $publishers[2], $catModels['Comportement'], [$authors[2]], 35.00, 42.00, 'fr', false, false, false, 25, 890, 'Relié', false, 'simple', null,
                "Chef-d'œuvre d'Ibn Al-Qayyim, couvrant la biographie prophétique et la jurisprudence pratique. Traduit intégralement en français."],
            ["La Méthode de l'Islam dans l'Éducation des Enfants", $publishers[4], $catModels['Enfants'], [$authors[7]], 16.90, null, 'fr', false, false, false, 45, 264, 'Broché', false, 'simple', null,
                "Un guide pratique pour les parents musulmans sur l'éducation islamique de leurs enfants, de la naissance jusqu'à l'adolescence."],
            ['Introduction au Fiqh Malékite', $publishers[1], $catModels['Fiqh'], [$authors[3]], 22.90, null, 'fr', false, false, false, 38, 384, 'Broché', false, 'simple', null,
                "Une introduction accessible au fiqh selon l'école malékite, avec comparaisons aux autres madhhabs. Idéal pour les étudiants en sciences islamiques."],
            ['La Biographie du Prophète Muhammad ﷺ', $publishers[4], $catModels['Biographies'], [], 26.90, null, 'fr', false, true, true, 55, 512, 'Relié', false, 'simple', null,
                "La biographie complète du Prophète Muhammad ﷺ, de sa naissance à sa mort bénie. Basée sur les sources authentiques, richement documentée."],
            ['Méthode Madinah — Tome 1 (Arabe)', $publishers[2], $catModels['Langue arabe'], [], 15.90, null, 'ar', false, true, false, 80, 200, 'Broché', false, 'simple', null,
                "Le célèbre manuel d'arabe de l'Université Islamique de Médine, tome 1. La référence pour apprendre la langue arabe classique."],
            ["Les 40 Hadiths d'An-Nawawi — Commentaires", $publishers[3], $catModels['Hadith'], [$authors[3]], 13.90, 17.00, 'fr', false, true, false, 70, 320, 'Broché', false, 'simple', null,
                "La collection des 40 hadiths fondamentaux d'An-Nawawi avec commentaires détaillés. Un livre essentiel pour tout musulman."],
            ['Tafsir Ibn Kathir — Édition Abrégée', $taous, $catModels['Coran & Tafsir'], [$authors[0]], 34.90, null, 'fr', true, false, true, 0, 640, 'Relié', true, 'preorder', now()->addMonths(2)->format('Y-m-d'),
                "La première traduction française de l'édition abrégée du Tafsir Ibn Kathir. Un commentaire clair et accessible du Coran."],
        ];

        $productModels = [];
        foreach ($productsData as [$name, $publisher, $category, $productAuthors, $price, $compare, $lang, $isNew, $isBest, $isFeatured, $stock, $pages, $format, $bulkDiscount, $type, $preorderDate, $desc]) {
            $product = Product::create([
                'name'                  => $name,
                'slug'                  => Str::slug($name),
                'publisher_id'          => $publisher->id,
                'category_id'           => $category->id,
                'price'                 => $price,
                'compare_price'         => $compare,
                'language'              => $lang,
                'type'                  => $type,
                'preorder_date'         => $preorderDate,
                'stock'                 => $stock,
                'is_new'                => $isNew,
                'is_bestseller'         => $isBest,
                'is_featured'           => $isFeatured,
                'is_on_sale'            => $compare && $compare > $price,
                'is_digital'            => false,
                'bulk_discount_enabled' => $bulkDiscount,
                'description'           => $desc,
                'short_description'     => mb_substr($desc, 0, 180) . '…',
                'pages'                 => $pages,
                'format'                => $format,
                'status'                => 'active',
            ]);

            // Placeholder image
            ProductImage::create([
                'product_id' => $product->id,
                'path'       => 'placeholder/' . $product->slug . '.jpg',
                'alt'        => $name,
                'sort_order' => 1,
                'is_primary' => true,
            ]);

            if (! empty($productAuthors)) {
                $product->authors()->attach(collect($productAuthors)->pluck('id'));
            }

            if ($bulkDiscount) {
                BulkDiscount::create(['product_id' => $product->id, 'min_quantity' => 5,  'discount_percent' => 40, 'is_active' => true]);
                BulkDiscount::create(['product_id' => $product->id, 'min_quantity' => 15, 'discount_percent' => 50, 'is_active' => true]);
            }

            $productModels[] = $product;
        }

        // ── Reviews ────────────────────────────────────────────────────────
        $reviewData = [
            ['Aicha B.', 5, 'Excellent ouvrage, très bien écrit et facile à comprendre. Je recommande vivement !'],
            ['Ibrahim M.', 5, 'La meilleure librairie islamique en ligne. Service rapide et livres de qualité.'],
            ['Khadija R.', 4, 'Très bon livre, conforme à la description. Livraison un peu lente mais sinon parfait.'],
            ['Youssef A.', 5, "J'ai commandé 10 exemplaires pour ma médersa. Prix professionnels et livraison soignée."],
            ['Fatima L.', 5, 'Ouvrage de référence indispensable. Je le conseille à tous mes proches.'],
        ];

        foreach ($reviewData as $i => [$authorName, $rating, $content]) {
            Review::create([
                'product_id'           => $productModels[$i % count($productModels)]->id,
                'author_name'          => $authorName,
                'rating'               => $rating,
                'content'              => $content,
                'is_verified_purchase' => true,
                'is_approved'          => true,
            ]);
        }

        // ── Demo Order ─────────────────────────────────────────────────────
        $order = Order::create([
            'user_id'         => $customer->id,
            'order_number'    => 'TAO-' . date('Y') . '-001',
            'first_name'      => 'Aicha',
            'last_name'       => 'Benali',
            'email'           => 'aicha@example.com',
            'status'          => 'delivered',
            'payment_status'  => 'paid',
            'shipping_address'=> ['first_name' => 'Aicha', 'last_name' => 'Benali', 'address_line1' => '12 rue des Oliviers', 'city' => 'Lyon', 'postal_code' => '69001', 'country' => 'FR'],
            'subtotal'        => 27.80,
            'shipping_cost'   => 5.90,
            'discount_amount' => 0,
            'tax_amount'      => 0,
            'total'           => 33.70,
            'has_preorder'    => false,
            'currency'        => 'EUR',
        ]);

        OrderItem::create(['order_id' => $order->id, 'product_id' => $productModels[0]->id, 'product_name' => $productModels[0]->name, 'price' => 14.90, 'quantity' => 1, 'total' => 14.90, 'is_preorder' => false]);
        OrderItem::create(['order_id' => $order->id, 'product_id' => $productModels[1]->id, 'product_name' => $productModels[1]->name, 'price' => 12.90, 'quantity' => 1, 'total' => 12.90, 'is_preorder' => false]);

        // ── Shipping ───────────────────────────────────────────────────────
        $zoneFR = ShippingZone::create(['name' => 'France', 'countries' => json_encode(['FR']), 'is_active' => true]);
        $zoneEU = ShippingZone::create(['name' => 'Europe', 'countries' => json_encode(['BE', 'CH', 'LU', 'DE', 'ES', 'IT', 'NL']), 'is_active' => true]);

        ShippingRate::create(['shipping_zone_id' => $zoneFR->id, 'name' => 'Colissimo Standard', 'rate' => 5.90, 'free_shipping_threshold' => 50, 'is_active' => true, 'estimated_days_min' => 3, 'estimated_days_max' => 5]);
        ShippingRate::create(['shipping_zone_id' => $zoneFR->id, 'name' => 'Chronopost Express', 'rate' => 9.90, 'is_active' => true, 'estimated_days_min' => 1, 'estimated_days_max' => 2]);
        ShippingRate::create(['shipping_zone_id' => $zoneEU->id, 'name' => 'Colissimo International', 'rate' => 12.90, 'is_active' => true, 'estimated_days_min' => 5, 'estimated_days_max' => 10]);

        // ── Banners ────────────────────────────────────────────────────────
        Banner::create([
            'title'       => 'Bienvenue chez Librairie Taous',
            'subtitle'    => 'Votre référence islamique en ligne',
            'image'       => 'banners/hero-1.jpg',
            'button_text' => 'Découvrir',
            'button_link' => '/boutique',
            'is_active'   => true,
            'sort_order'  => 1,
        ]);

        // ── FAQs ───────────────────────────────────────────────────────────
        foreach ([
            [1, 'Quels sont les délais de livraison ?', "Pour la France, comptez 3-5 jours ouvrés avec Colissimo, ou 1-2 jours avec Chronopost.", 'livraison'],
            [2, 'Puis-je retourner un article ?', "Vous disposez de 14 jours après réception pour retourner tout article non ouvert.", 'retours'],
            [3, 'Comment bénéficier des prix revendeurs ?', "Créez un compte et soumettez une demande de compte revendeur. Nous la traiterons sous 48h.", 'revendeurs'],
            [4, 'Les paiements sont-ils sécurisés ?', "Oui, tous les paiements sont traités par Stripe, certifié PCI DSS.", 'paiement'],
            [5, "Livrez-vous à l'étranger ?", "Nous livrons dans toute l'Europe, en Afrique du Nord et dans certains pays du Moyen-Orient.", 'livraison'],
        ] as [$sort, $q, $a, $cat]) {
            Faq::create(['question' => $q, 'answer' => $a, 'category' => $cat, 'sort_order' => $sort, 'is_active' => true]);
        }

        // ── Static Pages ───────────────────────────────────────────────────
        foreach ([
            ['Mentions légales', 'mentions-legales', "<h2>Éditeur</h2><p>Librairie Taous SAS, immatriculée au RCS de Paris sous le numéro 123 456 789.</p><h2>Hébergement</h2><p>OVH, 2 rue Kellermann, 59100 Roubaix.</p>"],
            ['CGV', 'cgv', "<h2>Conditions Générales de Vente</h2><p>Les présentes CGV régissent les relations contractuelles entre Librairie Taous et ses clients.</p>"],
            ['Politique de confidentialité', 'politique-confidentialite', "<h2>Protection de vos données</h2><p>Librairie Taous s'engage à protéger vos données personnelles conformément au RGPD.</p>"],
            ['Livraison & Retours', 'livraison-retours', "<h2>Livraison</h2><p>Nous expédions sous 24-48h ouvrés. Livraison gratuite dès 50€ en France.</p><h2>Retours</h2><p>14 jours pour retourner un article non ouvert.</p>"],
            ['Paiements sécurisés', 'paiements-securises', "<h2>Sécurité</h2><p>Tous vos paiements sont traités de façon sécurisée par Stripe, certifié PCI DSS.</p>"],
            ['Politique de retour', 'politique-retours', "<h2>Politique de retour</h2><p>Vous disposez de 14 jours après réception pour nous retourner un article.</p>"],
            ['Nos engagements', 'nos-engagements', "<h2>Nos engagements envers vous</h2><p>Authenticité, qualité et service client irréprochable.</p>"],
        ] as [$title, $slug, $content]) {
            Page::create(['title' => $title, 'slug' => $slug, 'content' => $content, 'is_active' => true]);
        }
    }
}
