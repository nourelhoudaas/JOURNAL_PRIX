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
    protected $fillable = ['id_fichier','nom_fichier_ar','nom_fichier_fr','file_path','size','date_upload','type'
];
  public function dossierfichier()
    {
        return $this->hasMany(dossier::class,'id_fichier','id_fichier');
    }

    

}

         