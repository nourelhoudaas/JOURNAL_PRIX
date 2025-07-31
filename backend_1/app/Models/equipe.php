<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class equipe extends Model
{
     
    protected $table = 'equipes';
    protected $primaryKey = 'id_equipe';
    public $incrementing = true;
    protected $keyType = 'integer';  
    public $timestamps = false; 
    protected $fillable = ['id_equipe','nom_equipe_ar','nom_equipe_fr','id_personne','id_oeuvre',
];
  public function equipepersonne()
    {
        return $this->belongsTo(personne::class,'id_personne','id_personne');
    }

     public function equipetravail()
    {
        return $this->belongsTo(travail::class,'id_oeuvre','id_oeuvre');
    }

}
       