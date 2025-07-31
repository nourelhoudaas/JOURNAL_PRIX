<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */

public function run(): void
{
    // Supprimer les utilisateurs sans casser les clés étrangères
    DB::table('users')->delete();

    User::factory()->create([
        'name' => 'Test User',
        'email' => 'test@example.com',
    ]);

    $this->call([
        SecteurTravailSeeder::class,
        CategorieEtatSeeder::class,
        ThemeSeeder::class,
        SpecialiteSeeder::class,
        TypeMediaSeeder::class,
        CategorieSeeder::class,

    ]);
}

}
