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
        Schema::create('comptes', function (Blueprint $table) {
            $table->engine = 'InnoDB';
            $table->integer('id_compte')->primary()->autoIncrement();
            $table->string('username')->unique();
            $table->string('email')->unique();
            $table->string('mot_passe_hash');
            $table->string('email_verification_code');
            $table->string('statut_email');
            $table->string('code_forget_pass_generate');
            $table->dateTime('date_creation_cmpt');
            $table->dateTime('date_update_cmpt')->nullable();
            $table->dateTime('date_verification_email')->nullable();
            $table->unsignedBigInteger('id');
            $table->foreign('id')->references('id')->on('users')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('comptes');
    }
};
