<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class fichier extends Model
{
    protected $table = 'fichiers';
    protected $primaryKey = 'id_fichier';
    public $incrementing = true;
    protected $keyType = 'integer';  
    public $timestamps = false; 
    protected $fillable = ['id_fichier','nom_fichier_ar',
    'nom_fichier_fr','file_path','size','date_upload',
    'type','id_dossier','id_oeuvre','extension'
];
  public function dossierfichier()
    {
        return $this->belongsTo(dossier::class,'id_dossier','id_dossier');
    }

      public function travailfichier()
    {
        return $this->belongsTo(travail::class,'id_oeuvre','id_oeuvre');
    }

    public function editionfichier()
    {
        return $this->hasMany(edition::class,'id_fichier','id_fichier');
    }
    
    //rajouter par moi sayah
    public function dossier()
    {
        return $this->belongsTo(Dossier::class, 'id_dossier', 'id_dossier');
    }

    public function travail()
    {
        return $this->belongsTo(Travail::class, 'id_oeuvre', 'id_oeuvre');
    }

    public function occuper()
    {
        return $this->hasOne(Occuper::class, 'id_fichier', 'id_fichier');
    }

}

         