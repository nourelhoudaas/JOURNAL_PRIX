<?php
namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */

    public function run(): void
    {
        // Supprimer les utilisateurs (si nécessaire)
        DB::table('users')->delete();
        DB::table('comptes')->delete(); // Supprime aussi les comptes pour éviter les doublons

       /* // Créer un utilisateur administrateur
        $user = User::create([
            'name'              => 'Admin',
            'email'             => 'sayahhouda06@gmail.com',
            'password'          => bcrypt('11111111'),
            'email_verified_at' => now(),
        ]);
// Créer un utilisateur
        $user2 = User::create([
            'name'              => 'Admin2',
            'email'             => 'sayahhouda@outlook.fr',
            'password'          => bcrypt('11111111'),
            'email_verified_at' => now(),
        ]);

        // Créer un compte lié à l'utilisateur
        DB::table('comptes')->insert([
            'username'                  => 'Admin',
            'email'                     => 'sayahhouda06@gmail.com',
            'mot_passe_hash'            => bcrypt('11111111'),
            'email_verification_code'   => 'ABC123',  // à personnaliser
            'statut_email'              => 'verifie', // ou 'non_verifie'
            'code_forget_pass_generate' => '',
            'date_creation_cmpt'        => Carbon::now(),
            'date_update_cmpt'          => null,
            'date_verification_email'   => Carbon::now(),
            'id'                        => $user->id, // correspond à la clé étrangère vers `users1`
        ]);

         // Créer un compte lié à l'utilisateur
        DB::table('comptes')->insert([
            'username'                  => 'Admin2',
            'email'                     => 'sayahhouda@outlook.fr',
            'mot_passe_hash'            => bcrypt('11111111'),
            'email_verification_code'   => 'ABC1234',  // à personnaliser
            'statut_email'              => 'verifie', // ou 'non_verifie'
            'code_forget_pass_generate' => '',
            'date_creation_cmpt'        => Carbon::now(),
            'date_update_cmpt'          => null,
            'date_verification_email'   => Carbon::now(),
            'id'                        => $user2->id, // correspond à la clé étrangère vers `users2`
        ]);
*/
        // Appeler les autres seeders
        $this->call([
            SecteurTravailSeeder::class,
            CategorieEtatSeeder::class,
            ThemeSeeder::class,
            SpecialiteSeeder::class,
            TypeMediaSeeder::class,
            CategorieSeeder::class,
            EditionSeeder::class,
            WilayaSeeder::class,
        ]);
    }

}
