<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Relations\Pivot;

class Forme extends Pivot
{
    protected $table = 'forme';
    protected $primaryKey = null;
    public $incrementing = false;
    protected $fillable = ['id_equipe', 'id_personne', 'role', 'date_integration'];
    protected $casts = [
        'role' => 'string',
        'date_integration' => 'date',
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