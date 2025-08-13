<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Occuper extends Model
{
    protected $table = 'occuper';
    protected $primaryKey = 'id_occup';
    public $incrementing = true;
    protected $fillable = ['date_recrut', 'num_attes', 'id_etab', 'id_personne', 'id_fichier'];
    protected $casts = [
        'date_recrut' => 'date',
        'num_attes' => 'string', // Explicitement caster en string
    ];

    public function etablissement()
    {
        return $this->belongsTo(Etablissement::class, 'id_etab', 'id_etab');
    }

    public function personne()
    {
        return $this->belongsTo(Personne::class, 'id_personne', 'id_personne');
    }

    public function fichier()
    {
        return $this->belongsTo(Fichier::class, 'id_fichier', 'id_fichier');
    }

    
}