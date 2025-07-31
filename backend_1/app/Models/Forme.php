<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Forme extends Model
{
    protected $table = 'forme'; // Nom de la table

    public $timestamps = false; // Si la table n'a pas les colonnes created_at et updated_at

    protected $primaryKey = null; // Pas de clé primaire simple

    public $incrementing = false; // Pas de clé auto-incrémentée car clé composée

    protected $fillable = [
        'id_equipe',
        'id_personne',
        'role',
        'date_integration',
    ];

    /**
     * Relation avec le modèle Equipe
     */
    public function equipe()
    {
        return $this->belongsTo(Equipe::class, 'id_equipe');
    }

    /**
     * Relation avec le modèle Personne
     */
    public function personne()
    {
        return $this->belongsTo(Personne::class, 'id_personne');
    }
}
