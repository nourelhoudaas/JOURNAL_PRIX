<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Etablissement extends Model
{
    protected $table = 'etablissement';
    protected $primaryKey = 'id_etab';
    protected $fillable = ['nom_ar_etab', 'nom_fr_etab', 'email_etab', 'tel_etab', 'id_type_media', 'id_specialite', 'langue', 'tv', 'radio', 'media'];

    public function typeMedia()
    {
        return $this->belongsTo(TypeMedia::class, 'id_type_media');
    }

    public function ccuper()
    {
        return $this->hasMany(Occuper::class, 'id_etab');
    }

    public function specialite()
    {
        return $this->belongsTo(Specialite::class, 'id_specialite');
    }
}
