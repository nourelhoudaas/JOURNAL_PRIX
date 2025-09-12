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
    protected $fillable = [
        'titre_oeuvre_ar',
        'titre_oeuvre_fr',
        'Duree_nbr_signes',
        'date_publication',
        'description_oeuvre_ar',
        'description_oeuvre_fr',
        'statut_oeuvre_ar',
        'statut_oeuvre_fr',
        'valider_oeuvre',
        'id_fichier',
        'video_url',

    ];

    protected $casts = [
        'Duree_nbr_signes' => 'datetime:H:i:s', // Peut-être à revoir si c'est un nombre de signes
        'date_publication' => 'date',

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
        return $this->hasMany(participe::class,'id_oeuvre','id_oeuvre');
    }
        public function travailfichier()
    {
        return $this->hasMany(fichier::class,'id_oeuvre','id_oeuvre');
    }

     public function fichiers()
    {
        return $this->hasMany(Fichier::class, 'id_oeuvre', 'id_oeuvre');
    }

    public function contients()
    {
        return $this->hasMany(Contient::class, 'id_oeuvre', 'id_oeuvre');
    }

    public function equipes()
    {
        return $this->hasMany(Equipe::class, 'id_oeuvre', 'id_oeuvre');
    }

    public function participations()
    {
        return $this->hasMany(participe::class, 'id_oeuvre', 'id_oeuvre');
    }


    public function associes()
    {
        return $this->hasMany(Associe::class, 'id_oeuvre', 'id_oeuvre');
    }
}

