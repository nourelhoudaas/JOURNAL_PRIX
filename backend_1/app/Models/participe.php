<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class participe extends Model
{
    protected $table = 'participes';
    protected $primaryKey = 'id_partcipe';
    public $incrementing = true;
    protected $keyType = 'integer';  
    public $timestamps = false; 
    protected $fillable = ['id_partcipe',
    'date_creation_oeuvre','id_oeuvre','id_equipe'
   
    ];
    public function equipepartcipe()
    {
        return $this->belongsTo(equipe::class,'id_equipe','id_equipe');
    }

       public function equipetravail()
    {
        return $this->belongsTo(travail::class,'id_oeuvre','id_oeuvre');
    }

    //rajouter par moi sayah
     public function oeuvre()
    {
        return $this->belongsTo(Travail::class, 'id_oeuvre', 'id_oeuvre');
    }

    public function equipe()
    {
        return $this->belongsTo(Equipe::class, 'id_equipe', 'id_equipe');
    }
}
       