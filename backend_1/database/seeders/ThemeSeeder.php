<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ThemeSeeder extends Seeder
{
    public function run()
    {
        DB::table('themes')->insert([
            [
                'titre_fr' => 'La Nouvelle Algérie et la problématique de la sécurité alimentaire et hydrique',
                'titre_ar' => 'الجزائر الجديدة وإشكالية الأمن الغذائي والمائي',
            ],
            [
                'titre_fr' => 'La Nouvelle Algérie : Renforcement des capacités et de la créativité de la jeunesse',
                'titre_ar' => 'الجزائر الجديدة: تعزيز قدرات وإبداع الشباب',
            ],
            [
                'titre_fr' => 'La sécurité énergétique et ses dimensions géopolitiques',
                'titre_ar' => 'الأمن الطاقوي وأبعاده الجيوسياسية',
            ],
        ]);
    }
}
