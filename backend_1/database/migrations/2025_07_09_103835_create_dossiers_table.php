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
        Schema::create('dossiers', function (Blueprint $table) {
                $table->engine = 'InnoDB';

            $table->integer('id_dossier')->primary()->autoIncrement();
            $table->dateTime('date_create_dossier');
            $table->string('statut_dossier');

            $table->integer('id_fichier');
            $table->foreign('id_fichier')->references('id_fichier')->on('fichiers')->onDelete('cascade');

        

            $table->integer('id_personne');
            $table->foreign('id_personne')->references('id_personne')->on('personnes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dossiers');
    }
};
