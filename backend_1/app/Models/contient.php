<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contient extends Model
{
    protected $table = 'contients';
    protected $primaryKey = 'id_contient';
    public $incrementing = true;
    protected $keyType = 'integer';  
    public $timestamps = true; 
    protected $fillable = ['id_contient','id_oeuvre',
    'id_categorie','annee_gain','classement','created_at',
        'updated_at'
   
    ];

      public function contienttravail ()
    {
        return $this->belongsTo(travail::class,'id_oeuvre','id_oeuvre');
    }

       public function contientcategorie ()
    {
        return $this->belongsTo(categorie::class,'id_categorie','id_categorie');
    }

// rajouter par moi sayah
    public function oeuvre()
    {
        return $this->belongsTo(Travail::class, 'id_oeuvre', 'id_oeuvre');
    }

    public function categorie()
    {
        return $this->belongsTo(Categorie::class, 'id_categorie', 'id_categorie');
    }
}
 