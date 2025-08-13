<?php
namespace App\Http\Controllers;

use App\Models\Associe;
use App\Models\Categorie;
use App\Models\CategorieEtat;
use App\Models\Dossier;
use App\Models\Etablissement;
use App\Models\Fichier;
use App\Models\Forme;
use App\Models\Occuper;
use App\Models\Personne;
use App\Models\SecteurTravail;
use App\Models\Specialite;
use App\Models\Theme;
use App\Models\Travail;
use App\Models\TypeMedia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class SoumissionController extends Controller
{
// Check if NIN exists and return person data
    // Check if NIN exists and return person data
    public function checkNin(Request $request)
    {
        $nin = $request->query('nin');

        if (! preg_match('/^[0-9]{18}$/', $nin)) {
            return response()->json([
                'exists'  => false,
                'message' => 'Format NIN invalide',
                'data'    => null,
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
                    'id_fichier'     => $fichier->id_fichier,
                    'nom_fichier_ar' => $fichier->nom_fichier_ar,
                    'nom_fichier_fr' => $fichier->nom_fichier_fr,
                    'file_path'      => $fichier->file_path,
                    'type'           => $fichier->type,
                ];
            })->toArray() : [];

            return response()->json([
                'exists'  => true,
                'message' => 'NIN existe dans la base de données',
                'data'    => [
                    'id_nin_personne'      => $person->id_nin_personne,
                    'nom_personne_fr'      => $person->nom_personne_fr,
                    'prenom_personne_fr'   => $person->prenom_personne_fr,
                    'nom_personne_ar'      => $person->nom_personne_ar,
                    'prenom_personne_ar'   => $person->prenom_personne_ar,
                    'date_naissance'       => $person->date_naissance instanceof \Carbon\Carbon  ? $person->date_naissance->format('Y-m-d') : (string) $person->date_naissance,
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

        return response()->json([
            'exists'  => false,
            'message' => 'NIN non trouvé',
            'data'    => null,
        ], 200);
    }

    // 🟢 ÉTAPE 1 - Données personnelles + création du dossier et fichiers associés
    public function storeStep1(Request $request)
    {
        // Vérifier si l'utilisateur est authentifié
        if (! Auth::check()) {
            return response()->json([
                'error' => 'Utilisateur non authentifié. Veuillez vous connecter.',
            ], 401);
        }

        $validated = $request->validate([
            'id_nin_personne'      => ['required', 'string', 'size:18', 'regex:/^[0-9]{18}$/'],
            'nom_personne_fr'      => ['required', 'string', 'max:191'],
            'prenom_personne_fr'   => ['required', 'string', 'max:191'],
            'nom_personne_ar'      => ['required', 'string', 'max:191'],
            'prenom_personne_ar'   => ['required', 'string', 'max:191'],
            'date_naissance'       => ['required', 'date'],
            'lieu_naissance_fr'    => ['required', 'string', 'max:191'],
            'lieu_naissance_ar'    => ['required', 'string', 'max:191'],
            'nationalite_fr'       => ['required', 'string', 'max:191'],
            'nationalite_ar'       => ['required', 'string', 'max:191'],
            'num_tlf_personne'     => ['required', 'string', 'size:10', 'regex:/^[0-9]{10}$/'],
            'adresse_fr'           => ['required', 'string', 'max:191'],
            'adresse_ar'           => ['required', 'string', 'max:191'],
            'sexe_personne_fr'     => ['required', 'string', 'in:Masculin,Féminin'],
            'sexe_personne_ar'     => ['required', 'string', 'in:ذكر,أنثى'],
            'groupage'             => ['required', 'string', 'in:A+,A-,B+,B-,AB+,AB-,O+,O-'],
            'id_professional_card' => ['nullable', 'string', 'max:191'],
            'fonction_fr'          => ['nullable', 'string', 'max:191'],
            'fonction_ar'          => ['nullable', 'string', 'max:191'],
            'carte_nationale'      => ['nullable', 'file', 'mimes:pdf', 'max:2048'],
            'photo'                => ['nullable', 'file', 'mimes:jpeg,png,jpg', 'max:2048'],
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
                    'statut_dossier'      => 'en_attente',
                ]);
                $validated['id_dossier'] = $dossier->id_dossier;
                $validated['id_compte']  = Auth::id();
                $person                  = Personne::create($validated);
            }

            if ($request->hasFile('carte_nationale')) {
                $file = $request->file('carte_nationale');
                $path = $file->store('carte_nationale', 'public');
                Fichier::updateOrCreate(
                    [
                        'id_dossier' => $dossier->id_dossier,
                        'type'       => 'carte_nationale',
                        'id_oeuvre'  => null,
                    ],
                    [
                        'nom_fichier_fr' => 'Carte nationale',//$file->getClientOriginalName(),
                        'nom_fichier_ar' => 'البطاقة الوطنية',//$file->getClientOriginalName(),
                        'file_path'      => $path,
                        'size'           => $file->getSize(),
                        'date_upload'    => now(),
                    ]
                );
            }

            if ($request->hasFile('photo')) {
                $file = $request->file('photo');
                $path = $file->store('photos', 'public');
                Fichier::updateOrCreate(
                    [
                        'id_dossier' => $dossier->id_dossier,
                        'type'       => 'photo',
                        'id_oeuvre'  => null,
                    ],
                    [
                        'nom_fichier_fr' => 'Photo',//$file->getClientOriginalName(),
                        'nom_fichier_ar' => 'صورة',//$file->getClientOriginalName(),
                        'file_path'      => $path,
                        'size'           => $file->getSize(),
                        'date_upload'    => now(),
                    ]
                );
            }

            DB::commit();
            return response()->json([
                'message'     => 'Étape 1 enregistrée avec succès',
                'id_personne' => $person->id_personne,
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Erreur lors de l\'enregistrement de l\'étape 1 : ' . $e->getMessage());
            return response()->json(['message' => 'Erreur lors de l\'enregistrement'], 500);
        }
    }
// Check if professional card exists and return associated data
    public function checkProfessionalCard(Request $request)
    {
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
                'message' => 'Numéro de carte professionnelle requis.',
            ], 422);
        }

        $person = Personne::where('id_professional_card', $id_professional_card)->first();

        if ($person) {
            if ($person->id_personne != $userId) {
                Log::warning('🚫 Carte professionnelle associée à un autre utilisateur', [
                    'id_personne' => $person->id_personne,
                    'userId'      => $userId,
                ]);
                return response()->json([
                    'exists' => true,
                    'error'  => 'Cette carte professionnelle appartient déjà à une autre personne.',
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

            $categorie = $secteur_travail === 'Privé' ? 'Privé' :
            ($etablissement && $etablissement->typeMedia && $etablissement->typeMedia->categorieEtat
                ? $etablissement->typeMedia->categorieEtat->nom_fr_etat ?? 'unknown'
                : 'unknown');

            if ($categorie === 'unknown' && $secteur_travail !== 'Privé') {
                Log::warning('⚠️ Catégorie non récupérée', [
                    'etablissement_id' => $etablissement ? $etablissement->id_etab : null,
                    'id_type_media'    => $etablissement ? $etablissement->id_type_media : null,
                ]);
            }

            $type_media = $secteur_travail === 'Privé' ? 'Privé' :
            ($etablissement && $etablissement->typeMedia
                ? $etablissement->typeMedia->nom_fr_type_media ?? ''
                : '');

            if ($type_media === '' && $secteur_travail !== 'Privé') {
                Log::warning('⚠️ Type média non récupéré', [
                    'etablissement_id' => $etablissement ? $etablissement->id_etab : null,
                    'id_type_media'    => $etablissement ? $etablissement->id_type_media : null,
                ]);
            }

            $specialite_name = $etablissement && $etablissement->specialite ? $etablissement->specialite->name_fr : '';

            $fichiers = $person->dossier ? Fichier::where('id_dossier', $person->id_dossier)
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
                'langue'               => $etablissement ? $etablissement->langue : null,
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
                'message' => 'Carte professionnelle trouvée pour cet utilisateur.',
                'data'    => $data,
            ], 200);
        }

        Log::info('🔎 Carte professionnelle non trouvée', ['id_professional_card' => $id_professional_card]);
        return response()->json([
            'exists'  => false,
            'message' => 'Carte professionnelle non trouvée.',
            'data'    => null,
        ], 200);
    }

    //🟢 ÉTAPE 2 - Établissement + mise à jour de la personne + attestation de travail
    public function storeStep2(Request $request)
    {
        Log::info('🟢 Début storeStep2', ['request_data' => $request->all()]);

        $rules = [
            'userId'               => 'required|exists:personnes,id_personne',
            'id_professional_card' => 'required|string|max:191',
            'num_attes'            => 'required|string|max:191',
            'fonction_fr'          => 'required|string|max:191',
            'fonction_ar'          => 'required|string|max:191',
            'secteur_travail'      => 'required|string|in:Public,Privé',
            'categorie'            => 'required_if:secteur_travail,Public|string|in:Média audio,Média écrit et électronique,Privé',
            'type_media'           => 'nullable|string|in:TV,Radio,Privé',
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

        $validator = Validator::make($request->all(), $rules, [
            'radio.in' => 'Le champ radio est invalide.',
            'tv.in'    => 'Le champ TV est invalide.',
            'media.in' => 'Le champ média est invalide.',
        ]);

        if ($validator->fails()) {
            Log::error('🚫 Erreur de validation dans storeStep2', ['errors' => $validator->errors()->toArray()]);
            return response()->json([
                'error' => $validator->errors()->first(),
            ], 422);
        }

        $validated = $validator->validated();

        if ($validated['secteur_travail'] === 'Privé' && $validated['categorie'] !== 'Privé') {
            Log::warning('🚫 Catégorie incorrecte pour secteur privé', ['categorie' => $validated['categorie']]);
            return response()->json([
                'error' => 'La catégorie doit être "Privé" pour le secteur privé.',
            ], 422);
        }

        if ($validated['secteur_travail'] === 'Public' && ! in_array($validated['categorie'], ['Média audio', 'Média écrit et électronique'])) {
            Log::warning('🚫 Catégorie incorrecte pour secteur public', ['categorie' => $validated['categorie']]);
            return response()->json([
                'error' => 'La catégorie doit être "Média audio" ou "Média écrit et électronique" pour le secteur public.',
            ], 422);
        }

        if ($validated['categorie'] === 'Média audio' && ! empty($validated['type_media']) && ! in_array($validated['type_media'], ['TV', 'Radio'])) {
            Log::warning('🚫 type_media incorrect pour Média audio', ['type_media' => $validated['type_media']]);
            return response()->json([
                'error' => 'Le type de média doit être "TV" ou "Radio" pour la catégorie "Média audio".',
            ], 422);
        }

        if ($validated['categorie'] === 'Média écrit et électronique' && ! empty($validated['media']) && ! in_array($validated['media'], ['Écrit', 'Électronique'])) {
            Log::warning('🚫 media incorrect pour Média écrit et électronique', ['media' => $validated['media']]);
            return response()->json([
                'error' => 'Le type de média doit être "Écrit" ou "Électronique" pour la catégorie "Média écrit et électronique".',
            ], 422);
        }

        if ($validated['type_media'] === 'TV' && ! empty($validated['Radio'])) {
            Log::warning('🚫 Champ radio non vide pour type_media TV', ['Radio' => $validated['Radio']]);
            return response()->json([
                'error' => 'Le champ radio doit être vide lorsque le type de média est "TV".',
            ], 422);
        }

        if ($validated['type_media'] === 'Radio' && ! empty($validated['tv'])) {
            Log::warning('🚫 Champ tv non vide pour type_media Radio', ['tv' => $validated['tv']]);
            return response()->json([
                'error' => 'Le champ TV doit être vide lorsque le type de média est "Radio".',
            ], 422);
        }

        DB::beginTransaction();
        try {
            $existingPerson = Personne::where('id_professional_card', $validated['id_professional_card'])->first();
            if ($existingPerson && $existingPerson->id_personne != $validated['userId']) {
                Log::warning('🚫 Carte professionnelle déjà utilisée', ['id_professional_card' => $validated['id_professional_card'], 'userId' => $validated['userId']]);
                return response()->json([
                    'error' => 'Cette carte professionnelle appartient déjà à une autre personne.',
                ], 422);
            }

            $secteur = SecteurTravail::firstOrCreate(['nom_fr_sect' => $validated['secteur_travail']]);
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
            if ($validated['secteur_travail'] === 'Privé') {
                $typeMedia = TypeMedia::firstOrCreate([
                    'nom_fr_type_media' => 'Privé',
                    'id_cat_etat'       => $id_cat_etat,
                ]);
                $id_type_media = $typeMedia->id_type_media;
            } elseif ($validated['categorie'] === 'Média audio' && ! empty($validated['type_media'])) {
                $typeMedia = TypeMedia::firstOrCreate([
                    'nom_fr_type_media' => $validated['type_media'],
                    'id_cat_etat'       => $id_cat_etat,
                ]);
                $id_type_media = $typeMedia->id_type_media;
            } elseif ($validated['categorie'] === 'Média écrit et électronique' && ! empty($validated['media'])) {
                $typeMedia = TypeMedia::firstOrCreate([
                    'nom_fr_type_media' => $validated['media'],
                    'id_cat_etat'       => $id_cat_etat,
                ]);
                $id_type_media = $typeMedia->id_type_media;
            }

            if ($id_type_media) {
                Log::info('✅ Type média récupéré', ['nom_fr_type_media' => $typeMedia->nom_fr_type_media, 'id_type_media' => $id_type_media]);
            } else {
                Log::warning('⚠️ Type média non défini', ['categorie' => $validated['categorie'], 'type_media' => $validated['type_media'], 'media' => $validated['media']]);
            }

            $id_specialite = null;
            if ($validated['specialite']) {
                $specialite    = Specialite::firstOrCreate(['name_fr' => $validated['specialite']]);
                $id_specialite = $specialite->id_specialite;
                Log::info('✅ Spécialité récupérée', ['name_fr' => $specialite->name_fr, 'id_specialite' => $id_specialite]);
            }

            // Récupérer la personne pour obtenir son id_dossier
            $personne = Personne::findOrFail($validated['userId']);
            if (! $personne->id_dossier) {
                Log::error('🚫 Personne sans dossier associé', ['id_personne' => $validated['userId']]);
                throw new \Exception('Aucun dossier associé à cette personne. Veuillez vérifier l\'étape 1.');
            }
            Log::info('✅ Dossier de la personne récupéré', ['id_personne' => $personne->id_personne, 'id_dossier' => $personne->id_dossier]);

            // Vérifier si un fichier d'attestation de travail est fourni
            $fichierAttestation = null;
            if ($request->hasFile('attestation_travail')) {
                $file               = $request->file('attestation_travail');
                $path               = $file->store('attestations', 'public');
                $fichierAttestation = Fichier::create([
                    'nom_fichier_fr' =>  'Attestation de travail',//$file->getClientOriginalName(),
                    'nom_fichier_ar' => 'شهادة عمل',//$file->getClientOriginalName(),
                    'file_path'      => $path,
                    'type'           => 'attestation_travail',
                    'size'           => $file->getSize(),
                    'id_dossier'     => $personne->id_dossier, // Correction : Associer au dossier de la personne
                    'date_upload'    => now(),
                ]);
                Log::info('✅ Fichier attestation créé', ['id_fichier' => $fichierAttestation->id_fichier, 'file_path' => $path]);
            } else {
                Log::warning('⚠️ Aucun fichier d\'attestation de travail fourni');
            }

            Personne::where('id_personne', $validated['userId'])->update([
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
                    'langue'        => $validated['langue'] ?? null,
                    'tv'            => $validated['type_media'] === 'TV' ? $validated['tv'] : null,
                    'radio'         => $validated['type_media'] === 'Radio' ? $validated['radio'] : null,
                    'media'         => $validated['categorie'] === 'Média écrit et électronique' ? $validated['media'] : null,
                    'id_type_media' => $id_type_media,
                    'id_specialite' => $id_specialite,
                    'updated_at'    => now(),
                ]);
                Log::info('✅ Mise à jour de Etablissement', ['id_etab' => $etablissement->id_etab]);

                // Mise à jour de Occuper uniquement avec id_fichier si un nouveau fichier est téléchargé
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
                    'tv'            => $validated['type_media'] === 'TV' ? $validated['tv'] : null,
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
            return response()->json(['message' => 'Étape 2 enregistrée avec succès'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('🚫 Erreur lors de l\'enregistrement de l\'étape 2', ['message' => $e->getMessage()]);
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
