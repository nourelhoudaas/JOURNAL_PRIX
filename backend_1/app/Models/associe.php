<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class associe extends Model
{
    protected $table = 'associes';
    protected $primaryKey = 'id_associe';
    public $incrementing = true;
    protected $keyType = 'integer';  
    public $timestamps = false; 
    protected $fillable = ['id_associe','id_oeuvre','id_theme',
   
    ];

      public function associetravail ()
    {
        return $this->belongsTo(travail::class,'id_oeuvre','id_oeuvre');
    }

       public function associetheme ()
    {
        return $this->belongsTo(theme::class,'id_theme','id_theme');
    }
}
