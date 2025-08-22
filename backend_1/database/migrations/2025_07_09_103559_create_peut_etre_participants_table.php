<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Étape 1 : Créer la table sans les foreign keys
        Schema::create('peut_etre_participants', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';

            $table->id('id_peut_etre_participant'); // Utilisation de id() pour la clé primaire
            $table->unsignedBigInteger('id_personne'); // Changé de integer() à unsignedBigInteger()
            $table->unsignedBigInteger('id_participant'); // Assurez-vous que id_participant est aussi compatible
            $table->decimal('id_nin_personne', 18, 0)->unique();
        });

        // Étape 2 : Ajouter les foreign keys dans une étape séparée
        Schema::table('peut_etre_participants', function (Blueprint $table) {
            $table->foreign('id_personne')->references('id_personne')->on('personnes')->onDelete('cascade');
            $table->foreign('id_participant')->references('id_participant')->on('participants')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peut_etre_participants');
    }
};