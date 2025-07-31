<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CategorieEtat extends Model
{
    protected $table = 'categorie_etat';
    protected $primaryKey = 'id_cat_etat';
    protected $fillable = ['nom_ar_etat', 'nom_fr_etat', 'id_sect'];

    public function secteur()
    {
        return $this->belongsTo(SecteurTravail::class, 'id_sect');
    }

    public function typesMedia()
    {
        return $this->hasMany(TypeMedia::class, 'id_cat_etat');
    }
}
