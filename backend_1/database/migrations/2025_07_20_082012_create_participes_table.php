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
        Schema::create('participes', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->integer('id_partcipe')->primary()->autoIncrement();
            $table->DateTime('date_creation_oeuvre');

            $table->integer('id_oeuvre');
            $table->foreign('id_oeuvre')->references('id_oeuvre')->on('travails')->onDelete('cascade');
            $table->timestamps();


            $table->integer('id_equipe');
            $table->foreign('id_equipe')->references('id_equipe')->on('equipes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('participes');
    }
};
