<?php

use App\Models\categories;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GoogleController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SoumissionController;
use App\Http\Controllers\VerificationController;
use App\Models\Theme;
use App\Models\Wilaya;
use App\Models\Specialite;
use App\Models\SecteurTravail;



// ✅ Page d’accueil personnalisée
Route::get('/', function () {
    return view('home');
});

// ✅ Redirection vers interface React authentifiée
Route::get('/dashboard', function () {
    return redirect('http://localhost:3003/profile');
})->middleware(['auth'])->name('dashboard');

// ✅ Redirection vers la page de soumission (React)
Route::get('/soumission', function () {
    return redirect('http://localhost:5173/');
})->middleware(['auth'])->name('soumission');

// ✅ Authentification via Google
Route::get('/login/google', [GoogleController::class, 'redirectToGoogle'])->name('login.google');
Route::get('/login/google/callback', [GoogleController::class, 'handleGoogleCallback']);

// ✅ Vérification du code reçu par email
Route::get('/verify-code', [VerificationController::class, 'show'])->name('verify.code.form');
Route::post('/verify-code', [VerificationController::class, 'verify'])->name('verify.code.submit');

// ✅ Récupération du token CSRF (pour React)
Route::get('/csrf-token', fn() => response()->json([
    'csrf_token' => csrf_token()
]));

// ✅ Profil (API sécurisée)
Route::middleware('auth:sanctum')->get('/profile', [ProfileController::class, 'dashboard']);
Route::middleware('auth:sanctum')->get('/infosPerso', [ProfileController::class, 'infoPerso']);//ssssssss



// ✅ Check NIN (accessible sans authentification)
Route::get('/check-nin', [SoumissionController::class, 'checkNin'])->middleware('throttle:60,1'); //Cela limiterait les requêtes à 60 par minute par IP.

// ✅ Check Id Pro (accessible sans authentification)
Route::get('/check-professional-card', [SoumissionController::class, 'checkProfessionalCard'])->middleware('throttle:60,1'); //Cela limiterait les requêtes à 60 par minute par IP.

// ✅ Step 1 : enregistrement des infos personnelles
Route::middleware('auth:sanctum')->post('/soumission/step1', [SoumissionController::class, 'storeStep1']);

// ✅ Step 2 : enregistrement des infos de compte / établissement
Route::middleware('auth:sanctum')->post('/soumission/step2', [SoumissionController::class, 'storeStep2']);

// ✅ Step 3 : enregistrement de la confirmation / finalisation
Route::middleware('auth:sanctum')->post('/soumission/step3', [SoumissionController::class, 'storeStep3']);

//Route::post('/soumission/store-step1', [SoumissionController::class, 'storeStep1']);

// ✅ Récupération des données pour le formulaire (thèmes, catégories, userId)
Route::get('/form-data', function () {
    return response()->json([
        'themes' => Theme::all(),
        'categories' => categories::all(),
        'userId' => auth()->id(),
    ]);
});

// ✅ Récupération des wilayas

Route::get('/wilayas', function () {
    $wilayas = Wilaya::all(['id', 'name_fr', 'name_ar']);
    return response()->json($wilayas);
});

/*Route::get('/step3', function () {
    $secteurs = SecteurTravail::all()->map(function ($secteur) {
        return [
            'value' => strtolower($secteur->nom_fr_sect), // ex: 'privé', 'public'
            'label_fr' => $secteur->nom_fr_sect, // ex: 'Privé', 'Public'
            'label_ar' => $secteur->nom_ar_sect, // ex: 'خاص', 'عام'
        ];
    })->toArray();

    $categories = categories::all()->map(function ($categorie) {
        return [
            'value' => strtolower($categorie->nom_categorie_fr), // ex: 'presse écrite'
            'label_fr' => $categorie->nom_categorie_fr, // ex: 'Presse écrite'
            'label_ar' => $categorie->nom_categorie_ar, // ex: 'الصحافة المكتوبة'
        ];
    })->toArray();

    $specialites = Specialite::all()->map(function ($specialite) {
        return [
            'value' => $specialite->name_fr, // ex: 'Culturel'
            'label_fr' => $specialite->name_fr, // ex: 'Culturel'
            'label_ar' => $specialite->name_ar, // ex: 'ثقافي'
        ];
    })->toArray();
    return response()->json([
        'secteurs' => $secteurs,
        'categories' => $categories,
        'specialites' => $specialites
    ]);
});*/