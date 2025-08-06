<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dossier extends Model
{
    protected $table = 'dossiers'; // Nom de la table

    protected $primaryKey = 'id_dossier'; // Clé primaire personnalisée

    public $timestamps = false; // Pas de colonnes created_at / updated_at

    protected $fillable = [
        'date_create_dossier',
        'statut_dossier',
    ];

    protected $casts = [
        'date_create_dossier' => 'datetime',
    ];

    public function fichiers()
    {
        return $this->hasMany(Fichier::class, 'id_dossier', 'id_dossier');
    }
}


