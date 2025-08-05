<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Participer extends Model
{
    protected $table = 'participer';
    protected $primaryKey = 'id_participer';
    public $timestamps = true;

    protected $fillable = [
        'id_oeuvre',
        'id_equipe',
        'date_creation_oeuvre',
    ];

    protected $casts = [
        'date_creation_oeuvre' => 'datetime',
    ];

    public function oeuvre()
    {
        return $this->belongsTo(Travail::class, 'id_oeuvre', 'id_oeuvre');
    }

    public function equipe()
    {
        return $this->belongsTo(Equipe::class, 'id_equipe', 'id_equipe');
    }
}