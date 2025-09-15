<?php
namespace App\Http\Controllers;

use App\Models\associe;
use App\Models\categorie;
use App\Models\categorieEtat;
use App\Models\Compte;
use App\Models\Contient;
use App\Models\dossier;
use App\Models\equipe;
use App\Models\Etablissement;
use App\Models\fichier;
use App\Models\forme;
use App\Models\Occuper;
use App\Models\participant;
use App\Models\participe;
use App\Models\personne;
use App\Models\peutParticipant;
use App\Models\SecteurTravail;
use App\Models\Specialite;
use App\Models\travail;
use App\Models\TypeMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class SoumissionController extends Controller
{
    // Check if NIN exists and return person data
public function checkNin(Request $request)
{
    $interfaceLocale = $request->input('locale', 'fr'); // Récupérer la langue, par défaut 'fr'
    app()->setLocale($interfaceLocale); // Définir la locale pour les traductions
    $nin = $request->query('nin');

    // Valider le format du NIN
    if (!preg_match('/^[0-9]{18}$/', $nin)) {
        return response()->json([
            'exists'  => false,
            'message' => trans('formulaire.nin_invalid'),
            'data'    => null,
        ], 422);
    }

    // Vérifier si une personne existe avec ce NIN
    $person = personne::where('id_nin_personne', $nin)
        ->with(['dossier.fichiers' => function ($query) {
            $query->select('id_fichier', 'nom_fichier_ar', 'nom_fichier_fr', 'file_path', 'type', 'id_dossier')
                ->whereIn('type', ['carte_nationale', 'photo'])
                ->whereNull('id_oeuvre');
        }])
        ->first();

    // Si la personne existe
    if ($person) {
        // Vérifier si la personne appartient à l'utilisateur authentifié
        if (Auth::check() && $person->id_compte !== Auth::id()) {
            return response()->json([
                'exists'  => true,
                'message' => trans('formulaire.nin_belongs_to_another_user'),
                'data'    => null,
            ], 403); // 403 Forbidden pour accès non autorisé
        }

        // Si la personne appartient à l'utilisateur authentifié, retourner ses données
        $fichiers = $person->dossier ? $person->dossier->fichiers->map(function ($fichier) {
            return [
                'id_fichier'     => $fichier->id_fichier,
                'nom_fichier_ar' => $fichier->nom_fichier_ar,
                'nom_fichier_fr' => $fichier->nom_fichier_fr,
                'file_path'      => $fichier->file_path,
                'type'           => $fichier->type,
            ];
        })->toArray() : [];

        return response()->json([
            'exists'  => true,
            'message' => trans('formulaire.nin_exists'),
            'data'    => [
                'id_nin_personne'      => $person->id_nin_personne,
                'nom_personne_fr'      => $person->nom_personne_fr,
                'prenom_personne_fr'   => $person->prenom_personne_fr,
                'nom_personne_ar'      => $person->nom_personne_ar,
                'prenom_personne_ar'   => $person->prenom_personne_ar,
                'date_naissance'       => $person->date_naissance instanceof \Carbon\Carbon ? $person->date_naissance->format('Y-m-d') : (string) $person->date_naissance,
                'lieu_naissance_fr'    => $person->lieu_naissance_fr,
                'lieu_naissance_ar'    => $person->lieu_naissance_ar,
                'nationalite_fr'       => $person->nationalite_fr,
                'nationalite_ar'       => $person->nationalite_ar,
                'num_tlf_personne'     => $person->num_tlf_personne,
                'adresse_fr'           => $person->adresse_fr,
                'adresse_ar'           => $person->adresse_ar,
                'sexe_personne_fr'     => $person->sexe_personne_fr,
                'sexe_personne_ar'     => $person->sexe_personne_ar,
                'groupage'             => $person->groupage,
                'id_professional_card' => $person->id_professional_card,
                'fonction_fr'          => $person->fonction_fr,
                'fonction_ar'          => $person->fonction_ar,
                'fichiers'             => $fichiers,
            ],
        ], 200);
    }

    // Si la personne n'existe pas
    return response()->json([
        'exists'  => false,
        'message' => trans('formulaire.nin_not_found'),
        'data'    => null,
    ], 200);
}

    // 🟢 ÉTAPE 1 - Données personnelles + création du dossier et fichiers associés
    public function storeStep1(Request $request)
    {
        $interfaceLocale = $request->input('locale', 'fr'); // Récupérer la langue, par défaut 'fr'
        app()->setLocale($interfaceLocale);                 // Définir la locale pour les traductions
        Log::info('🟢 Début storeStep1', ['locale' => $interfaceLocale, 'request_data' => $request->all()]);

        // Vérifier si l'utilisateur est authentifié
        if (! Auth::check()) {
            return response()->json([
                'error' => trans('formulaire.unauthenticated'),
            ], 401);
        }

        // Vérifier si la personne existe déjà pour ajuster la règle unique
        $person = personne::where('id_nin_personne', $request->input('id_nin_personne'))->first();

        // Définir les règles de validation de base
        $rules = [
            'id_nin_personne'      => [
                'required',
                'string',
                'size:18',
                'regex:/^[0-9]{18}$/',
                Rule::unique('personnes', 'id_nin_personne')->ignore($person ? $person->id_personne : null, 'id_personne'),
            ],
            'nom_personne_fr'      => ['required', 'string', 'max:191'],
            'prenom_personne_fr'   => ['required', 'string', 'max:191'],
            'nom_personne_ar'      => ['required', 'string', 'max:191'],
            'prenom_personne_ar'   => ['required', 'string', 'max:191'],
            'date_naissance'       => ['required', 'date', 'before_or_equal:today'],
            'nationalite_fr'       => ['required', 'string', 'max:191'],
            'nationalite_ar'       => ['required', 'string', 'max:191'],
            'num_tlf_personne'     => ['required', 'string', 'size:10', 'regex:/^[0-9]{10}$/'],
            'adresse_fr'           => ['required', 'string', 'max:191'],
            'adresse_ar'           => ['required', 'string', 'max:191'],
            'groupage'             => ['required', 'string', 'in:A+,A-,B+,B-,AB+,AB-,O+,O-'],
            'id_professional_card' => ['nullable', 'string', 'max:191'],
            'fonction_fr'          => ['nullable', 'string', 'max:191'],
            'fonction_ar'          => ['nullable', 'string', 'max:191'],
            'carte_nationale'      => ['nullable', 'file', 'mimes:pdf', 'max:2048'],
            'photo'                => ['nullable', 'file', 'mimes:jpeg,png,jpg', 'max:2048'],
        ];

        // Règles conditionnelles basées sur la langue
        if ($interfaceLocale === 'fr') {
            $rules['lieu_naissance_fr'] = ['required', 'string', 'max:191', 'exists:wilayas,name_fr'];
            $rules['sexe_personne_fr']  = ['required', 'string', 'in:Masculin,Féminin'];
        } elseif ($interfaceLocale === 'ar') {
            $rules['lieu_naissance_ar'] = ['required', 'string', 'max:191', 'exists:wilayas,name_ar'];
            $rules['sexe_personne_ar']  = ['required', 'string', 'in:ذكر,أنثى'];
        } else {
            // Par sécurité, si langue invalide, exiger tous les champs
            $rules['lieu_naissance_fr'] = ['required', 'string', 'max:191', 'exists:wilayas,name_fr'];
            $rules['lieu_naissance_ar'] = ['required', 'string', 'max:191', 'exists:wilayas,name_ar'];
            $rules['sexe_personne_fr']  = ['required', 'string', 'in:Masculin,Féminin'];
            $rules['sexe_personne_ar']  = ['required', 'string', 'in:ذكر,أنثى'];
        }

        // Définir les labels de traduction pour les messages d'erreur
        $customAttributes = [
            'id_nin_personne'    => trans('formulaire.id_nin_personne'),
            'nom_personne_fr'    => trans('formulaire.nom_personne_fr'),
            'prenom_personne_fr' => trans('formulaire.prenom_personne_fr'),
            'nom_personne_ar'    => trans('formulaire.nom_personne_ar'),
            'prenom_personne_ar' => trans('formulaire.prenom_personne_ar'),
            'date_naissance'     => trans('formulaire.date_naissance'),
            'lieu_naissance_fr'  => trans('formulaire.lieu_naissance_fr'),
            'lieu_naissance_ar'  => trans('formulaire.lieu_naissance_ar'),
            'nationalite_fr'     => trans('formulaire.nationalite_fr'),
            'nationalite_ar'     => trans('formulaire.nationalite_ar'),
            'num_tlf_personne'   => trans('formulaire.num_tlf_personne'),
            'adresse_fr'         => trans('formulaire.adresse_fr'),
            'adresse_ar'         => trans('formulaire.adresse_ar'),
            'sexe_personne_fr'   => trans('formulaire.sexe_personne_fr'),
            'sexe_personne_ar'   => trans('formulaire.sexe_personne_ar'),
            'groupage'           => trans('formulaire.groupage'),
            'carte_nationale'    => trans('formulaire.carte_nationale'),
            'photo'              => trans('formulaire.photo'),
        ];

        $validated = $request->validate($rules, [], $customAttributes);

        // Mapper automatiquement sexe et lieu de naissance
        $sexeMap = [
            'Masculin' => 'ذكر',
            'Féminin'  => 'أنثى',
            'ذكر'      => 'Masculin',
            'أنثى'     => 'Féminin',
        ];

        // Déduire les champs manquants en fonction de la langue
        if ($interfaceLocale === 'fr') {
            $validated['sexe_personne_ar']  = $sexeMap[$validated['sexe_personne_fr']] ?? $validated['sexe_personne_fr'];
            $wilaya                         = DB::table('wilayas')->where('name_fr', $validated['lieu_naissance_fr'])->first();
            $validated['lieu_naissance_ar'] = $wilaya ? $wilaya->name_ar : $validated['lieu_naissance_fr'];
        } elseif ($interfaceLocale === 'ar') {
            $validated['sexe_personne_fr']  = $sexeMap[$validated['sexe_personne_ar']] ?? $validated['sexe_personne_ar'];
            $wilaya                         = DB::table('wilayas')->where('name_ar', $validated['lieu_naissance_ar'])->first();
            $validated['lieu_naissance_fr'] = $wilaya ? $wilaya->name_fr : $validated['lieu_naissance_ar'];
        } else {
            if (! empty($validated['sexe_personne_fr']) && empty($validated['sexe_personne_ar'])) {
                $validated['sexe_personne_ar'] = $sexeMap[$validated['sexe_personne_fr']] ?? $validated['sexe_personne_fr'];
            } elseif (! empty($validated['sexe_personne_ar']) && empty($validated['sexe_personne_fr'])) {
                $validated['sexe_personne_fr'] = $sexeMap[$validated['sexe_personne_ar']] ?? $validated['sexe_personne_ar'];
            }
            if (! empty($validated['lieu_naissance_fr']) && empty($validated['lieu_naissance_ar'])) {
                $wilaya                         = DB::table('wilayas')->where('name_fr', $validated['lieu_naissance_fr'])->first();
                $validated['lieu_naissance_ar'] = $wilaya ? $wilaya->name_ar : $validated['lieu_naissance_fr'];
            } elseif (! empty($validated['lieu_naissance_ar']) && empty($validated['lieu_naissance_fr'])) {
                $wilaya                         = DB::table('wilayas')->where('name_ar', $validated['lieu_naissance_ar'])->first();
                $validated['lieu_naissance_fr'] = $wilaya ? $wilaya->name_fr : $validated['lieu_naissance_ar'];
            }
        }

        DB::beginTransaction();
        try {
            if ($person) {
                // Mettre à jour la personne existante
                $person->update($validated);
                $dossier = dossier::find($person->id_dossier);
                // Vérifier si une équipe existe pour cette personne
                $forme  = forme::where('id_personne', $person->id_personne)->first();
                $equipe = $forme ? equipe::where('id_equipe', $forme->id_equipe)->first() : null;
                if ($equipe) {
                    // Mettre à jour le nom de l'équipe si nécessaire
                    $equipe->update([
                        'nom_equipe_ar' => $validated['nom_personne_ar'] . ' ' . $validated['prenom_personne_ar'],
                        'nom_equipe_fr' => $validated['nom_personne_fr'] . ' ' . $validated['prenom_personne_fr'],
                    ]);
                } else {
                    // Créer une nouvelle équipe
                    $equipe = equipe::create([
                        'nom_equipe_ar' => $validated['nom_personne_ar'] . ' ' . $validated['prenom_personne_ar'],
                        'nom_equipe_fr' => $validated['nom_personne_fr'] . ' ' . $validated['prenom_personne_fr'],
                    ]);
                }
                // Vérifier si la personne est déjà dans la table forme pour cette équipe
                $formeExists = forme::where('id_personne', $person->id_personne)
                    ->where('id_equipe', $equipe->id_equipe)
                    ->exists();
                if (! $formeExists) {
                    $forme = forme::create([
                        'id_equipe'         => $equipe->id_equipe,
                        'id_personne'       => $person->id_personne,
                        'date_forme_equipe' => now(),
                        'role_personne'     => 'membre',
                        'situation'         => 'active',
                        'date_integration'  => now()->toDateString(),
                    ]);
                    Log::info('✅ Forme created', ['forme_id' => $forme->id_forme, 'id_personne' => $forme->id_personne,
                        'id_equipe'                              => $forme->id_equipe, 'situation'  => $forme->situation, 'role_personne' => $forme->role_personne,
                        'date_integration'                       => $forme->date_integration]);
                }
            } else {
                // Créer un nouveau dossier
                $dossier = dossier::create([
                    'date_create_dossier' => now(),
                    'statut_dossier'      => 'en_attente',
                ]);
                $validated['id_dossier'] = $dossier->id_dossier;
                $validated['id_compte']  = Auth::id();
                $person                  = personne::create($validated);
                // Créer une équipe pour la personne
                $equipe = equipe::create([
                    'nom_equipe_ar' => $validated['nom_personne_ar'] . ' ' . $validated['prenom_personne_ar'],
                    'nom_equipe_fr' => $validated['nom_personne_fr'] . ' ' . $validated['prenom_personne_fr'],
                ]);
                // Ajouter la personne comme membre dans la table forme
                $forme = forme::create([
                    'id_equipe'         => $equipe->id_equipe,
                    'id_personne'       => $person->id_personne,
                    'date_forme_equipe' => now(),
                    'role_personne'     => 'membre',
                    'situation'         => 'active',
                    'date_integration'  => now()->toDateString(),
                ]);

                Log::info('✅ Forme created', ['forme_id' => $forme->id_forme, 'id_personne' => $forme->id_personne,
                    'id_equipe'                              => $forme->id_equipe, 'situation'  => $forme->situation, 'role_personne' => $forme->role_personne,
                    'date_integration'                       => $forme->date_integration]);

                // Ajouter la personne à participant
                $participant = participant::create([
                    'date_debut_activité' => now()->toDateString(),
                ]);
                // Ajouter la personne à peutParticipant
                peutParticipant::create([
                    'id_personne'    => $person->id_personne,
                    'id_participant' => $participant->id_participant,
                    //'id_nin_personne' => $person->id_nin_personne,
                ]);
            }

            if ($request->hasFile('carte_nationale')) {
                $file = $request->file('carte_nationale');
                $path = $file->store('carte_nationale', 'public');
                Log::info('Fichier carte_nationale uploadé', ['path' => $path]);
                fichier::updateOrCreate(
                    [
                        'id_dossier' => $dossier->id_dossier,
                        'type'       => 'carte_nationale',
                        'id_oeuvre'  => null,
                    ],
                    [
                        'nom_fichier_fr' => trans('formulaire.carte_nationale'),
                        'nom_fichier_ar' => trans('formulaire.carte_nationale'),
                        'file_path'      => $path,
                        'size'           => $file->getSize(),
                        'date_upload'    => now(),
                    ]
                );
            }

            if ($request->hasFile('photo')) {
                $file = $request->file('photo');
                $path = $file->store('photos', 'public');
                Log::info('Fichier photo uploadé', ['path' => $path]);
                fichier::updateOrCreate(
                    [
                        'id_dossier' => $dossier->id_dossier,
                        'type'       => 'photo',
                        'id_oeuvre'  => null,
                    ],
                    [
                        'nom_fichier_fr' => trans('formulaire.photo'),
                        'nom_fichier_ar' => trans('formulaire.photo'),
                        'file_path'      => $path,
                        'size'           => $file->getSize(),
                        'date_upload'    => now(),
                    ]
                );
            }

            DB::commit();
            return response()->json([
                'message'     => trans('formulaire.step1_saved'),
                'id_personne' => $person->id_personne,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('🚫 Erreur lors de l\'enregistrement de l\'étape 1', [
                'message' => $e->getMessage(),
                'trace'   => $e->getTraceAsString(),
                'request' => $request->all(),
            ]);
            return response()->json([
                'error' => trans('error', ['message' => $e->getMessage()]),
            ], 500);
        }
    }

    // Check if professional card exists and return associated data
    public function checkProfessionalCard(Request $request)
    {
        $interfaceLocale = $request->query('locale', 'fr');
        app()->setLocale($interfaceLocale);

        // Log des paramètres reçus
        Log::info('🟢 Début checkProfessionalCard', [
            'id_professional_card' => $request->query('id_professional_card'),
            'userId'               => $request->query('userId'),
        ]);

        $id_professional_card = $request->query('id_professional_card');
        $userId               = $request->query('userId');

        if (! $id_professional_card) {
            Log::warning('🚫 id_professional_card manquant');
            return response()->json([
                'exists'  => false,
                'message' => trans('formulaire.professional_card_required'),
            ], 422);
        }

        $person = personne::where('id_professional_card', $id_professional_card)->first();

        if ($person) {
            if ($person->id_personne != $userId) {
                Log::warning('🚫 Carte professionnelle associée à un autre utilisateur', [
                    'id_personne' => $person->id_personne,
                    'userId'      => $userId,
                ]);
                return response()->json([
                    'exists' => true,
                    'error'  => trans('formulaire.professional_card_exists'),
                ], 422);
            }

            $occupation    = Occuper::where('id_personne', $person->id_personne)->first();
            $etablissement = $occupation ? Etablissement::with(['typeMedia.categorieEtat.secteur', 'specialite'])->find($occupation->id_etab) : null;

            Log::info('🔍 Données Occupation et Etablissement', [
                'occupation'    => $occupation ? $occupation->toArray() : null,
                'etablissement' => $etablissement ? $etablissement->toArray() : null,
            ]);

            $secteur_travail = $etablissement && $etablissement->typeMedia && $etablissement->typeMedia->categorieEtat && $etablissement->typeMedia->categorieEtat->secteur
                ? $etablissement->typeMedia->categorieEtat->secteur->nom_fr_sect
                : 'unknown';

            if ($secteur_travail === 'unknown') {
                Log::warning('⚠️ Secteur de travail non récupéré', [
                    'etablissement_id' => $etablissement ? $etablissement->id_etab : null,
                    'id_type_media'    => $etablissement ? $etablissement->id_type_media : null,
                ]);
            }

            $categorie = $secteur_travail === 'Privé' ? 'Privé' : ($etablissement && $etablissement->typeMedia && $etablissement->typeMedia->categorieEtat
                    ? $etablissement->typeMedia->categorieEtat->nom_fr_etat ?? 'unknown'
                    : 'unknown');

            if ($categorie === 'unknown' && $secteur_travail !== 'Privé') {
                Log::warning('⚠️ Catégorie non récupérée', [
                    'etablissement_id' => $etablissement ? $etablissement->id_etab : null,
                    'id_type_media'    => $etablissement ? $etablissement->id_type_media : null,
                ]);
            }

            $type_media = $secteur_travail === 'Privé' ? 'Privé' : ($etablissement && $etablissement->typeMedia
                    ? $etablissement->typeMedia->nom_fr_type_media ?? ''
                    : '');

            if ($type_media === '' && $secteur_travail !== 'Privé') {
                Log::warning('⚠️ Type média non récupéré', [
                    'etablissement_id' => $etablissement ? $etablissement->id_etab : null,
                    'id_type_media'    => $etablissement ? $etablissement->id_type_media : null,
                ]);
            }

            $specialite_name = $etablissement && $etablissement->specialite ? $etablissement->specialite->name_fr : '';

            $fichiers = $person->dossier ? fichier::where('id_dossier', $person->id_dossier)
                ->where('type', 'attestation_travail')
                ->whereNull('id_oeuvre')
                ->get()
                ->map(function ($fichier) {
                    return [
                        'id_fichier'     => $fichier->id_fichier,
                        'nom_fichier_ar' => $fichier->nom_fichier_ar,
                        'nom_fichier_fr' => $fichier->nom_fichier_fr,
                        'file_path'      => $fichier->file_path,
                        'type'           => $fichier->type,
                    ];
                })->toArray() : [];

            $data = [
                'id_professional_card' => $person->id_professional_card,
                'num_attes'            => $occupation ? $occupation->num_attes : '',
                'fonction_fr'          => $person->fonction_fr ?? '',
                'fonction_ar'          => $person->fonction_ar ?? '',
                'secteur_travail'      => $secteur_travail,
                'categorie'            => $categorie,
                'type_media'           => $type_media,
                'tv'                   => $etablissement ? $etablissement->tv : null,
                'radio'                => $etablissement ? $etablissement->radio : null,
                'media'                => $etablissement ? $etablissement->media : null,
                'langue'               => $etablissement ? $etablissement->langue : null, // Champ langue pour secteur privé
                'specialite'           => $specialite_name,
                'nom_etablissement'    => $etablissement ? $etablissement->nom_fr_etab : '',
                'nom_etablissement_ar' => $etablissement ? $etablissement->nom_ar_etab : '',
                'email'                => $etablissement ? $etablissement->email_etab : '',
                'tel'                  => $etablissement ? $etablissement->tel_etab : '',
                'fichiers'             => $fichiers,
            ];

            Log::info('📤 Données envoyées pour la carte professionnelle', $data);

            return response()->json([
                'exists'  => true,
                'message' => trans('formulaire.professional_card_found'),
                'data'    => $data,
            ], 200);
        }

        Log::info('🔎 Carte professionnelle non trouvée', ['id_professional_card' => $id_professional_card]);
        return response()->json([
            'exists'  => false,
            'message' => trans('formulaire.professional_card_not_found'),
            'data'    => null,
        ], 200);
    }

    //check if num_attes exists and return associated data
    public function checkNumAttes(Request $request)
    {
        Log::info('🟢 Début checkNumAttes', ['params' => $request->all()]);

        $numAttes = $request->query('num_attes');
        $locale   = $request->query('locale', 'fr');

        // Configurer la locale
        app()->setLocale($locale);

        // Log de début avec les paramètres reçus
        Log::info('🟢 checkNumAttes', [
            'num_attes' => $numAttes,
            'locale'    => $locale,
        ]);

        // Vérification que num_attes est fourni
        if (! $numAttes) {
            Log::warning('🚫 num_attes non fourni dans la requête');
            return response()->json([
                'exists' => false,
                'error'  => trans('formulaire.required', ['attribute' => trans('formulaire.num_attes')]),
            ], 422);
        }

        try {
            // Recherche dans la table occuper
            $existing = Occuper::where('num_attes', $numAttes)->first();

            // Log du résultat de la recherche
            Log::info('🔍 Résultat recherche num_attes', [
                'num_attes' => $numAttes,
                'exists'    => ! empty($existing),
            ]);

            if ($existing) {
                // Cas où num_attes existe
                Log::warning('🚫 num_attes déjà utilisé', [
                    'num_attes' => $numAttes,
                ]);
                return response()->json([
                    'exists' => true,
                    'error'  => trans('formulaire.num_attes_exists'),
                ], 422);
            }

            // Cas où num_attes n'existe pas
            Log::info('✅ num_attes non trouvé, nouveau numéro', ['num_attes' => $numAttes]);
            return response()->json([
                'exists' => false,
            ], 200);

        } catch (\Exception $e) {
            // Log de l'erreur
            Log::error('❌ Erreur lors de la vérification de num_attes', [
                'num_attes'     => $numAttes,
                'error_message' => $e->getMessage(),
                'trace'         => $e->getTraceAsString(),
            ]);
            return response()->json([
                'exists' => false,
                'error'  => trans('formulaire.error_check_num_attes'),
            ], 500);
        }
    }

    //🟢 ÉTAPE 2 - Établissement + mise à jour de la personne + attestation de travail
    public function storeStep2(Request $request)
    {
        $interfaceLocale = $request->input('locale', 'fr');
        app()->setLocale($interfaceLocale);
        Log::info('🟢 Début storeStep2', ['request_data' => $request->all()]);

        $rules = [
            'userId'               => 'required|exists:personnes,id_personne',
            'id_professional_card' => 'required|string|max:191',
            'num_attes'            => 'required|string|max:191',
            'fonction_fr'          => 'required|string|max:191',
            'fonction_ar'          => 'required|string|max:191',
            'secteur_travail'      => 'required|string|in:Public,Privé',
            'categorie'            => 'required_if:secteur_travail,Public|string|in:Média audio,Média écrit et électronique,Privé',
            'type_media'           => 'required|string|in:TV,Radio,Écrit,Électronique,Privé',
            'tv'                   => 'nullable|string|in:Régionale,Nationale',
            'radio'                => 'nullable|string|in:Publique,Locale',
            'media'                => 'nullable|string|in:Écrit,Électronique',
            'langue'               => 'nullable|string|in:Arabe,Français',
            'specialite'           => 'nullable|string|in:Culturel,Economique,Publique,Sport,Santé,Touristique,Agricole,Technologique,Automobile',
            'nom_etablissement'    => 'required|string|max:191',
            'nom_etablissement_ar' => 'required|string|max:191',
            'email'                => 'required|email|max:191',
            'tel'                  => 'required|string|regex:/^(\+?\d{8,15})$/',
            'attestation_travail'  => 'nullable|file|mimes:pdf|max:10240',
        ];

        $messages = [
            'type_media.required' => trans('formulaire.invalid_media_type'),
            'type_media.in'       => trans('formulaire.invalid_media_type'),
            'radio.in'            => trans('formulaire.invalid_radio_type'),
            'tv.in'               => trans('formulaire.invalid_tv_type'),
            'media.in'            => trans('formulaire.invalid_written_media_type'),
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            Log::error('🚫 Erreur de validation dans storeStep2', ['errors' => $validator->errors()->toArray()]);
            return response()->json([
                'error' => $validator->errors()->first(),
            ], 422);
        }

        $validated = $validator->validated();

        // Validation des règles spécifiques
        if ($validated['secteur_travail'] === 'Privé' && $validated['categorie'] !== 'Privé') {
            Log::warning('🚫 Catégorie incorrecte pour secteur privé', ['categorie' => $validated['categorie']]);
            return response()->json([
                'error' => trans('formulaire.invalid_category_private'),
            ], 422);
        }

        if ($validated['secteur_travail'] === 'Privé' && $validated['type_media'] !== 'Privé') {
            Log::warning('🚫 Type média incorrect pour secteur privé', ['type_media' => $validated['type_media']]);
            return response()->json([
                'error' => trans('formulaire.type_media_prive_invalid'),
            ], 422);
        }

        if ($validated['secteur_travail'] === 'Public' && ! in_array($validated['categorie'], ['Média audio', 'Média écrit et électronique'])) {
            Log::warning('🚫 Catégorie incorrecte pour secteur public', ['categorie' => $validated['categorie']]);
            return response()->json([
                'error' => trans('formulaire.invalid_category'),
            ], 422);
        }

        if ($validated['categorie'] === 'Média audio' && ! in_array($validated['type_media'], ['TV', 'Radio'])) {
            Log::warning('🚫 type_media incorrect pour Média audio', ['type_media' => $validated['type_media']]);
            return response()->json([
                'error' => trans('formulaire.invalid_media_type'),
            ], 422);
        }

        if ($validated['categorie'] === 'Média écrit et électronique' && ! in_array($validated['type_media'], ['Écrit', 'Électronique'])) {
            Log::warning('🚫 type_media incorrect pour Média écrit et électronique', ['type_media' => $validated['type_media']]);
            return response()->json([
                'error' => trans('formulaire.invalid_written_media_type'),
            ], 422);
        }

        if (isset($validated['type_media']) && $validated['type_media'] === 'TV' && ! empty($validated['radio'])) {
            Log::warning('🚫 Champ radio non vide pour type_media TV', ['radio' => $validated['radio']]);
            return response()->json([
                'error' => trans('formulaire.invalid_radio_type'),
            ], 422);
        }

        if (isset($validated['type_media']) && $validated['type_media'] === 'Radio' && ! empty($validated['tv'])) {
            Log::warning('🚫 Champ tv non vide pour type_media Radio', ['tv' => $validated['tv']]);
            return response()->json([
                'error' => trans('formulaire.invalid_tv_type'),
            ], 422);
        }

        DB::beginTransaction();
        try {
            $existingPerson = personne::where('id_professional_card', $validated['id_professional_card'])->first();
            if ($existingPerson && $existingPerson->id_personne != $validated['userId']) {
                Log::warning('🚫 Carte professionnelle déjà utilisée', ['id_professional_card' => $validated['id_professional_card'], 'userId' => $validated['userId']]);
                return response()->json([
                    'error' => trans('formulaire.professional_card_exists'),
                ], 422);
            }

            $secteur = secteurTravail::firstOrCreate(['nom_fr_sect' => $validated['secteur_travail']]);
            if (! $secteur->id_sect) {
                throw new \Exception('Échec de la création ou récupération du secteur.');
            }
            $id_secteur = $secteur->id_sect;
            Log::info('✅ Secteur récupéré', ['nom_fr_sect' => $secteur->nom_fr_sect, 'id_sect' => $id_secteur]);

            $categorie_etat = null;
            if ($validated['secteur_travail'] === 'Privé') {
                $categorie_etat = CategorieEtat::firstOrCreate([
                    'nom_fr_etat' => 'Privé',
                    'id_sect'     => $id_secteur,
                ]);
            } else {
                $categorie_etat = CategorieEtat::firstOrCreate([
                    'nom_fr_etat' => $validated['categorie'],
                    'id_sect'     => $id_secteur,
                ]);
            }
            if (! $categorie_etat->id_cat_etat) {
                throw new \Exception('Échec de la création ou récupération de la catégorie état.');
            }
            $id_cat_etat = $categorie_etat->id_cat_etat;
            Log::info('✅ Catégorie état récupérée', ['nom_fr_etat' => $categorie_etat->nom_fr_etat, 'id_cat_etat' => $id_cat_etat]);

            $id_type_media = null;
            $typeMedia     = TypeMedia::firstOrCreate([
                'nom_fr_type_media' => $validated['type_media'],
                'id_cat_etat'       => $id_cat_etat,
            ]);
            $id_type_media = $typeMedia->id_type_media;
            Log::info('✅ Type média récupéré', ['nom_fr_type_media' => $typeMedia->nom_fr_type_media, 'id_type_media' => $id_type_media]);

            $id_specialite = null;
            if ($validated['specialite']) {
                $specialite    = Specialite::firstOrCreate(['name_fr' => $validated['specialite']]);
                $id_specialite = $specialite->id_specialite;
                Log::info('✅ Spécialité récupérée', ['name_fr' => $specialite->name_fr, 'id_specialite' => $id_specialite]);
            }

            $personne = personne::findOrFail($validated['userId']);
            if (! $personne->id_dossier) {
                Log::error('🚫 Personne sans dossier associé', ['id_personne' => $validated['userId']]);
                throw new \Exception(trans('formulaire.error_form_data'));
            }
            Log::info('✅ Dossier de la personne récupéré', ['id_personne' => $personne->id_personne, 'id_dossier' => $personne->id_dossier]);

            $fichierAttestation = null;
            if ($request->hasFile('attestation_travail')) {
                $file               = $request->file('attestation_travail');
                $path               = $file->store('attestations', 'public');
                $fichierAttestation = fichier::create([
                    'nom_fichier_fr' => 'Attestation de travail',
                    'nom_fichier_ar' => 'شهادة عمل',
                    'file_path'      => $path,
                    'type'           => 'attestation_travail',
                    'size'           => $file->getSize(),
                    'id_dossier'     => $personne->id_dossier,
                    'date_upload'    => now(),
                ]);
                Log::info('✅ Fichier attestation créé', ['id_fichier' => $fichierAttestation->id_fichier, 'file_path' => $path]);
            } else {
                Log::warning('⚠️ Aucun fichier d\'attestation de travail fourni');
            }

            personne::where('id_personne', $validated['userId'])->update([
                'fonction_fr'          => $validated['fonction_fr'],
                'fonction_ar'          => $validated['fonction_ar'],
                'id_professional_card' => $validated['id_professional_card'],
            ]);
            Log::info('✅ Mise à jour de Personne', ['id_personne' => $validated['userId']]);

            $occuper = Occuper::where('id_personne', $validated['userId'])->first();
            if ($occuper) {
                $etablissement = Etablissement::find($occuper->id_etab);
                $etablissement->update([
                    'nom_fr_etab'   => $validated['nom_etablissement'],
                    'nom_ar_etab'   => $validated['nom_etablissement_ar'],
                    'email_etab'    => $validated['email'],
                    'tel_etab'      => $validated['tel'],
                    'langue'        => $validated['langue'] ?? null, // Champ langue pour secteur privé
                    'tv'            => $validated['type_media'] === 'TV' ? $validated['tv'] : null,
                    'radio'         => $validated['type_media'] === 'Radio' ? $validated['radio'] : null,
                    'media'         => $validated['categorie'] === 'Média écrit et électronique' ? $validated['media'] : null,
                    'id_type_media' => $id_type_media,
                    'id_specialite' => $id_specialite,
                    'updated_at'    => now(),
                ]);
                Log::info('✅ Mise à jour de Etablissement', ['id_etab' => $etablissement->id_etab]);
                $occuperData = [
                    'id_etab'     => $etablissement->id_etab,
                    'date_recrut' => now()->toDateString(),
                    'num_attes'   => $validated['num_attes'],
                    'updated_at'  => now(),
                ];
                if ($fichierAttestation) {
                    $occuperData['id_fichier'] = $fichierAttestation->id_fichier;
                }
                $occuper->update($occuperData);
                Log::info('✅ Mise à jour de Occuper', ['id_occup' => $occuper->id_occup, 'data' => $occuperData]);
            } else {
                $etablissement = Etablissement::create([
                    'nom_fr_etab'   => $validated['nom_etablissement'],
                    'nom_ar_etab'   => $validated['nom_etablissement_ar'],
                    'email_etab'    => $validated['email'],
                    'tel_etab'      => $validated['tel'],
                    'langue'        => $validated['langue'] ?? null,
                    'tv'            => $validated['type_media'] === 'TV' ? $validated['type_media'] : null,
                    'radio'         => $validated['type_media'] === 'Radio' ? $validated['radio'] : null,
                    'media'         => $validated['categorie'] === 'Média écrit et électronique' ? $validated['media'] : null,
                    'id_type_media' => $id_type_media,
                    'id_specialite' => $id_specialite,
                    'created_at'    => now(),
                    'updated_at'    => now(),
                ]);
                Log::info('✅ Création de Etablissement', ['id_etab' => $etablissement->id_etab]);
                Occuper::create([
                    'id_personne' => $validated['userId'],
                    'id_etab'     => $etablissement->id_etab,
                    'date_recrut' => now()->toDateString(),
                    'num_attes'   => $validated['num_attes'],
                    'id_fichier'  => $fichierAttestation ? $fichierAttestation->id_fichier : null,
                    'created_at'  => now(),
                    'updated_at'  => now(),
                ]);
                Log::info('✅ Création de Occuper', ['id_personne' => $validated['userId'], 'id_etab' => $etablissement->id_etab]);
            }

            DB::commit();
            Log::info('✅ Étape 2 enregistrée avec succès');
            return response()->json(['message' => trans('formulaire.step2_saved')], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('🚫 Erreur lors de l\'enregistrement de l\'étape 2', ['message' => $e->getMessage()]);
            return response()->json([
                'error' => trans('formulaire.save_error', ['message' => $e->getMessage()]),
            ], 500);
        }
    }

    // - Récupération des membres collaborateurs
    public function membreCollaborators(Request $request)
    {
        $user = Auth::user();
        if (! $user) {
            return response()->json(['error' => 'Utilisateur non authentifié.'], 401);
        }
        $compte = Compte::where('id', $user->id)->first();
        if (! $compte) {
            return response()->json(['error' => 'Compte non trouvé.'], 404);
        }
        $currentPerson = personne::where('id_compte', $compte->id_compte)->first();
        if (! $currentPerson) {
            return response()->json(['error' => 'Personne non trouvée.'], 404);
        }
        $membres = personne::whereHas('formes', function ($query) {
            $query->where('role_personne', 'membre');
            $query->where('situation', 'active');
        })
            ->where('id_personne', '!=', $currentPerson->id_personne)
            ->with(['dossier.fichiers' => function ($query) {
                $query->where('type', 'photo');
            }])
            ->get([
                'id_personne',
                'nom_personne_ar',
                'prenom_personne_ar',
                'nom_personne_fr',
                'prenom_personne_fr',
                'id_dossier',
            ]);

        // Journalisation détaillée
        \Log::info('membreCollaborators response:', [
            'count' => $membres->count(),
            'data'  => $membres->map(function ($membre) {
                return [
                    'id_personne'    => $membre->id_personne,
                    'nom'            => $membre->nom_personne_fr,
                    'id_dossier'     => $membre->id_dossier,
                    'has_dossier'    => ! is_null($membre->dossier),
                    'fichiers_count' => $membre->dossier ? $membre->dossier->fichiers->count() : 0,
                    'fichiers'       => $membre->dossier ? $membre->dossier->fichiers->toArray() : [],
                ];
            })->toArray(),
        ]);

        return response()->json($membres);
    }

    // 🟢 ÉTAPE 3 - Ajout du fichier final (document) lié au dossier
    public function storeStep3(Request $request)
    {
        $interfaceLocale = $request->input('locale', 'fr');
        app()->setLocale($interfaceLocale);
        Log::info('🟢 Début storeStep3', ['request_data' => $request->all()]);

/*if ($request->input('role') !== 'principal') {
    Log::info('Transaction validée avec 5555succès', ['id_personne' => $request->id_personne]);
    return response()->json(['message' => trans('formulaire.step3_saved')], 201);
}*/

        // Valider la catégorie
        $categorie = Categorie::find($request->input('categorie'));
        Log::info('Recherche de la catégorie', ['id_categorie' => $request->input('categorie'), 'found' => ! is_null($categorie)]);
        if (! $categorie) {
            Log::warning('Catégorie invalide', ['id_categorie' => $request->input('categorie')]);
            return response()->json(['error' => trans('formulaire.invalid_category')], 400);
        }
        $maxFiles = $categorie->nbr_max_oeuvre;
        Log::info('Validation des données d’entrée', [
            'max_files'            => $maxFiles,
            'taille_equipe'        => $request->input('taille_equipe'),
            'descriptif_oeuvre_fr' => $request->input('descriptif_oeuvre_fr'),
            'descriptif_oeuvre_ar' => $request->input('descriptif_oeuvre_ar'),
            'titre_oeuvre_fr'      => $request->input('titre_oeuvre_fr'),
            'titre_oeuvre_ar'      => $request->input('titre_oeuvre_ar'),
            'video_url'            => $request->input('video_url'),
        ]);

        // Définir les règles de validation
        $validationRules = [
            'theme'                => 'required|exists:themes,id_theme',
            'categorie'            => 'required|exists:categories,id_categorie',
            'id_personne'          => 'required|exists:personnes,id_personne',
            'role_personne'                 => 'required|string|in:principal,membre',
            'taille_equipe'        => 'required|integer|min:1|max:4',
            'files'                => [
                'array',
                'max:' . $maxFiles,
                Rule::requiredIf(function () use ($request) {
                    return $request->role_personne === 'principal' && ! $request->filled('video_url');
                }), // Requis si video_url est vide
            ],
            'files.*'              => 'file|mimes:pdf,doc,docx,mp4,avi,mov,jpeg,png,jpg|max:20480', // 20 Mo
            'collaborateurs'       => [
                'sometimes',
                'array',
                Rule::requiredIf($request->taille_equipe > 1),
                'size:' . ($request->input('taille_equipe') - 1),
            ],
            'collaborateurs.*'     => 'exists:personnes,id_personne|distinct',
            'video_url'            => [
                'nullable',
                'url',
                'max:255',
                'regex:/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/(watch\?v=|embed\/|v\/|.+\?v=)?([^&\n?#]+)/', // Validation YouTube
            ],
            'titre_oeuvre_fr'      => 'required_if:role_personne,principal|string|max:191',
            'titre_oeuvre_ar'      => 'required_if:role_personne,principal|string|max:191',
            'descriptif_oeuvre_fr' => 'required_if:role_personne,principal|string|max:5000',
            'descriptif_oeuvre_ar' => 'required_if:role_personne,principal|string|max:5000',
            'date_publication'     => 'required_if:role_personne,principal|date',
        ];

        // Messages de validation personnalisés
        $validationMessages = [
            'files.required_if'                => trans('formulaire.file_required_if_no_url'),
            'files.max'                        => trans('formulaire.max_files', ['attribute' => trans('formulaire.file'), 'max' => $maxFiles]),
            'collaborateurs.size'              => trans('formulaire.required', ['attribute' => trans('formulaire.collaborators')]) . ' (' . trans('formulaire.exact_collaborators', ['count' => $request->input('taille_equipe') - 1]) . ')',
            'titre_oeuvre_fr.required_if'      => trans('formulaire.required', ['attribute' => trans('formulaire.titre_oeuvre_fr')]),
            'titre_oeuvre_fr.max'              => trans('formulaire.max_length', ['attribute' => trans('formulaire.titre_oeuvre_fr'), 'max' => 191]),
            'titre_oeuvre_ar.required_if'      => trans('formulaire.required', ['attribute' => trans('formulaire.titre_oeuvre_ar')]),
            'titre_oeuvre_ar.max'              => trans('formulaire.max_length', ['attribute' => trans('formulaire.titre_oeuvre_ar'), 'max' => 191]),
            'descriptif_oeuvre_fr.required_if' => trans('formulaire.required', ['attribute' => trans('formulaire.descriptif_oeuvre_fr')]),
            'descriptif_oeuvre_fr.max'         => trans('formulaire.max_length', ['attribute' => trans('formulaire.descriptif_oeuvre_fr'), 'max' => 5000]),
            'descriptif_oeuvre_ar.required_if' => trans('formulaire.required', ['attribute' => trans('formulaire.descriptif_oeuvre_ar')]),
            'descriptif_oeuvre_ar.max'         => trans('formulaire.max_length', ['attribute' => trans('formulaire.descriptif_oeuvre_ar'), 'max' => 5000]),
            'video_url.regex'                  => trans('formulaire.invalid_youtube_url'),
            'date_publication.required_if'     => trans('formulaire.required', ['attribute' => trans('formulaire.date_publication')]),
        ];

        // Valider la requête
        $validated   = $request->validate($validationRules, $validationMessages);
        $id_personne = $request->id_personne;
        Log::info('Début de la transaction pour id_personne', ['id_personne' => $id_personne]);

        DB::beginTransaction();
        try {
            // Vérifier la personne et son dossier
            $personne = Personne::find($id_personne);
            Log::info('Vérification de la personne', ['id_personne' => $id_personne, 'found' => ! is_null($personne), 'has_dossier' => ! is_null($personne?->id_dossier)]);
            if (! $personne || ! $personne->id_dossier) {
                Log::warning('Personne ou dossier non trouvé', ['id_personne' => $id_personne]);
                return response()->json(['error' => trans('formulaire.person_or_dossier_not_found')], 400);
            }

            // Récupérer équipe existante et forme
            $forme = Forme::where('id_personne', $id_personne)
                ->where('situation', 'active')
                ->first();
            Log::info('Recherche de la forme active', ['id_personne' => $id_personne, 'found' => ! is_null($forme)]);
            if (! $forme) {
                Log::warning('Forme active non trouvée', ['id_personne' => $id_personne]);
                return response()->json(['error' => trans('formulaire.forme_not_found')], 400);
            }

            $equipe = Equipe::find($forme->id_equipe);
            Log::info('Recherche de l’équipe', ['id_equipe' => $forme->id_equipe, 'found' => ! is_null($equipe)]);

            // Vérifier si une œuvre a déjà été soumise pour cette équipe
            $participer = Participe::where('id_equipe', $equipe->id_equipe)->first();
            if ($participer) {
                Log::info('Cette personne a déjà soumis une œuvre avec cette équipe.', ['id_personne' => $id_personne]);
                return response()->json([
                    'error' => trans('formulaire.already_submitted', [
                        'attribute' => trans('formulaire.oeuvre'),
                    ]),
                ], 400);
            }

            // Gestion du rôle "principal"
            if ($request->role_personne === 'principal') {
                Log::info('Traitement du rôle principal', ['id_personne' => $id_personne]);

                // Si teamSize == 1 : Réaffecter anciens collaborateurs à leurs équipes individuelles
                if ($request->taille_equipe == 1) {
                    Log::info('Mise à jour de la forme pour équipe de taille 1', ['id_equipe' => $equipe->id_equipe]);
                    $forme->update([
                        'role_personne'    => $request->role_personne,
                        'date_integration' => now()->toDateString(),
                    ]);
                    Log::info('Forme mise à jour', ['id_equipe' => $equipe->id_equipe, 'role_personne' => $request->role_personne]);

                    // Si teamSize > 1 : Gérer collaborateurs
                } elseif ($request->has('collaborateurs')) {
                    Log::info('Traitement des collaborateurs', ['collaborateurs' => $request->collaborateurs]);
                    foreach ($request->collaborateurs as $collabId) {
                        $collabForme = Forme::where('id_personne', $collabId)
                            ->where('situation', 'active')
                            ->first();
                        Log::info('Recherche de la forme du collaborateur', ['id_personne' => $collabId, 'found' => ! is_null($collabForme)]);
                        $collabEquipe = Equipe::find($collabForme->id_equipe);
                        if ($collabEquipe) {
                            Log::info('Suppression de l’équipe du collaborateur', ['id_equipe' => $collabEquipe->id_equipe]);
                            $collabEquipe->delete();
                        }
                        if ($collabForme) {
                            Log::info('Mise à jour de la forme du collaborateur', ['id_personne' => $collabId, 'new_id_equipe' => $equipe->id_equipe]);
                            $collabForme->update([
                                'id_equipe'        => $equipe->id_equipe,
                                'role_personne'    => 'membre',
                                'date_integration' => now()->toDateString(),
                            ]);
                            Log::info('Forme du collaborateur mise à jour', ['id_personne' => $collabId, 'id_equipe' => $equipe->id_equipe]);
                        }
                    }
                }

                // Vérifier si au moins un fichier ou une URL vidéo est fourni
                if ($request->hasFile('files') || $request->filled('video_url')) {
                    Log::info('Traitement des fichiers uploadés ou URL vidéo', [
                        'file_count' => $request->hasFile('files') ? count($request->file('files')) : 0,
                        'video_url'  => $request->input('video_url'),
                    ]);

                    // Créer une œuvre
                    $oeuvre = travail::create([
                        'titre_oeuvre_ar'       => $request->input('titre_oeuvre_ar', 'عمل-' . now()->timestamp),
                        'titre_oeuvre_fr'       => $request->input('titre_oeuvre_fr', 'Œuvre-' . now()->timestamp),
                        'Duree_nbr_signes'      => '00:00:00', // À ajuster si nécessaire
                        'date_publication'      => $request->input('date_publication', now()->toDateString()),
                        'description_oeuvre_ar' => $request->input('descriptif_oeuvre_ar', ''),
                        'description_oeuvre_fr' => $request->input('descriptif_oeuvre_fr', ''),
                        'statut_oeuvre_ar'      => 'قيد الانتظار',
                        'statut_oeuvre_fr'      => 'En attente',
                        'valider_oeuvre'        => 'non validé',
                        'video_url'             => $request->input('video_url'), // Enregistrer l'URL vidéo (peut être null)
                        
                    ]);
                    Log::info('Œuvre créée', [
                        'id_oeuvre'             => $oeuvre->id_oeuvre,
                        'titre_oeuvre_fr'       => $oeuvre->titre_oeuvre_fr,
                        'titre_oeuvre_ar'       => $oeuvre->titre_oeuvre_ar,
                        'description_oeuvre_fr' => $oeuvre->description_oeuvre_fr,
                        'description_oeuvre_ar' => $oeuvre->description_oeuvre_ar,
                        'video_url'             => $oeuvre->video_url,
                    ]);

                    // Gérer les fichiers uploadés
                    if ($request->hasFile('files')) {
                        foreach ($request->file('files') as $index => $file) {
                            Log::info('Stockage du fichier', ['index' => $index, 'filename' => $file->getClientOriginalName()]);
                            $path = $file->store('oeuvres', 'public');
                            // Stocker fichier dans la table fichiers
                            $fichier = Fichier::create([
                                'nom_fichier_ar' => 'عمل ' . $personne->nom_personne_ar . '-' . ($index + 1),
                                'nom_fichier_fr' => 'Œuvre de ' . $personne->nom_personne_fr . '-' . ($index + 1),
                                'file_path'      => $path,
                                'type'           => $file->getClientOriginalExtension(),
                                'size'           => $file->getSize(),
                                'date_upload'    => now(),
                                'id_dossier'     => $personne->id_dossier,
                                'id_oeuvre'      => $oeuvre->id_oeuvre,
                            ]);
                            Log::info('Fichier créé', ['id_fichier' => $fichier->id_fichier, 'file_path' => $path]);
                        }
                    }

                    // Créer entrée dans Contient
                    Contient::create([
                        'id_oeuvre'    => $oeuvre->id_oeuvre,
                        'id_categorie' => $request->categorie,
                        'created_at'   => now(),
                        'updated_at'   => now(),
                    ]);
                    Log::info('Entrée créée dans Contient', ['id_oeuvre' => $oeuvre->id_oeuvre, 'id_categorie' => $request->categorie]);

                    // Créer entrée dans Associe
                    Associe::create([
                        'id_oeuvre' => $oeuvre->id_oeuvre,
                        'id_theme'  => $request->theme,
                    ]);
                    Log::info('Entrée créée dans Associe', ['id_oeuvre' => $oeuvre->id_oeuvre, 'id_theme' => $request->theme]);

                    // Créer entrée dans Participer
                    Participe::create([
                        'id_equipe'          => $equipe->id_equipe,
                        'id_oeuvre'          => $oeuvre->id_oeuvre,
                        'date_creation_oeuvre'  => now(),
                    ]);
                    Log::info('Entrée créée dans Participer', ['id_equipe' => $equipe->id_equipe, 'id_oeuvre' => $oeuvre->id_oeuvre]);
                } else {
                    Log::warning('Aucun fichier fourni et aucune URL vidéo fournie pour le rôle principal', ['id_personne' => $id_personne]);
                    return response()->json(['error' => trans('formulaire.file_required_if_no_url')], 400);
                }
            } else {
                Log::info('Rôle membre sélectionné, aucune œuvre ou fichier à enregistrer.', ['id_personne' => $id_personne]);
            }

            DB::commit();
            Log::info('Transaction validée avec succès', ['id_personne' => $id_personne]);
            return response()->json(['message' => trans('formulaire.step3_saved')], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de l\'enregistrement de l\'étape 3 : ' . $e->getMessage(), ['trace' => $e->getTraceAsString()]);
            return response()->json([
                'error' => trans('formulaire.save_error', ['message' => $e->getMessage()]),
            ], 500);
        }
    }
}
