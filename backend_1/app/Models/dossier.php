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
    protected $fillable = ['id_dossier','date_create_dossier','statut_dossier',
   
    ];

      public function dossierpersonne ()
    {
        return $this->hasMany(personne::class,'id_dossier','id_dossier');
    }

       public function dossierfichier ()
    {
        return $this->hasMany(fichier::class,'id_oeuvre','id_oeuvre');
    }
    
    // rajouter par moi sayah
    public function fichiers()
    {
        return $this->hasMany(Fichier::class, 'id_dossier', 'id_dossier');
    }
}
    