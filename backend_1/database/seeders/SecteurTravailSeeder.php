<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SecteurTravail;

class SecteurTravailSeeder extends Seeder
{
    public function run()
    {
        SecteurTravail::insert([
            ['nom_ar_sect' => 'خاص', 'nom_fr_sect' => 'Privé'],
            ['nom_ar_sect' => 'عام', 'nom_fr_sect' => 'Public']
        ]);
    }
}

