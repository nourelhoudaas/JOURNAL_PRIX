<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFichiersTable extends Migration
{
    public function up()
    {
        Schema::create('fichiers', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->id('id_fichier');
            $table->string('nom_fichier_ar', 191);
            $table->string('nom_fichier_fr', 191);
            $table->string('file_path', 191);
            $table->string('type', 191);
            $table->integer('size');
            $table->foreignId('id_dossier')->constrained('dossiers', 'id_dossier')->onDelete('cascade');
            $table->foreignId('id_oeuvre')->nullable()->constrained('travails', 'id_oeuvre')->onDelete('cascade');
            $table->dateTime('date_upload');
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
        });
    }

    public function down()
    {
        Schema::dropIfExists('fichiers');
    }
}
