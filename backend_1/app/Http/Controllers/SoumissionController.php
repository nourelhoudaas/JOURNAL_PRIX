<?php
namespace App\Http\Controllers;

use App\Models\Associe;
use App\Models\Categorie;
use App\Models\CategorieEtat;
use App\Models\Dossier;
use App\Models\Etablissement;
use App\Models\Fichier;
use App\Models\Forme;
use App\Models\participant;
use App\Models\Personne;
use App\Models\peutParticipant;
use App\Models\SecteurTravail;
use App\Models\Specialite;
use App\Models\Theme;
use App\Models\Travail;
use App\Models\TypeMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class SoumissionController extends Controller
{
// Check if NIN exists and return person data
        // Check if NIN exists and return person data
    public function checkNin(Request $request)
    {
        $nin = $request->query('nin');

        if (!preg_match('/^[0-9]{18}$/', $nin)) {
            return response()->json([
                'exists' => false,
                'message' => 'Format NIN invalide',
                'data' => null,
            ], 422);
        }

        $person = Personne::where('id_nin_personne', $nin)
            ->with(['dossier.fichiers' => function ($query) {
                $query->select('id_fichier', 'nom_fichier_ar', 'nom_fichier_fr', 'file_path', 'type', 'id_dossier')
                    ->whereIn('type', ['carte_nationale', 'photo'])
                    ->whereNull('id_oeuvre');
            }])
            ->first();

        if ($person) {
            $fichiers = $person->dossier ? $person->dossier->fichiers->map(function ($fichier) {
                return [
                    'id_fichier' => $fichier->id_fichier,
                    'nom_fichier_ar' => $fichier->nom_fichier_ar,
                    'nom_fichier_fr' => $fichier->nom_fichier_fr,
                    'file_path' => $fichier->file_path,
                    'type' => $fichier->type,
                ];
            })->toArray() : [];

            return response()->json([
                'exists' => true,
                'message' => 'NIN existe dans la base de données',
                'data' => [
                    'id_nin_personne' => $person->id_nin_personne,
                    'nom_personne_fr' => $person->nom_personne_fr,
                    'prenom_personne_fr' => $person->prenom_personne_fr,
                    'nom_personne_ar' => $person->nom_personne_ar,
                    'prenom_personne_ar' => $person->prenom_personne_ar,
                    'date_naissance' => $person->date_naissance->format('Y-m-d'),
                    'lieu_naissance_fr' => $person->lieu_naissance_fr,
                    'lieu_naissance_ar' => $person->lieu_naissance_ar,
                    'nationalite_fr' => $person->nationalite_fr,
                    'nationalite_ar' => $person->nationalite_ar,
                    'num_tlf_personne' => $person->num_tlf_personne,
                    'adresse_fr' => $person->adresse_fr,
                    'adresse_ar' => $person->adresse_ar,
                    'sexe_personne_fr' => $person->sexe_personne_fr,
                    'sexe_personne_ar' => $person->sexe_personne_ar,
                    'groupage' => $person->groupage,
                    'id_professional_card' => $person->id_professional_card,
                    'fonction_fr' => $person->fonction_fr,
                    'fonction_ar' => $person->fonction_ar,
                    'fichiers' => $fichiers,
                ],
            ], 200);
        }

        return response()->json([
            'exists' => false,
            'message' => 'NIN non trouvé',
            'data' => null,
        ], 200);
    }

    // 🟢 ÉTAPE 1 - Données personnelles + création du dossier et fichiers associés
    public function storeStep1(Request $request)
    {
        // Vérifier si l'utilisateur est authentifié
        if (!Auth::check()) {
            return response()->json([
                'error' => 'Utilisateur non authentifié. Veuillez vous connecter.',
            ], 401);
        }

        $validated = $request->validate([
            'id_nin_personne' => ['required', 'string', 'size:18', 'regex:/^[0-9]{18}$/'],
            'nom_personne_fr' => ['required', 'string', 'max:191'],
            'prenom_personne_fr' => ['required', 'string', 'max:191'],
            'nom_personne_ar' => ['required', 'string', 'max:191'],
            'prenom_personne_ar' => ['required', 'string', 'max:191'],
            'date_naissance' => ['required', 'date'],
            'lieu_naissance_fr' => ['required', 'string', 'max:191'],
            'lieu_naissance_ar' => ['required', 'string', 'max:191'],
            'nationalite_fr' => ['required', 'string', 'max:191'],
            'nationalite_ar' => ['required', 'string', 'max:191'],
            'num_tlf_personne' => ['required', 'string', 'size:10', 'regex:/^[0-9]{10}$/'],
            'adresse_fr' => ['required', 'string', 'max:191'],
            'adresse_ar' => ['required', 'string', 'max:191'],
            'sexe_personne_fr' => ['required', 'string', 'in:Masculin,Féminin'],
            'sexe_personne_ar' => ['required', 'string', 'in:ذكر,أنثى'],
            'groupage' => ['required', 'string', 'in:A+,A-,B+,B-,AB+,AB-,O+,O-'],
            'id_professional_card' => ['nullable', 'string', 'max:191'],
            'fonction_fr' => ['nullable', 'string', 'max:191'],
            'fonction_ar' => ['nullable', 'string', 'max:191'],
            'carte_nationale' => ['nullable', 'file', 'mimes:pdf', 'max:2048'],
            'photo' => ['nullable', 'file', 'mimes:jpeg,png,jpg', 'max:2048'],
        ]);

        DB::beginTransaction();
        try {
            $person = Personne::where('id_nin_personne', $validated['id_nin_personne'])->first();

            if ($person) {
                $person->update($validated);
                $dossier = Dossier::find($person->id_dossier);
            } else {
                $dossier = Dossier::create([
                    'date_create_dossier' => now(),
                    'statut_dossier' => 'en_attente',
                ]);
                $validated['id_dossier'] = $dossier->id_dossier;
                $validated['id_compte'] = Auth::id();
                $person = Personne::create($validated);
            }

            if ($request->hasFile('carte_nationale')) {
                $file = $request->file('carte_nationale');
                $path = $file->store('carte_nationale', 'public');
                Fichier::updateOrCreate(
                    [
                        'id_dossier' => $dossier->id_dossier,
                        'type' => 'carte_nationale',
                        'id_oeuvre' => null,
                    ],
                    [
                        'nom_fichier_fr' => $file->getClientOriginalName(),
                        'nom_fichier_ar' => $file->getClientOriginalName(),
                        'file_path' => $path,
                        'size' => $file->getSize(),
                        'date_upload' => now(),
                    ]
                );
            }

            if ($request->hasFile('photo')) {
                $file = $request->file('photo');
                $path = $file->store('photos', 'public');
                Fichier::updateOrCreate(
                    [
                        'id_dossier' => $dossier->id_dossier,
                        'type' => 'photo',
                        'id_oeuvre' => null,
                    ],
                    [
                        'nom_fichier_fr' => $file->getClientOriginalName(),
                        'nom_fichier_ar' => $file->getClientOriginalName(),
                        'file_path' => $path,
                        'size' => $file->getSize(),
                        'date_upload' => now(),
                    ]
                );
            }

            DB::commit();
            return response()->json(['message' => 'Étape 1 enregistrée avec succès'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de l\'enregistrement de l\'étape 1 : ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de l\'enregistrement'], 500);
        }
    }

    // 🟢 ÉTAPE 2 - Établissement + mise à jour de la personne + attestation de travail
    public function storeStep2(Request $request)
    {
        Log::info('Request data:', $request->all());

        $validated = $request->validate([
            'userId'               => 'required|exists:personnes,id_personne',
            'fonction_fr'          => 'required|string|max:191',
            'fonction_ar'          => 'required|string|max:191',
            'id_professional_card' => 'required|integer',
            'num_attes'            => ['required', 'string', 'max:191', Rule::unique('occuper', 'num_attes')],
            'attestation_travail'  => 'required|file|mimes:pdf|max:10240',
            'secteur_travail'      => 'required|string|in:public,prive',
            'categorie'            => 'nullable|string|in:media audio,media ecrit,electronique',
            'type_media'           => 'nullable|string|in:tv,radio',
            'tv'                   => 'nullable|string|in:regionale,nationale',
            'radio'                => 'nullable|string|in:publique,locale',
            'media'                => 'nullable|string|in:ecrit,electronique',
            'langue'               => 'nullable|string|in:arabe,français',
            'specialite'           => 'nullable|string|in:Culturel,Economique,publique,sport,Santé,Touristique,Agricole,Technologique,Automobile',
            'nom_etablissement'    => 'required|string|max:191',
            'nom_etablissement_ar' => 'required|string|max:191',
            'email'                => 'required|email|max:191',
            'tel'                  => 'required|string|max:191',
        ], [
            'num_attes.required'            => 'La référence de l\'attestation de travail est requise.',
            'num_attes.string'              => 'La référence de l\'attestation doit être une chaîne de caractères.',
            'num_attes.max'                 => 'La référence de l\'attestation ne doit pas dépasser 191 caractères.',
            'num_attes.unique'              => 'Cette référence d\'attestation est déjà utilisée.',
            'specialite.in'                 => 'Le champ spécialité doit être l’un des suivants : Culturel, Economique, publique, sport, Santé, Touristique, Agricole, Technologique, Automobile.',
            'nom_etablissement.required'    => 'Le nom de l\'établissement (français) est requis.',
            'nom_etablissement_ar.required' => 'Le nom de l\'établissement (arabe) est requis.',
            'email.required'                => 'L\'email de l\'établissement est requis.',
            'tel.required'                  => 'Le téléphone de l\'établissement est requis.',
            'attestation_travail.required'  => 'L\'attestation de travail est requise.',
        ]);

        Log::info('Validated data:', $validated);

        DB::beginTransaction();
        try {
            // Récupérer la personne et vérifier l'existence de l'id_dossier
            $personne = Personne::find($validated['userId']);
            if (! $personne || ! $personne->id_dossier) {
                return response()->json(['error' => 'Personne ou dossier non trouvé.'], 400);
            }

            // Récupérer id_sect
            $secteur = SecteurTravail::where('nom_fr_sect', $validated['secteur_travail'])->first();
            if (! $secteur) {
                return response()->json(['error' => 'Secteur de travail non trouvé.'], 400);
            }

            // Récupérer id_cat_etat
            $id_cat_etat = null;
            if ($validated['categorie']) {
                $categorie = CategorieEtat::where('nom_fr_etat', $validated['categorie'])
                    ->where('id_sect', $secteur->id_sect)
                    ->first();
                if (! $categorie) {
                    return response()->json(['error' => 'Catégorie non trouvée.'], 400);
                }
                $id_cat_etat = $categorie->id_cat_etat;
            }

            // Récupérer id_type_media
            $id_type_media = null;
            if ($validated['type_media']) {
                $typeMedia = TypeMedia::where('nom_fr_type_media', $validated['type_media'])
                    ->where('id_cat_etat', $id_cat_etat)
                    ->first();
                if (! $typeMedia) {
                    return response()->json(['error' => 'Type de média non trouvé.'], 400);
                }
                $id_type_media = $typeMedia->id_type_media;
            }

            // Récupérer id_specialite
            $id_specialite = null;
            if ($validated['specialite']) {
                $specialite = Specialite::where('name_fr', $validated['specialite'])->first();
                if (! $specialite) {
                    Log::error('Spécialité non trouvée dans la table specialite pour name_fr : ' . $validated['specialite']);
                    return response()->json(['error' => 'Spécialité non trouvée.'], 400);
                }
                $id_specialite = $specialite->id_specialite;
            }
//dd($id_specialite);
            // Stocker l'attestation de travail dans la table fichiers, liée au dossier de la personne
            $attestationFile = $request->file('attestation_travail');
            $pathAttestation = $attestationFile->store('attestations', 'public');

            $fichierAttestation = Fichier::create([
                'nom_fichier_ar' => 'شهادة عمل',
                'nom_fichier_fr' => 'Attestation de travail',
                'file_path'      => $pathAttestation,
                'type'           => $attestationFile->getClientOriginalExtension(),
                'size'           => $attestationFile->getSize(),
                'date_upload'    => now(),
                'id_dossier'     => $personne->id_dossier, // Lier au dossier de la personne
            ]);

            // Mettre à jour la personne
            $personne->update([
                'fonction_fr'          => $validated['fonction_fr'],
                'fonction_ar'          => $validated['fonction_ar'],
                'id_professional_card' => $validated['id_professional_card'],
            ]);

            // Créer l’établissement
            $etablissement = Etablissement::create([
                'nom_fr_etab'   => $validated['nom_etablissement'],
                'nom_ar_etab'   => $validated['nom_etablissement_ar'],
                'email_etab'    => $validated['email'],
                'tel_etab'      => $validated['tel'],
                'langue'        => $validated['langue'] ?? null,
                //'specialite' => $validated['specialite'] ?? null,
                'tv'            => $validated['tv'] ?? null,
                'radio'         => $validated['radio'] ?? null,
                'media'         => $validated['media'] ?? null,
                'id_type_media' => $id_type_media,
                'id_specialite' => $id_specialite,
                'created_at'    => now(),
                'updated_at'    => now(),
            ]);

            // Créer la relation dans la table occuper, liant l'attestation au fichier
            DB::table('occuper')->insert([
                'id_personne' => $validated['userId'],
                'id_etab'     => $etablissement->id_etab,
                'date_recrut' => now()->toDateString(),
                'num_attes'   => $validated['num_attes'],
                'id_fichier'  => $fichierAttestation->id_fichier, // Lier l'attestation à l'enregistrement occuper
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
            Log::error('Erreur lors de l\'enregistrement de l\'étape 2 : ' . $e->getMessage());
            return response()->json([
                'error' => 'Erreur lors de l\'enregistrement : ' . $e->getMessage(),
            ], 500);
        }
    }

    // 🟢 ÉTAPE 3 - Ajout du fichier final (document) lié au dossier
    public function storeStep3(Request $request)
    {
        $validated = $request->validate([
            'theme'            => 'required|exists:themes,id_theme',
            'categorie'        => 'required|exists:categories,id_categorie',
            'id_personne'      => 'required|exists:personnes,id_personne',
            'role'             => 'required|string|in:principal,membre',
            'taille_equipe'    => 'required|integer|min:1|max:4',
            'file'             => 'required_if:role,principal|file|mimes:pdf,doc,docx,mp4,avi,mov,jpeg,png,jpg|max:20480',
            'collaborateurs'   => 'sometimes|array|max:3',
            'collaborateurs.*' => 'exists:personnes,id_personne',
        ]);

        $id_personne = $request->id_personne;

        DB::beginTransaction();
        try {
            // Récupérer la personne et vérifier l'existence de l'id_dossier
            $personne = Personne::find($id_personne);
            if (! $personne || ! $personne->id_dossier) {
                return response()->json(['error' => 'Personne ou dossier non trouvé.'], 400);
            }

            // Création ou récupération de l'équipe
            $equipe = \App\Models\Equipe::create([
                'nom_equipe_ar' => 'فريق ' . $personne->nom_personne_ar,
                'nom_equipe_fr' => 'Équipe de ' . $personne->nom_personne_fr,
                'id_personne'   => $id_personne,
                'id_oeuvre'     => 0, // sera mis à jour plus tard
            ]);

            // Insertion dans la table forme du participant
            Forme::create([
                'id_equipe'        => $equipe->id_equipe,
                'id_personne'      => $id_personne,
                'role'             => $request->role,
                'date_integration' => now()->toDateString(),
            ]);

            // Ajout des collaborateurs si principal
            if ($request->role === 'principal' && $request->has('collaborateurs')) {
                foreach ($request->collaborateurs as $collabId) {
                    Forme::create([
                        'id_equipe'        => $equipe->id_equipe,
                        'id_personne'      => $collabId,
                        'role'             => 'membre',
                        'date_integration' => now()->toDateString(),
                    ]);
                }
            }

            // Si principal, enregistrer l’œuvre et la lier au dossier
            if ($request->role === 'principal' && $request->hasFile('file')) {
                $file = $request->file('file');
                $path = $file->store('oeuvres', 'public');

                // Stocker le fichier dans la table fichiers, lié au dossier
                $fichier = Fichier::create([
                    'nom_fichier_ar' => 'عمل ' . $personne->nom_personne_ar,
                    'nom_fichier_fr' => 'Œuvre de ' . $personne->nom_personne_fr,
                    'file_path'      => $path,
                    'type'           => $file->getClientOriginalExtension(),
                    'size'           => $file->getSize(),
                    'date_upload'    => now(),
                    'id_dossier'     => $personne->id_dossier, // Lier au dossier de la personne
                ]);

                $oeuvre = Travail::create([
                    'titre_oeuvre_ar'       => 'عمل-' . now()->timestamp,
                    'titre_oeuvre_fr'       => 'Œuvre-' . now()->timestamp,
                    'Duree_nbr_signes'      => '00:00:00', // À ajuster si nécessaire
                    'date_publication'      => now()->toDateString(),
                    'description_oeuvre_ar' => 'وصف العمل',        // À ajuster si nécessaire
                    'description_oeuvre_fr' => 'Description de l\'œuvre', // À ajuster si nécessaire
                    'statut_oeuvre_ar'      => 'قيد الانتظار',
                    'statut_oeuvre_fr'      => 'En attente',
                    'valider_oeuvre'        => 'non validé',
                    'date_creation_oeuvre'  => now(),
                    'id_fichier'            => $fichier->id_fichier, // Lier l'œuvre au fichier
                ]);

                // Mise à jour équipe avec l’ID œuvre
                $equipe->update(['id_oeuvre' => $oeuvre->id_oeuvre]);

                // Liaison œuvre/catégorie
                \App\Models\Contient::create([
                    'id_oeuvre'    => $oeuvre->id_oeuvre,
                    'id_categorie' => $request->categorie,
                ]);

                // Liaison œuvre/thème
                Associe::create([
                    'id_oeuvre' => $oeuvre->id_oeuvre,
                    'id_theme'  => $request->theme,
                ]);
            }

            DB::commit();
            return response()->json(['message' => 'Soumission enregistrée avec succès'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de l\'enregistrement de l\'étape 3 : ' . $e->getMessage());
            return response()->json([
                'error' => 'Erreur lors de l\'enregistrement : ' . $e->getMessage(),
            ], 500);
        }
    }
}
