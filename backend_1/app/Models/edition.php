<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class edition extends Model
{
    
    protected $table = 'editions';
    protected $primaryKey = 'id_edition';
    public $incrementing = true;
    protected $keyType = 'integer';  
    public $timestamps = false; 
    protected $fillable = ['id_edition','annee_edition','num_edition','date_lancement_edition','date_limite_depotDossier','statut_edition'
];
  public function appartientedition()
    {
        return $this->hasMany(appartient::class,'id_edition','id_edition');
    }

}
 
           