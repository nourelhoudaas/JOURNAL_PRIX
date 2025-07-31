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
    Schema::create('travaille', function (Blueprint $table) {
        $table->id();
        $table->date('date_recrut');
        $table->unsignedBigInteger('num_asset')->unique();
        $table->unsignedBigInteger('id_etab');
        $table->unsignedBigInteger('id_personne');
        $table->foreign('id_etab')->references('id_etab')->on('etablissement')->onDelete('cascade');
        $table->foreign('id_personne')->references('id_personne')->on('personne')->onDelete('cascade');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('travailles');
    }
};
