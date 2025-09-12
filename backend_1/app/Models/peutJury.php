<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class peutJury extends Model
{
  
    protected $table = 'peut-etre-juries';
    protected $primaryKey = 'id_peut_etre_jury';
    public $incrementing = true;
    protected $keyType = 'integer';  
    public $timestamps = false; 
    protected $fillable = ['id_peut_etre_jury','id_personne','id_jury',
    ];

      public function peutJuryPersonne()
    {
        return $this->belongsTo(personne::class,'id_personne','id_personne');
    }

     public function peutJury()
    {
        return $this->belongsTo(jury::class,'id_jury','id_jury');
    }

    //rajouter par moi sayah
    public function peutParticipantPersonne()
    {
        return $this->belongsTo(personne::class,'id_personne','id_personne');
    }

     public function peutParticipant()
    {
        return $this->belongsTo(jury::class,'id_jury','id_jury');
    }
} 
