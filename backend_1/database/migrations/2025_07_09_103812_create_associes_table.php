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
        Schema::create('associes', function (Blueprint $table) {
                $table->engine = 'InnoDB';
   
             $table->integer('id_associe')->primary()->autoIncrement();

            $table->integer('id_oeuvre');
            $table->foreign('id_oeuvre')->references('id_oeuvre')->on('travails')->onDelete('cascade');

        

            $table->integer('id_theme');
            $table->foreign('id_theme')->references('id_theme')->on('themes')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('associes');
    }
};
