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
        Schema::create('occuper', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->date('date_recrut')->nullable(false);
            $table->unsignedBigInteger('num_attes')->unique();
            $table->unsignedBigInteger('id_etab');
            $table->unsignedBigInteger('id_personne');
            $table->string('attestation_travail_path', 191)->nullable();
            $table->timestamps();

            // Clés étrangères
            $table->foreign('id_etab')->references('id_etab')->on('etablissement')->onDelete('cascade');
            $table->foreign('id_personne')->references('id_personne')->on('personnes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('occuper');
    }
};