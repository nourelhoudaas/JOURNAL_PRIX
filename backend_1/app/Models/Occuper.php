<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Occuper extends Model
{
    protected $table = 'occuper';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $keyType = 'bigInteger';

    protected $fillable = [
        'date_recrut',
        'num_attes',
        'id_etab',
        'id_personne',
        'attestation_travail_path',
    ];

    protected $casts = [
        'date_recrut' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relation avec la table etablissement
     */
    public function etablissement()
    {
        return $this->belongsTo(Etablissement::class, 'id_etab', 'id_etab');
    }

    /**
     * Relation avec la table personnes
     */
    public function personne()
    {
        return $this->belongsTo(Personne::class, 'id_personne', 'id_personne');
    }
}