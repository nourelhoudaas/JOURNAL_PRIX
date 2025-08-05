<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contient extends Model
{
    protected $table = 'contients';
    protected $primaryKey = 'id_contient';
    public $timestamps = true;

    protected $fillable = [
        'id_oeuvre',
        'id_categorie',
        'annee_gain',
        'classement',
    ];

    protected $casts = [
        'annee_gain' => 'date',
        'classement' => 'integer',
    ];

    public function oeuvre()
    {
        return $this->belongsTo(Travail::class, 'id_oeuvre', 'id_oeuvre');
    }

    public function categorie()
    {
        return $this->belongsTo(categories::class, 'id_categorie', 'id_categorie');
    }
}