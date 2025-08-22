<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateContientsTable extends Migration
{
    public function up()
    {
        Schema::create('contients', function (Blueprint $table) {
            $table->engine = 'InnoDB'; // Ajout pour cohérence
            $table->id('id_contient');
            $table->foreignId('id_oeuvre')->constrained('travails', 'id_oeuvre')->onDelete('cascade');
            $table->foreignId('id_categorie')->constrained('categories', 'id_categorie')->onDelete('cascade');
            $table->timestamps();
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
        });
    }

    public function down()
    {
        Schema::dropIfExists('contients');
    }
}