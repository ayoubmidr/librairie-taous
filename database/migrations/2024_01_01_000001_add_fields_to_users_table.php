<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->enum('role', ['customer', 'reseller', 'wholesaler', 'admin'])->default('customer')->after('phone');
            $table->enum('reseller_status', ['pending', 'approved', 'rejected'])->nullable()->after('role');
            $table->string('company_name')->nullable()->after('reseller_status');
            $table->string('vat_number')->nullable()->after('company_name');
            $table->string('country', 2)->default('FR')->after('vat_number');
            $table->boolean('is_active')->default(true)->after('country');
            $table->timestamp('last_login_at')->nullable()->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['phone', 'role', 'reseller_status', 'company_name', 'vat_number', 'country', 'is_active', 'last_login_at']);
        });
    }
};
