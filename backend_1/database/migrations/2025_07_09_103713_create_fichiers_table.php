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
        Schema::create('fichiers', function (Blueprint $table) {
                $table->engine = 'InnoDB';
            $table->integer('id_fichier')->primary()->autoIncrement();
            $table->string('nom_fichier_ar');
            $table->string('nom_fichier_fr');
            $table->string('file_path'); 
            $table->string('type'); 
            $table->integer('size');
            $table->dateTime('date_upload');
         
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fichiers');
    }
};
