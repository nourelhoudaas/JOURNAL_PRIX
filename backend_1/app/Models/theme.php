<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class theme extends Model
{
     protected $table = 'themes';
    protected $primaryKey = 'id_theme';
    public $incrementing = true;
    protected $keyType = 'integer';  
    public $timestamps = false; 
    protected $fillable = ['id_theme','titre_ar','titre_fr',
    ];

      public function appartienttheme()
    {
        return $this->hasMany(appartient::class,'id_theme','id_theme');
    }

     public function associetheme()
    {
        return $this->hasMany(associe::class,'id_theme','id_theme');
    }
}
 