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
        Schema::create('editions', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->integer('id_edition')->primary()->autoIncrement();
            $table->integer('annee_edition');
            $table->string('num_edition');
            $table->text('description_edition_fr');
            $table->text('description_edition_ar');
            $table->date('date_lancement_edition');
            $table->date('date_limite_depotDossier');
            $table->string('statut_edition');
            $table->string('path_image_edition');

            $table->integer('id_fichier');
            $table->foreign('id_fichier')->references('id_fichier')->on('fichiers')->onDelete('cascade');
           
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('editions');
    }
};
