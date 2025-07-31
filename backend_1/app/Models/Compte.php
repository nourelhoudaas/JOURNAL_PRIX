<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Compte extends Model
{
    protected $table = 'comptes';
    protected $primaryKey = 'id_compte';
    public $incrementing = true;
    protected $keyType = 'integer';  
    public $timestamps = false; 
    protected $fillable = ['id_compte','username','email','mot_passe_hash','email_verification_code','statut_email','date_creation_cmpt','date_update_cmpt','code_forget_pass_generate'
   ,'id','date_verification_email',
    ];

      public function compte_personne ()
    {
        return $this->hasMany(personne::class,'id_compte','id_compte');
    }

         public function compteuser ()
    {
        return $this->belongsTo(User::class,'id','id');
    }
}
    

  