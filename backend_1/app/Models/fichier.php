<?php
namespace App\Models;
App\\Models\\Dossier;
use Illuminate\Database\Eloquent\Model;

class Fichier extends Model
{
    protected $primaryKey = 'id_fichier';
    public $incrementing = true;
    public $timestamps = false;
    protected $fillable = [
        'nom_fichier_ar', 'nom_fichier_fr', 'file_path', 'type', 'size', 'date_upload', 'id_dossier', 'id_oeuvre'
    ];
    protected $casts = [
        'date_upload' => 'datetime',
    ];

    public function dossier()
    {
        return $this->belongsTo(Dossier::class, 'id_dossier', 'id_dossier');
    }

    public function travail()
    {
        return $this->belongsTo(Travail::class, 'id_oeuvre', 'id_oeuvre');
    }

    public function occuper()
    {
        return $this->hasOne(Occuper::class, 'id_fichier', 'id_fichier');
    }
}