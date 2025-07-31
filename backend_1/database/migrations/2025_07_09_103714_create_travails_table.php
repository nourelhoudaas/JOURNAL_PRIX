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
        Schema::create('travails', function (Blueprint $table) {
                $table->engine = 'InnoDB';
            $table->integer('id_oeuvre')->primary()->autoIncrement();
            $table->string('titre_oeuvre_ar');
            $table->string('titre_oeuvre_fr');
            $table->time('Duree_nbr_signes'); //hh:mm:ss
            $table->date('date_publication');
            $table->text('description_oeuvre_ar');
            $table->text('description_oeuvre_fr');
            $table->string('statut_oeuvre_ar');
            $table->string('statut_oeuvre_fr');
            $table->string('valider_oeuvre');
            $table->dateTime('date_creation_oeuvre');
            $table->date('annee_gain')->nullable();
            $table->integer('classement')->nullable();

            $table->integer('id_fichier');
            $table->foreign('id_fichier')->references('id_fichier')->on('fichiers')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('travails');
    }
};
