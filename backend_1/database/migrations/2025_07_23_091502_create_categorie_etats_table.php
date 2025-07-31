<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::create('categorie_etat', function (Blueprint $table) {
        $table->id('id_cat_etat');
        $table->string('nom_ar_etat');
        $table->string('nom_fr_etat');
        $table->unsignedBigInteger('id_sect');
        $table->foreign('id_sect')->references('id_sect')->on('secteur_travail')->onDelete('cascade');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categorie_etats');
    }
};
