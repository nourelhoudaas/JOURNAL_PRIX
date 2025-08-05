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
        Schema::create('peut_etre_juries', function (Blueprint $table) {
                $table->engine = 'InnoDB';
            $table->integer('id_peut_etre_jury')->primary()->autoIncrement();

           $table->unsignedBigInteger('id_personne');
            $table->foreign('id_personne')->references('id_personne')->on('personnes')->onDelete('cascade');

        

            $table->integer('id_jury');
            $table->foreign('id_jury')->references('id_jury')->on('juries')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peut_etre_juries');
    }
};
