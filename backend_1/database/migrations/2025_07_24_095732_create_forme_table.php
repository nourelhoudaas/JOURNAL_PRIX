<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFormeTable extends Migration
{
    public function up()
    {
        Schema::create('forme', function (Blueprint $table) {
            $table->unsignedBigInteger('id_equipe');
            $table->unsignedBigInteger('id_personne');
            $table->enum('role', ['principal', 'membre'])->default('membre');
            $table->date('date_integration')->nullable();
            $table->primary(['id_equipe', 'id_personne']);
            $table->foreign('id_equipe')->references('id_equipe')->on('equipes')->onDelete('cascade');
            $table->foreign('id_personne')->references('id_personne')->on('personnes')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('forme');
    }
}