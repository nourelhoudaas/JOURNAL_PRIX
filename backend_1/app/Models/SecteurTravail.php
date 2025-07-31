<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SecteurTravail extends Model
{
    protected $table = 'secteur_travail';
    protected $primaryKey = 'id_sect';
    protected $fillable = ['nom_ar_sect', 'nom_fr_sect'];

    public function categoriesEtat()
    {
        return $this->hasMany(CategorieEtat::class, 'id_sect');
    }
}
