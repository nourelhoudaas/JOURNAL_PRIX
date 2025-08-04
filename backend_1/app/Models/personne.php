<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Personne extends Model
{
    protected $primaryKey = 'id_personne';
    public $incrementing = true;
    public $timestamps = true;
    protected $fillable = [
        'id_nin_personne', 'nom_personne_ar', 'nom_personne_fr', 'prenom_personne_ar',
        'prenom_personne_fr', 'date_naissance', 'lieu_naissance_ar', 'lieu_naissance_fr',
        'nationalite_ar', 'nationalite_fr', 'id_professional_card', 'num_tlf_personne',
        'adresse_ar', 'adresse_fr', 'fonction_ar', 'fonction_fr', 'sexe_personne_ar',
        'sexe_personne_fr', 'groupage', 'id_compte', 'id_dossier','updated_at','created_at'
    ];
    protected $casts = [
        'date_naissance' => 'date',
    ];

    public function compte()
    {
        return $this->belongsTo(Compte::class, 'id_compte', 'id_compte');
    }

    public function dossier()
    {
        return $this->belongsTo(Dossier::class, 'id_dossier', 'id_dossier');
    }

    public function equipes()
    {
        return $this->belongsToMany(Equipe::class, 'forme', 'id_personne', 'id_equipe')
                    ->withPivot('role', 'date_integration');
    }

    public function occupers()
    {
        return $this->hasMany(Occuper::class, 'id_personne', 'id_personne');
    }

    // Méthode pour récupérer les fichiers spécifiques (carte nationale, photo, attestation)
    public function getCarteNationaleAttribute()
    {
        return $this->dossier ? $this->dossier->fichiers()->where('type', 'carte_nationale')->first() : null;
    }

    public function getPhotoAttribute()
    {
        return $this->dossier ? $this->dossier->fichiers()->where('type', 'photo')->first() : null;
    }
}