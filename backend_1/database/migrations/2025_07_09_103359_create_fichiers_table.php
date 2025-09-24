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
            $table->string('nom_fichier_ar')->nullable();
            $table->string('nom_fichier_fr')->nullable();
            $table->string('file_path')->nullable(); 
            $table->string('type')->nullable(); 
            $table->string('extension')->nullable();
            $table->integer('size')->nullable();
            $table->dateTime('date_upload')->nullable();

           $table->integer('id_oeuvre')->nullable();
            $table->foreign('id_oeuvre')->references('id_oeuvre')->on('travails')->onDelete('cascade');

            $table->integer('id_dossier')->nullable();
            $table->foreign('id_dossier')->references('id_dossier')->on('dossiers')->onDelete('cascade');
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
