<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SpecialiteSeeder extends Seeder
{
    public function run()
    {
        DB::table('specialite')->insert([
            ['name_ar' => 'ثقافي',       'name_fr' => 'Culturel'],
            ['name_ar' => 'إقتصادي',     'name_fr' => 'Economique'],
            ['name_ar' => 'عام',         'name_fr' => 'publique'],
            ['name_ar' => 'رياضي',       'name_fr' => 'sport'],
            ['name_ar' => 'صحي',         'name_fr' => 'Santé'],
            ['name_ar' => 'سياحي',       'name_fr' => 'Touristique'],
            ['name_ar' => 'فلاحي',       'name_fr' => 'Agricole'],
            ['name_ar' => 'تكنولوجي',    'name_fr' => 'Technologique'],
            ['name_ar' => 'سيارات',      'name_fr' => 'Automobile'],
        ]);
    }
}
