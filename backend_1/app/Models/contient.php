<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class contient extends Model
{
    protected $table = 'contients';
    protected $primaryKey = 'id_contient';
    public $incrementing = true;
    protected $keyType = 'integer';  
    public $timestamps = false; 
    protected $fillable = ['id_contient','id_oeuvre','id_categorie',
   
    ];

      public function contienttravail ()
    {
        return $this->belongsTo(travail::class,'id_oeuvre','id_oeuvre');
    }

       public function contientcategorie ()
    {
        return $this->belongsTo(categories::class,'id_oeuvre','id_oeuvre');
    }
}
 