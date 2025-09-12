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
        Schema::create('categories', function (Blueprint $table) {
                $table->engine = 'InnoDB';
           $table->integer('id_categorie')->primary()->autoIncrement();
            $table->string('nom_categorie_ar');
            $table->string('nom_categorie_fr');
            $table->text('description_cat_ar');
            $table->text('description_cat_fr');
            $table->integer('nbr_max_oeuvre');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
