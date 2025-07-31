<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TypeMedia;
use App\Models\CategorieEtat;

class TypeMediaSeeder extends Seeder
{
    public function run()
    {
        // Récupération des catégories
        $audio = CategorieEtat::where('nom_fr_etat', 'Média audio')->first();
        $ecritElectronique = CategorieEtat::where('nom_fr_etat', 'Média écrit et électronique')->first();
        $prive = CategorieEtat::where('nom_fr_etat', 'Privé')->first();

        // Vérification que les catégories existent
        if (!$audio || !$ecritElectronique || !$prive) {
            $this->command->error("Une ou plusieurs catégories sont manquantes.");
            return;
        }

        TypeMedia::insert([
            // Média audio : TV, Radio
            [
                'nom_ar_type_media' => 'تلفزيون',
                'nom_fr_type_media' => 'TV',
                'id_cat_etat' => $audio->id_cat_etat,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom_ar_type_media' => 'راديو',
                'nom_fr_type_media' => 'Radio',
                'id_cat_etat' => $audio->id_cat_etat,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Média écrit et électronique : Écrit, Électronique
            [
                'nom_ar_type_media' => 'مكتوب',
                'nom_fr_type_media' => 'Écrit',
                'id_cat_etat' => $ecritElectronique->id_cat_etat,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nom_ar_type_media' => 'إلكتروني',
                'nom_fr_type_media' => 'Électronique',
                'id_cat_etat' => $ecritElectronique->id_cat_etat,
                'created_at' => now(),
                'updated_at' => now(),
            ],

            // Privé : Privé
            [
                'nom_ar_type_media' => 'خاص',
                'nom_fr_type_media' => 'Privé',
                'id_cat_etat' => $prive->id_cat_etat,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
