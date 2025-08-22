<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('donator_periods', function (Blueprint $table) {
            $table->id();
            $table->foreignId('donator_id')->constrained('donators')->onDelete('cascade')->onUpdate('cascade');
            $table->unsignedInteger('month');
            $table->unsignedInteger('year');
            $table->timestamps();
            
            // Créer un index unique pour éviter les doublons
            $table->unique(['donator_id', 'month', 'year']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('donator_periods');
    }
};
