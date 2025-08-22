<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Appartient extends Model
{
    protected $table = 'appartients';
    protected $primaryKey = 'id_appartient';
    public $incrementing = true;
    protected $keyType = 'integer';  
    public $timestamps = false; 
    protected $fillable = ['id_appartient','id_edition','id_theme',
    ];

      public function appartientedition()
    {
        return $this->belongsTo(edition::class,'id_edition','id_edition');
    }

     public function appartienttheme()
    {
        return $this->belongsTo(theme::class,'id_theme','id_theme');
    }
}
