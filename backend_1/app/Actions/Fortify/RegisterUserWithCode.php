<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use App\Mail\VerifyCodeMail;
use App\Models\Compte;

class RegisterUserWithCode implements CreatesNewUsers
{
    public function create(array $input)
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ])->validate();

        $code = rand(100000, 999999);
       $passwrd =Hash::make($input['password']);
        $user = User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => $passwrd,
          //  'verification_code' => $code,
            //'email_verified_at' => null,
        ]);
        if($user){
           $comptee= Compte::create([
            'username' => $input['name'],
            'email' => $input['email'],
            'mot_passe_hash' => $passwrd,
            'email_verification_code'=>$code,
            'statut_email'=>'en attente',
            'date_creation_cmpt'=>now(),
            'code_forget_pass_generate'=>rand(100000, 999999),
            'id'=>$user->id,
           // 'verification_code' => $code,
        ]);
    }

        Mail::to($user->email)->send(new VerifyCodeMail($comptee));
        Session::put('user_id_pending_verification', $user->id);
    
        throw ValidationException::withMessages([
            'email' => ['Un code vous a été envoyé. Veuillez vérifier votre boîte mail.'],
        ])->redirectTo(route('verify.code.form'));
    }
}
