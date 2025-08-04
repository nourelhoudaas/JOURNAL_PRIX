
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('occuper', function (Blueprint $table) {
            $table->id();
            $table->date('date_recrut');
            $table->string('num_attes', 191)->unique();
            $table->foreignId('id_etab')->constrained('etablissement', 'id_etab')->onDelete('cascade');
            $table->foreignId('id_personne')->constrained('personnes', 'id_personne')->onDelete('cascade');
            $table->foreignId('id_fichier')->nullable()->constrained('fichiers', 'id_fichier')->onDelete('set null');
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
