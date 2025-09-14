<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class forme extends Model
{
    protected $table = 'formes';
    protected $primaryKey = 'id_forme';
    public $incrementing = true;
    protected $keyType = 'integer';  
    public $timestamps = true; 
     protected $fillable = [
        'id_equipe',
        'id_personne',
        'date_forme_equipe',
        'situation',
        'role_personne',
        'date_integration',
    ];

protected $casts = [
        'date_forme_equipe' => 'datetime',
        'date_integration' => 'date',
        'role' => 'string',
    ];
    
  public function equipepersonne()
    {
        return $this->belongsTo(personne::class,'id_personne','id_personne');
    }

    public function equipeforme()
    {
        return $this->belongsTo(equipe::class,'id_equipe','id_equipe');
    }

    //rajouter par moi sayah
     public function equipe()
    {
        return $this->belongsTo(Equipe::class, 'id_equipe', 'id_equipe');
    }

    public function personne()
    {
        return $this->belongsTo(Personne::class, 'id_personne', 'id_personne');
    }
}
