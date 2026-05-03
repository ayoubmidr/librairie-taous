<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('sku')->unique()->nullable();
            $table->string('isbn')->nullable();
            $table->text('short_description')->nullable();
            $table->longText('description')->nullable();

            $table->foreignId('publisher_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();

            $table->decimal('price', 10, 2);
            $table->decimal('compare_price', 10, 2)->nullable();
            $table->decimal('cost_price', 10, 2)->nullable();

            $table->decimal('reseller_price', 10, 2)->nullable();
            $table->decimal('wholesaler_price', 10, 2)->nullable();

            $table->integer('stock')->default(0);
            $table->integer('low_stock_threshold')->default(5);
            $table->boolean('track_stock')->default(true);

            $table->enum('status', ['active', 'inactive', 'draft'])->default('active');
            $table->enum('type', ['simple', 'preorder', 'pack'])->default('simple');

            $table->date('preorder_date')->nullable();
            $table->text('preorder_message')->nullable();

            $table->string('language')->default('fr');
            $table->string('format')->nullable();
            $table->integer('pages')->nullable();
            $table->decimal('weight', 8, 3)->nullable();
            $table->string('dimensions')->nullable();

            $table->boolean('is_featured')->default(false);
            $table->boolean('is_new')->default(false);
            $table->boolean('is_bestseller')->default(false);
            $table->boolean('is_on_sale')->default(false);
            $table->boolean('is_digital')->default(false);

            $table->boolean('bulk_discount_enabled')->default(false);

            $table->integer('views_count')->default(0);
            $table->integer('sales_count')->default(0);

            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
