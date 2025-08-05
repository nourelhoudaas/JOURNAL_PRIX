<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateParticipersTable  extends Migration // Changement de nom de classe
{
    public function up()
    {
        Schema::create('participer', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id('id_participer');
            // Ajoutez ici les colonnes nécessaires, par exemple :
            $table->foreignId('id_oeuvre')->constrained('travails', 'id_oeuvre')->onDelete('cascade');
            $table->foreignId('id_equipe')->constrained('equipes', 'id_equipe')->onDelete('cascade');
            $table->timestamps();
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
        });
    }

    public function down()
    {
        Schema::dropIfExists('participer');
    }
}