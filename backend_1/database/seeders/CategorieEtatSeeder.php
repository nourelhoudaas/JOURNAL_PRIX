<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CategorieEtat;

class CategorieEtatSeeder extends Seeder
{
    public function run()
    {
        CategorieEtat::insert([
            ['nom_ar_etat' => 'وسائط صوتية', 'nom_fr_etat' => 'Média audio', 'id_sect' => 2],
            ['nom_ar_etat' => 'وسائط مكتوبة و إلكترونية', 'nom_fr_etat' => 'Média écrit et électronique', 'id_sect' => 2],
            ['nom_ar_etat' => 'خاص', 'nom_fr_etat' => 'Privé', 'id_sect' => 1],
        ]);
    }
}

