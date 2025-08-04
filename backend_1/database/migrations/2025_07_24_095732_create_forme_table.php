<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFormeTable extends Migration
{
    public function up()
    {
        Schema::create('forme', function (Blueprint $table) {
            $table->foreignId('id_equipe')->constrained('equipes', 'id_equipe')->onDelete('cascade');
            $table->foreignId('id_personne')->constrained('personnes', 'id_personne')->onDelete('cascade');
            $table->enum('role', ['principal', 'membre'])->default('membre');
            $table->date('date_integration')->nullable();
            $table->primary(['id_equipe', 'id_personne']);
            $table->charset = 'utf8mb4';
            $table->collation = 'utf8mb4_unicode_ci';
        });
    }

    public function down()
    {
        Schema::dropIfExists('forme');
    }
}