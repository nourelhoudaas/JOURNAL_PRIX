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
        Schema::create('appartients', function (Blueprint $table) {
                $table->engine = 'InnoDB';
            $table->integer('id_appartient')->primary()->autoIncrement();

            $table->integer('id_edition');
            $table->foreign('id_edition')->references('id_edition')->on('editions')->onDelete('cascade');

            $table->integer('id_theme');
            $table->foreign('id_theme')->references('id_theme')->on('themes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('appartients');
    }
};
