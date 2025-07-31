<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SpecialiteSeeder extends Seeder
{
    public function run()
    {
        DB::table('specialite')->insert([
            ['name_ar' => 'عامة', 'name_fr' => 'Générales'],
            ['name_ar' => 'إخبارية', 'name_fr' => 'Informations'],
            ['name_ar' => 'دينية', 'name_fr' => 'Religieuses'],
            ['name_ar' => 'رياضية', 'name_fr' => 'Sportives'],
            ['name_ar' => 'نسائية', 'name_fr' => 'Féminines'],
            ['name_ar' => 'أطفال', 'name_fr' => 'Enfants'],
            ['name_ar' => 'اقتصادية', 'name_fr' => 'Économiques'],
        ]);
    }
}
