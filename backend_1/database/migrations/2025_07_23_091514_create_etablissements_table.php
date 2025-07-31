<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
public function up()
{
    Schema::create('etablissement', function (Blueprint $table) {
        $table->id('id_etab');
        $table->string('nom_ar_etab');
        $table->string('nom_fr_etab');
        $table->string('email_etab');
        $table->string('tel_etab');
        $table->string('langue')->nullable();
        $table->string('specialite')->nullable();
        $table->string('tv')->nullable();
        $table->string('radio')->nullable();
        $table->string('media')->nullable();
        $table->unsignedBigInteger('id_type_media');
         $table->foreignId('id_specialite')->nullable()->constrained('specialite')->onDelete('set null');
        $table->foreign('id_type_media')->references('id_type_media')->on('type_media')->onDelete('cascade');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('etablissements');
    }
};
