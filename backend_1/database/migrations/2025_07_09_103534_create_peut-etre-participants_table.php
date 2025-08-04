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
        Schema::create('peut-etre-participants', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->integer('id_peut_etre_participant')->primary()->autoIncrement();
            $table->unsignedBigInteger('id_personne'); // Changed to unsignedBigInteger
            $table->foreign('id_personne')->references('id_personne')->on('personnes')->onDelete('cascade');
            $table->integer('id_participant');
            $table->foreign('id_participant')->references('id_participant')->on('participants')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peut-etre-participants');
    }
};