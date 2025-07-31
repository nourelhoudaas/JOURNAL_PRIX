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
        Schema::create('editions', function (Blueprint $table) {
                $table->engine = 'InnoDB';
            $table->integer('id_edition')->primary()->autoIncrement();
            $table->date('annee_edition');
            $table->integer('num_edition');
            $table->date('date_lancement_edition');
            $table->date('date_limite_depotDossier');
            $table->string('statut_edition');
           
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('editions');
    }
};
