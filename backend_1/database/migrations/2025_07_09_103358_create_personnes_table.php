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
        Schema::create('personnes', function (Blueprint $table) {
                $table->engine = 'InnoDB';
            $table->integer('id_personne')->primary()->autoIncrement();
            $table->decimal('id_nin_personne', 18, 0)->unique();
            $table->string('nom_personne_ar');
            $table->string('nom_personne_fr');
            $table->string('prenom_personne_ar');
            $table->string('prenom_personne_fr');
            $table->Date('date_naissance');
            $table->string('lieu_naissance_ar');
            $table->string('lieu_naissance_fr');
            $table->string('nationalite_ar');
            $table->string('nationalite_fr');
            $table->decimal('id_professional_card', 18, 0)->nullable();
            $table->string('num_tlf_personne');
            $table->string('adresse_ar');
            $table->string('adresse_fr');
            $table->string('fonction_ar', 191)->nullable();
            $table->string('fonction_fr', 191)->nullable();
            //$table->string('organisme_ar');
           // $table->string('organisme_fr');
            $table->string('sexe_personne_ar');
            $table->string('sexe_personne_fr');
            $table->string('groupage');
            //$table->string('photo_path');

            $table->integer('id_compte');
            $table->foreign('id_compte')->references('id_compte')->on('comptes')->onDelete('cascade');

            $table->integer('id_dossier');
            $table->foreign('id_dossier')->references('id_dossier')->on('dossiers')->onDelete('cascade');
            
            $table->timestamps();
     
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('personnes');
    }
};
