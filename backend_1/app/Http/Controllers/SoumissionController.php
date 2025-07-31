<?php
namespace App\Http\Controllers;

use App\Models\associe;
use App\Models\Categorie;
use App\Models\Dossier;
use App\Models\Etablissement;
use App\Models\Fichier;
use App\Models\Forme;
use App\Models\Personne;
use App\Models\Theme;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SoumissionController extends Controller
{
    // 🟢 ÉTAPE 1 - Données personnelles + fichiers
    public function storeStep1(Request $request)
    {
        // Validation des données de la requête
        $validated = $request->validate([
            'id_nin_personne'   => 'required|digits:18', // Vérifie que le NIN contient exactement 18 chiffres
            'nom_fr'            => 'required|string|max:191',
            'prenom_fr'         => 'required|string|max:191',
            'nom_ar'            => 'required|string|max:191',
            'prenom_ar'         => 'required|string|max:191',
            'date_naissance'    => 'required|date',
            'lieu_naissance_fr' => 'required|string|max:191',
            'lieu_naissance_ar' => 'required|string|max:191',
            'nationalite_fr'    => 'required|string|max:191',
            'nationalite_ar'    => 'required|string|max:191',
            'num_tlf'           => 'required|string|max:191',
            'adresse_fr'        => 'required|string|max:191',
            'adresse_ar'        => 'required|string|max:191',
            'sexe_personne_fr'  => 'required|string|max:191',
            'sexe_personne_ar'  => 'required|string|max:191',
            'groupage'          => 'required|string|max:191',
            'carte_nationale'   => 'required|file|mimes:pdf|max:10240',
            'photo'             => 'required|image|max:5120',
        ]);

        // Vérification si le NIN existe déjà
        $existingPerson = Personne::where('id_nin_personne', $validated['id_nin_personne'])->first();
        if ($existingPerson) {
            return response()->json([
                'error' => 'Ce numéro d\'identification nationale est déjà enregistré.',
            ], 422);
        }

        // Vérification si la personne est un membre du jury
        $isJury = DB::table('peut-etre-juries')
            ->join('juries', 'peut-etre-juries.id_jury', '=', 'juries.id_jury')
            ->where('peut-etre-juries.id_personne', function ($query) use ($validated) {
                $query->select('id_personne')
                    ->from('personnes')
                    ->where('id_nin_personne', $validated['id_nin_personne']);
            })
            ->where('juries.date_fin_mondat', '>=', now())
            ->exists();

        if ($isJury) {
            return response()->json([
                'error' => 'Les membres du jury ne peuvent pas s\'inscrire comme participants.',
            ], 422);
        }

        // Vérification si la personne a gagné au cours des 3 dernières années
        $threeYearsAgo = now()->subYears(3)->startOfYear();
        $isWinner      = DB::table('travails')
            ->join('equipes', 'travails.id_oeuvre', '=', 'equipes.id_oeuvre')
            ->join('personnes', 'equipes.id_personne', '=', 'personnes.id_personne')
            ->where('personnes.id_nin_personne', $validated['id_nin_personne'])
            ->whereNotNull('travails.annee_gain')
            ->where('travails.annee_gain', '>=', $threeYearsAgo)
            ->exists();

        if ($isWinner) {
            return response()->json([
                'error' => 'Les gagnants des trois dernières années ne peuvent pas s\'inscrire.',
            ], 422);
        }

        DB::beginTransaction();
        try {
            // Stockage de la photo dans storage/app/public/photos
            $photoPath = $request->file('photo')->store('photos', 'public');

            // Création de la personne
            $personne = Personne::create([
                'id_nin_personne'    => $validated['id_nin_personne'],
                'nom_personne_fr'    => $validated['nom_fr'],
                'prenom_personne_fr' => $validated['prenom_fr'],
                'nom_personne_ar'    => $validated['nom_ar'],
                'prenom_personne_ar' => $validated['prenom_ar'],
                'date_naissance'     => $validated['date_naissance'],
                'lieu_naissance_fr'  => $validated['lieu_naissance_fr'],
                'lieu_naissance_ar'  => $validated['lieu_naissance_ar'],
                'nationalite_fr'     => $validated['nationalite_fr'],
                'nationalite_ar'     => $validated['nationalite_ar'],
                'num_tlf_personne'   => $validated['num_tlf'],
                'adresse_fr'         => $validated['adresse_fr'],
                'adresse_ar'         => $validated['adresse_ar'],
                'sexe_personne_fr'   => $validated['sexe_personne_fr'],
                'sexe_personne_ar'   => $validated['sexe_personne_ar'],
                'groupage'           => $validated['groupage'],
                'photo_path'         => $photoPath,
                'id_compte'          => auth()->id() ?? 1, // Valeur par défaut si non authentifié
            ]);

            // Stockage du fichier de la carte nationale dans storage/app/public/fichiers
            $cartePath = $request->file('carte_nationale')->store('fichiers', 'public');

                                                     // Utilisation du nom original du fichier ou d'une traduction en arabe
            $nomFichierAr = 'بطاقة وطنية'; // Traduction de "carte nationale" en arabe
                                                     // Alternative : utiliser le nom original du fichier
                                                     // $nomFichierAr = $request->file('carte_nationale')->getClientOriginalName();

            $fichier = Fichier::create([
                'nom_fichier_fr' => 'carte_nationale',
                'nom_fichier_ar' => $nomFichierAr,
                'type'           => 'carte_nationale',
                'file_path'      => $cartePath,
                'size'           => $request->file('carte_nationale')->getSize(),
                'date_upload'    => now(),
            ]);

            // Création du dossier
            Dossier::create([
                'id_personne'         => $personne->id_personne,
                'id_fichier'          => $fichier->id_fichier,
                'statut_dossier'      => 'En cours',
                'date_create_dossier' => now(),
            ]);

            DB::commit();
            return response()->json([
                'message'     => 'Étape 1 enregistrée avec succès',
                'id_personne' => $personne->id_personne,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erreur lors de l\'enregistrement de l\'étape 1 : ' . $e->getMessage());
            return response()->json([
                'error' => 'Erreur lors de l\'enregistrement : ' . $e->getMessage(),
            ], 500);
        }
    }

    // 🟢 ÉTAPE 2 - Établissement + mise à jour de la personne
    public function storeStep2(Request $request)
    {
        // Validation des données de la requête
        $validated = $request->validate([
            'id_personne'          => 'required|exists:personnes,id_personne', // Corrige 'personne' en 'personnes'
            'fonction_fr'          => 'required|string|max:191',
            'fonction_ar'          => 'required|string|max:191',
            'id_professional_card' => 'required|integer',
            'id_sect'              => 'required|exists:secteur_travail,id_sect',    // ID du secteur (public/privé)
            'id_cat_etat'          => 'nullable|exists:categorie_etat,id_cat_etat', // Catégorie d'état
            'id_type_media'        => 'nullable|exists:type_media,id_type_media',   // Type de média
            'id_specialite'        => 'nullable|exists:specialite,id',              // Spécialité
            'tv'                   => 'nullable|string|max:191',
            'radio'                => 'nullable|string|max:191',
            'media'                => 'nullable|string|max:191',
            'langue'               => 'nullable|string|max:191',
            'nom_fr_etab'          => 'required|string|max:191', // Nom de l'établissement en français
            'nom_ar_etab'          => 'required|string|max:191', // Nom de l'établissement en arabe
            'email_etab'           => 'required|email|max:191',
            'tel_etab'             => 'required|string|max:191',
        ]);

        DB::beginTransaction();
        try {
            // Mettre à jour la personne
            Personne::where('id_personne', $validated['id_personne'])->update([
                'fonction_fr'          => $validated['fonction_fr'],
                'fonction_ar'          => $validated['fonction_ar'],
                'id_professional_card' => $validated['id_professional_card'],
            ]);

            // Créer l’établissement
            $etablissement = Etablissement::create([
                'nom_fr_etab'   => $validated['nom_fr_etab'],
                'nom_ar_etab'   => $validated['nom_ar_etab'],
                'email_etab'    => $validated['email_etab'],
                'tel_etab'      => $validated['tel_etab'],
                'langue'        => $validated['langue'],
                'specialite'    => $validated['specialite'] ?? null, // Champ texte, non ID
                'tv'            => $validated['tv'],
                'radio'         => $validated['radio'],
                'media'         => $validated['media'],
                'id_type_media' => $validated['id_type_media'],
                'id_specialite' => $validated['id_specialite'],
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);

                                                    // Générer un num_asset unique pour la table travaille
            $numAsset = random_int(100000, 999999); // Génère un numéro unique (à ajuster selon vos besoins)
            while (Travail::where('num_asset', $numAsset)->exists()) {
                $numAsset = random_int(100000, 999999); // Vérifie l'unicité
            }

            // Créer la relation dans la table travaille
            Travaille::create([
                'id_personne' => $validated['id_personne'],
                'id_etab'     => $etablissement->id_etab,
                'date_recrut' => now()->toDateString(), // Date de recrutement (ajustable)
                'num_asset'   => $numAsset,
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);

            DB::commit();
            return response()->json([
                'message' => 'Étape 2 enregistrée avec succès',
                'id_etab' => $etablissement->id_etab,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Erreur lors de l\'enregistrement de l\'étape 2 : ' . $e->getMessage());
            return response()->json([
                'error' => 'Erreur lors de l\'enregistrement : ' . $e->getMessage(),
            ], 500);
        }
    }

    // 🟢 ÉTAPE 3 - Ajout du fichier final (document)
    public function storeStep3(Request $request)
    {
        $request->validate([
            'theme'         => 'required',
            'categorie'     => 'required',
            'id_personne'   => 'required|exists:personne,id_personne',
            'role'          => 'required|string|in:principal,collaborateur',
            'taille_equipe' => 'required|integer|min:1|max:4',
        ]);

        $id_personne = $request->id_personne;

        // Création ou récupération de l'équipe
        $equipe = \App\Models\Equipe::create([
            'nom_equipe_ar' => 'Équipe de ' . $id_personne,
            'nom_equipe_fr' => 'Équipe de ' . $id_personne,
            'id_personne'   => $id_personne,
            'id_oeuvre'     => 0, // sera mis à jour plus tard
        ]);

        // Insertion dans la table forme du participant principal
        Forme::create([
            'id_equipe'                 => $equipe->id_equipe,
            'id_personne'               => $id_personne,
            'role'                      => $request->role,
            'situation_personne_equipe' => 'active',
        ]);

        // Ajout des collaborateurs si principal
        if ($request->role === 'principal' && $request->has('collaborateurs')) {
            foreach ($request->collaborateurs as $collabId) {
                Forme::create([
                    'id_equipe'                 => $equipe->id_equipe,
                    'id_personne'               => $collabId,
                    'role'                      => 'collaborateur',
                    'situation_personne_equipe' => 'active',
                ]);
            }
        }

        // Si principal, enregistrer l’œuvre
        if ($request->role === 'principal' && $request->hasFile('file')) {
            $path = $request->file('file')->store('oeuvres', 'public');

            $oeuvre = \App\Models\travail::create([
                'titre_oeuvre' => 'Oeuvre-' . now()->timestamp,
                'fichier_path' => $path,
                'id_categorie' => $request->categorie,
                'id_theme'     => $request->theme,
                'id_edition'   => 1, // Edition actuelle à gérer
            ]);

            // Mise à jour équipe avec l’ID œuvre
            $equipe->update(['id_oeuvre' => $oeuvre->id_oeuvre]);

            // Liaison équipe/œuvre
            Associe::create([
                'id_equipe' => $equipe->id_equipe,
                'id_oeuvre' => $oeuvre->id_oeuvre,
            ]);
        }

        return response()->json(['message' => 'Soumission enregistrée avec succès']);
    }

}
