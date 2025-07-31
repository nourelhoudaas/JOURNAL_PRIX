<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class jury extends Model
{
    protected $table = 'juries';
    protected $primaryKey = 'id_jury';
    public $incrementing = true;
    protected $keyType = 'integer';  
    public $timestamps = false; 
    protected $fillable = ['id_jury','date_debut_mondat','date_fin_mondat'
   
    ];

}

  