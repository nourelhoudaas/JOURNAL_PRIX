<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTravailsTable extends Migration
{
    public function up()
    {
        Schema::create('travails', function (Blueprint $table) {
            $table->engine = 'InnoDB'; // Ajout de InnoDB pour cohérence
            $table->id('id_oeuvre');
            $table->string('titre_oeuvre_ar', 191);
            $table->string('titre_oeuvre_fr', 191);
            $table->time('Duree_nbr_signes')->nullable();
            $table->date('date_publication');
            $table->text('description_oeuvre_ar');
            $table->text('description_oeuvre_fr');
            $table->string('statut_oeuvre_ar', 191);
            $table->string('statut_oeuvre_fr', 191);
            $table->string('valider_oeuvre', 191);
            $table->url('video_url')->nullable();
            $table->date('annee_gain')->nullable();
            $table->integer('classement')->nullable();
            $table->timestamps();
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
        });
    }

    public function down()
    {
        Schema::dropIfExists('travails');
    }
}