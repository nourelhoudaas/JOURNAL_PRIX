<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TypeMedia extends Model
{
    protected $table = 'type_media';
    protected $primaryKey = 'id_type_media';
    protected $fillable = ['nom_ar_type_media', 'nom_fr_type_media', 'id_cat_etat'];

    public function categorieEtat()
    {
        return $this->belongsTo(CategorieEtat::class, 'id_cat_etat');
    }

    public function etablissements()
    {
        return $this->hasMany(Etablissement::class, 'id_type_media');
    }
}
