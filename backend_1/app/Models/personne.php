<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class personne extends Model
{
    protected $table = 'personnes';
    protected $primaryKey = 'id_personne';
    public $incrementing = true;
    protected $keyType = 'integer';  
    public $timestamps = true; 
    protected $fillable = ['id_personne',
    'id_nin_personne','nom_personne_ar',
    'nom_personne_fr','prenom_personne_ar',
    'prenom_personne_fr','date_naissance',
    'lieu_naissance_ar',
    'lieu_naissance_fr','nationalite_ar',
    'nationalite_fr','id_professional_card',
    'num_tlf_personne','adresse_ar','adresse_fr',
    'fonction_ar','fonction_fr','organisme_ar',
    'organisme_fr','id_compte','sexe_personne_ar',
    'sexe_personne_fr','groupage','photo_path',
    'id_dossier','updated_at', 'created_at',
   
    ];

      public function compte_personne ()
    {
        return $this->belongsTo(Compte::class,'id_compte','id_compte');
    }

      public function equipepersonne ()
    {
        return $this->hasMany(forme::class,'id_personne','id_personne');
    }

       public function dossierpersonne ()
    {
        return $this->belongsTo(dossier::class,'id_dossier','id_dossier');
    }

        public function peutParticipantPersonne()
    {
        return $this->hasMany(peutParticipant::class,'id_personne','id_personne');
    }

       public function peutJuryPersonne()
    {
        return $this->hasMany(peutJury::class,'id_personne','id_personne');
    }

    //rajouter par moi sayah
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

    public function getCarteNationaleAttribute()
    {
        return $this->dossier ? $this->dossier->fichiers()->where('type', 'carte_nationale')->first() : null;
    }

    public function getPhotoAttribute()
    {
        return $this->dossier ? $this->dossier->fichiers()->where('type', 'photo')->first() : null;
    }

    public function formes()
    {
        return $this->hasMany(Forme::class, 'id_personne');
    }
}