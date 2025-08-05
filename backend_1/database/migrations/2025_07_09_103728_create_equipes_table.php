<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('equipes', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id('id_equipe'); // bigint unsigned for primary key
            $table->string('nom_equipe_ar', 191);
            $table->string('nom_equipe_fr', 191);
            $table->unsignedBigInteger('id_personne'); // Changed to integer to match personnes table
            $table->foreign('id_personne')->references('id_personne')->on('personnes')->onDelete('cascade');
            $table->unsignedBigInteger('id_oeuvre'); // Matches travails table
            $table->foreign('id_oeuvre')->references('id_oeuvre')->on('travails')->onDelete('cascade');
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('equipes');
    }
};