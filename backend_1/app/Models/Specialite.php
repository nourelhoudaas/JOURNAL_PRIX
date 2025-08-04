<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Specialite extends Model
{
    use HasFactory;

    // Nom de la table (facultatif si le nom du modèle correspond à celui de la table au pluriel)
    protected $table = 'specialite';

    // Champs remplissables (mass assignable)
    protected $fillable = [
        'name_ar',
        'name_fr',
    ];
}
