<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategorieSeeder extends Seeder
{
    public function run()
    {
        DB::table('categories')->insert([
            [
                'nom_categorie_ar' => 'الصحافة المكتوبة',
                'nom_categorie_fr' => 'Presse écrite',
                'description_cat_ar' => 'مقال تحليلي، تحقيق، أو روبورتاج في الصحافة المكتوبة',
                'description_cat_fr' => 'Article de fond, enquête ou reportage dans la presse écrite',
                'nbr_max_oeuvre' => 1
            ],
            [
                'nom_categorie_ar' => 'الإعلام التلفزيوني',
                'nom_categorie_fr' => 'Information télévisuelle',
                'description_cat_ar' => 'روبورتاج، تحقيق أو وثائقي تلفزيوني',
                'description_cat_fr' => 'Reportage, enquête ou documentaire télévisé',
                'nbr_max_oeuvre' => 1
            ],
            [
                'nom_categorie_ar' => 'الإعلام الإذاعي',
                'nom_categorie_fr' => 'Information radiophonique',
                'description_cat_ar' => 'روبورتاج أو تحقيق إذاعي',
                'description_cat_fr' => 'Reportage ou enquête radiophonique',
                'nbr_max_oeuvre' => 1
            ],
            [
                'nom_categorie_ar' => 'الصحافة الإلكترونية',
                'nom_categorie_fr' => 'Presse électronique',
                'description_cat_ar' => 'عمل إعلامي منشور على الإنترنت',
                'description_cat_fr' => 'Œuvre d’information diffusée sur le net',
                'nbr_max_oeuvre' => 1
            ],
            [
                'nom_categorie_ar' => 'الرسومات التوضيحية',
                'nom_categorie_fr' => 'Illustration',
                'description_cat_ar' => 'صورة، رسم أو كاريكاتير صحفي',
                'description_cat_fr' => 'Photographie, dessin ou caricature de presse',
                'nbr_max_oeuvre' => 10
            ],
        ]);
    }
}
