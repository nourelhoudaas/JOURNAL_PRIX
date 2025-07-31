<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class travail extends Model
{
    protected $table = 'travails';
    protected $primaryKey = 'id_oeuvre';
    public $incrementing = true;
    protected $keyType = 'integer';  
    public $timestamps = false; 
    protected $fillable = ['id_oeuvre','titre_oeuvre_ar','titre_oeuvre_fr','Duree_nbr_signes','date_publication','description_oeuvre_ar','description_oeuvre_fr','statut_oeuvre_ar',
    'statut_oeuvre_fr','valider_oeuvre','date_creation_oeuvre','annee_gain','classement','id_fichier',
    ];

      public function contienttravail()
    {
        return $this->hasMany(contient::class,'id_oeuvre','id_oeuvre');
    }

     public function associetravail()
    {
        return $this->hasMany(associe::class,'id_oeuvre','id_oeuvre');
    }

     public function equipetravail()
    {
        return $this->hasMany(equipe::class,'id_oeuvre','id_oeuvre');
    }

        public function travailEquipe()
    {
        return $this->hasMany(equipe::class,'id_oeuvre','id_oeuvre');
    }

        public function travailfichier()
    {
        return $this->belongsTo(fichier::class,'id_fichier','id_fichier');
    }
}

