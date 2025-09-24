<?php
namespace Database\Seeders;

use App\Models\edition;
use Illuminate\Database\Seeder;

class EditionSeeder extends Seeder
{
    public function run()
    {
        edition::insert([
            [
                'annee_edition'            => 2025,
                'num_edition'              => 'CI-2025',
                'description_edition_fr'   => 'Description de la première conférence internationale.',
                'description_edition_ar'   => 'وصف المؤتمر الدولي الأول.',
                'date_lancement_edition'   => '2025-08-15',
                'date_limite_depotDossier' => '2025-12-15',
                'statut_edition'           => 'ouverte',
            ],
        ]);
    }
}
