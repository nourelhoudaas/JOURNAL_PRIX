<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

use Illuminate\Support\Facades\Auth;
use App\Models\Compte;
use App\Models\User;
use App\Models\peutJury;
class ProfileController extends Controller
{
    public function dashboard()
    {
        $user = Auth::user();
        //dd($user);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Utilisateur non authentifié.',
            ], 401);
        }
      //  $token = $user->createToken('auth_token')->plainTextToken;
        $compte = Compte::join('users', 'comptes.id', '=', 'users.id')
                ->where('users.id', $user->id)
                ->first();
                //dd($compte);
        if($compte){
            return response()->json([
                    'success' => true,
                    'message' => 'Connexion réussie.',
                    'user' => [
                        'id' => $compte->id_compte,
                        'username' => $compte->username,
                        'email' => $compte->email,
                    ],
                 //  'accessToken' => $token,
                  // 'token_type' => 'Bearer',
                ]);
        }
        else{
            return response()->json([
            'success' => false,
            'message' => 'Identifiants incorrects.',
        ], 401);
        }
    }

    //pour recuoperer les infos personnelles depuis personne 
    public function infoPerso(Request $request)
{
    $user = auth()->user();

    $compte = Compte::join('users', 'comptes.id', '=', 'users.id')
            ->join('personnes', 'comptes.id_compte', '=', 'personnes.id_compte')
            ->where('users.id', $user->id)
            ->select('personnes.*')
            ->first();

       // dd($compte);
    if ($compte) {
          //pour envoyer le lien de la photo
        $photoUrl = $compte->photo_path 
            ? url('storage/' . $compte->photo_path) 
            : null;

       // dd( $photoUrl);//lien complet storage/photo.png
        $compte->photo_url = $photoUrl;
       // dd($compte);

        // vérifier si cette personne est jury actif ou nn
        $isJury = peutJury::join('juries', 'peut-etre-juries.id_jury', '=', 'juries.id_jury')
            ->where('peut-etre-juries.id_personne', $compte->id_personne) //pour voir le compte de cette personne 
            ->whereDate('juries.date_debut_mondat', '<=', now())
            ->whereDate('juries.date_fin_mondat', '>=', now())
            ->exists(); //true or false
        //dd($isJury );
        // ajouter role dans json file
        $role = $isJury ? 'jury' : "";

        return response()->json([
            'success' => true,
            'info_perso' => $compte,
            'role' => $role,
        ]);
    } else {
        return response()->json([
            'success' => false,
            'message' => 'Aucune information trouvée.',
        ], 404);
    }
}

}