<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
      protected $table = 'categories';
    protected $primaryKey = 'id_categorie';
    public $incrementing = true;
    protected $keyType = 'integer';  
    public $timestamps = false; 
    protected $fillable = ['id_categorie','nom_categorie_ar','nom_categorie_fr','description_cat_ar','description_cat_fr','nbr_max_oeuvre',
   
    ];
      public function contientcategorie ()
    {
        return $this->hasMany(contient::class,'id_categorie','id_categorie');
    }
}
   