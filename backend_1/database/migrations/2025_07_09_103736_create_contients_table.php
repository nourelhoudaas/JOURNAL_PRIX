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
        Schema::create('contients', function (Blueprint $table) {
         
                $table->engine = 'InnoDB';
            $table->integer('id_contient')->primary()->autoIncrement();

            $table->integer('id_oeuvre');
            $table->foreign('id_oeuvre')->references('id_oeuvre')->on('travails')->onDelete('cascade');

        

            $table->integer('id_categorie');
            $table->foreign('id_categorie')->references('id_categorie')->on('categories')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contients');
    }
};
