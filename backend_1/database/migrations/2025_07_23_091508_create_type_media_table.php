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
    Schema::create('type_media', function (Blueprint $table) {
        $table->integer('id_type_media')->primary()->autoIncrement();
        $table->string('nom_ar_type_media');
        $table->string('nom_fr_type_media');
        $table->Integer('id_cat_etat');
        $table->foreign('id_cat_etat')->references('id_cat_etat')->on('categorie_etat')->onDelete('cascade');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('type_media');
    }
};
