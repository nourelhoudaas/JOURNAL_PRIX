<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use Illuminate\Support\Facades\Auth;
use App\Models\Compte;
use App\Models\User;
use Illuminate\Support\Facades\Session;

class VerificationController extends Controller
{
    public function show()
{
    return view('auth.verify-code');
}

public function verify(Request $request)
{
    
    $request->validate([
        'code' => ['required', 'numeric'],
    ]);
    $userId = Session::get('user_id_pending_verification');
    //dd($userId);
      if (!$userId) {
        return redirect('/login')->withErrors(['error' => 'Session expirée, veuillez recommencer.']);
    }
  
    $compte= Compte::join('users','comptes.id','=','users.id')->where('users.id',    $userId)->first();
    //dd(  $compte);

    if ($compte->email_verification_code == $request->code) {
        $compte->date_verification_email = now();
        $compte->statut_email = 'verifié';
        $compte->save();

        return redirect('/dashboard')->with('success', 'Votre compte a été vérifié.');
    }

    return back()->withErrors(['code' => 'Code incorrect.']);
}
}
