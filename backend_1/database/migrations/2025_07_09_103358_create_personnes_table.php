<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePersonnesTable extends Migration
{
    public function up()
    {
        Schema::create('personnes', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id('id_personne'); // Changed to id() for bigint unsigned
            $table->decimal('id_nin_personne', 18, 0)->unique();
            $table->string('nom_personne_ar', 191);
            $table->string('nom_personne_fr', 191);
            $table->string('prenom_personne_ar', 191);
            $table->string('prenom_personne_fr', 191);
            $table->date('date_naissance');
            $table->string('lieu_naissance_ar', 191);
            $table->string('lieu_naissance_fr', 191);
            $table->string('nationalite_ar', 191);
            $table->string('nationalite_fr', 191);
            $table->integer('id_professional_card')->nullable();
            $table->unsignedBigInteger('id_dossier');
            $table->string('num_tlf_personne', 191);
            $table->string('adresse_ar', 191);
            $table->string('adresse_fr', 191);
            $table->string('fonction_ar', 191)->nullable();
            $table->string('fonction_fr', 191)->nullable();
            $table->string('sexe_personne_ar', 191);
            $table->string('sexe_personne_fr', 191);
            $table->string('groupage', 191);
            $table->timestamps();
            $table->foreignId('id_compte')->constrained('comptes', 'id_compte')->onDelete('cascade');
            $table->foreign('id_dossier')->references('id_dossier')->on('dossiers')->onDelete('cascade');
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
        });
    }

    public function down()
    {
        Schema::dropIfExists('personnes');
    }
}