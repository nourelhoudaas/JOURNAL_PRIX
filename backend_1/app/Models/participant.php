<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class participant extends Model
{
    protected $table = 'participants';
    protected $primaryKey = 'id_participant';
    public $incrementing = true;
    protected $keyType = 'integer';  
    public $timestamps = false; 
    protected $fillable = ['id_participant','date_debut_activité',
   
    ];
    public function peutParticipant()
    {
        return $this->hasMany(peutParticipant::class,'id_participant','id_participant');
    }
}
 