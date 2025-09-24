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
        Schema::create('formes', function (Blueprint $table) {
          $table->engine = 'InnoDB';
            $table->integer('id_forme')->primary()->autoIncrement();
            $table->DateTime('date_forme_equipe');
            //$table->string('role_personne');
            //$table->string('situation');

            $table->string('situation', 191);
            $table->enum('role_personne', ['principal', 'collaborateur'])->default('collaborateur');
            $table->date('date_integration')->nullable();
            $table->timestamps();
            
            $table->integer('id_personne');
            $table->foreign('id_personne')->references('id_personne')->on('personnes')->onDelete('cascade');

            $table->integer('id_equipe');
            $table->foreign('id_equipe')->references('id_equipe')->on('equipes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formes');
    }
};
