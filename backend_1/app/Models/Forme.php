<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Forme extends Model
{
    protected $table = 'forme';
    protected $primaryKey = 'id_form';
    public $timestamps = true;

    protected $fillable = [
        'id_equipe',
        'id_personne',
        'date_forme_equipe',
        'situation_forme_equipe',
        'role',
        'date_integration',
    ];

    protected $casts = [
        'date_forme_equipe' => 'datetime',
        'date_integration' => 'date',
        'role' => 'string', // Enum casté en string
    ];

    public function equipe()
    {
        return $this->belongsTo(Equipe::class, 'id_equipe', 'id_equipe');
    }

    public function personne()
    {
        return $this->belongsTo(Personne::class, 'id_personne', 'id_personne');
    }
}