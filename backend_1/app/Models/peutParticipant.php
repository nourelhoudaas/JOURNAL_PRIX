<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class peutParticipant extends Model
{
    protected $table = 'peut-etre-participants';
    protected $primaryKey = 'id_peut_etre_participant';
    public $incrementing = true;
    protected $keyType = 'integer';  
    public $timestamps = false; 
    protected $fillable = ['id_peut_etre_participant','id_personne','id_participant',
    ];

      public function peutParticipantPersonne()
    {
        return $this->belongsTo(personne::class,'id_personne','id_personne');
    }

     public function peutParticipant()
    {
        return $this->belongsTo(participant::class,'id_participant','id_participant');
    }
}
   