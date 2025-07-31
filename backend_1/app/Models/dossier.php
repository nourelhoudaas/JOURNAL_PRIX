<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class dossier extends Model
{
    protected $table = 'dossiers';
    protected $primaryKey = 'id_dossier';
    public $incrementing = true;
    protected $keyType = 'integer';  
    public $timestamps = false; 
    protected $fillable = ['id_dossier','date_create_dossier','statut_dossier','id_fichier','id_personne'
   
    ];

      public function dossierpersonne ()
    {
        return $this->belongsTo(personne::class,'id_personne','id_personne');
    }

       public function dossierfichier ()
    {
        return $this->belongsTo(fichier::class,'id_fichier','id_fichier');
    }
}
    