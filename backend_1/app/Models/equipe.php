<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Equipe extends Model
{
    protected $table = 'equipes';
    protected $primaryKey = 'id_equipe';
    public $incrementing = true;
    protected $keyType = 'integer';
    public $timestamps = true;
    protected $fillable = [
        'id_equipe',
        'nom_equipe_ar',
        'nom_equipe_fr',
        'created_at',
        'updated_at'
    ];

    

    public function membres()
    {
        return $this->belongsToMany(Personne::class, 'forme', 'id_equipe', 'id_personne')
                    ->withPivot('role', 'date_integration');
    }
}