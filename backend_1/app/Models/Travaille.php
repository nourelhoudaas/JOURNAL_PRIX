<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Travaille extends Model
{
    protected $table = 'travaille';
    protected $fillable = ['date_recrut', 'num_asset', 'id_etab', 'id_personne'];

    public function etablissement()
    {
        return $this->belongsTo(Etablissement::class, 'id_etab');
    }

    public function personne()
    {
        return $this->belongsTo(Personne::class, 'id_personne');
    }
}
