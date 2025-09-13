
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('occuper', function (Blueprint $table) {
            $table->integer('id_occup')->primary()->autoIncrement();
            $table->date('date_recrut');
            $table->unsignedBigInteger('id_etab');
            $table->Integer('id_personne');
            $table->Integer('id_fichier');

            $table->string('num_attes', 191);
            $table->foreign('id_etab')->references('id_etab')->on('etablissement')->onDelete('cascade');
            $table->foreign('id_personne')->references('id_personne')->on('personnes')->onDelete('cascade');
            $table->foreign('id_fichier')->references('id_fichier')->on('fichiers')->onDelete('cascade');
            $table->timestamps();
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
        });
    }

    public function down()
    {
        Schema::dropIfExists('occuper');
    }
};
