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
        Schema::create('equipes', function (Blueprint $table) {
                $table->engine = 'InnoDB';
            $table->integer('id_equipe')->primary()->autoIncrement();
            $table->string('nom_equipe_ar');
            $table->string('nom_equipe_fr');
            

            $table->integer('id_personne');
            $table->foreign('id_personne')->references('id_personne')->on('personnes')->onDelete('cascade');

            $table->integer('id_oeuvre');
            $table->foreign('id_oeuvre')->references('id_oeuvre')->on('travails')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('equipes');
    }
};
