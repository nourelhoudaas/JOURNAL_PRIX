<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class personne extends Model
{
    protected $table = 'personnes';
    protected $primaryKey = 'id_personne';
    public $incrementing = true;
    protected $keyType = 'integer';  
    public $timestamps = false; 
    protected $fillable = ['id_personne','id_nin_personne','nom_personne_ar','nom_personne_fr','prenom_personne_ar','prenom_personne_fr','date_naissance','lieu_naissance_ar',
    'lieu_naissance_fr','nationalite_ar','nationalite_fr','id_professional_card','num_tlf_personne','adresse_ar','adresse_fr','fonction_ar','fonction_fr','organisme_ar',
    'organisme_fr','id_compte','sexe_personne_ar','sexe_personne_fr','groupage','photo_path'
   
    ];

      public function compte_personne ()
    {
        return $this->belongsTo(Compte::class,'id_compte','id_compte');
    }

      public function equipepersonne ()
    {
        return $this->hasMany(equipe::class,'id_personne','id_personne');
    }

       public function dossierpersonne ()
    {
        return $this->hasMany(dossier::class,'id_personne','id_personne');
    }
}