<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;
use Illuminate\Support\Facades\Mail;
use App\Mail\SendVerificationCode;
use App\Models\Compte;
class CreateNewUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required','string','email','max:255',
            Rule::unique(User::class),],
            'password' => $this->passwordRules(),
        ])->validate();
        $code = rand(100000, 999999);

        $usercreat= User::create([
            'name' => $input['name'],
            'email' => $input['email'],
            'password' => Hash::make($input['password']),
           // 'verification_code' => $code,
        ]);
        if($usercreat){
            return  Compte::create([
            'username' => $input['name'],
            'email' => $input['email'],
            'mot_passe_hash' => Hash::make($input['password']),
            'email_verification_code'=>$code,
            'statut_email'=>'en attente',
            'date_creation_cmpt'=>now(),
            'code_forget_pass_generate'=>rand(100000, 999999),
            'id'=>$usercreat->id,
           // 'verification_code' => $code,
        ]);
        Mail::to($user->email)->send(new SendVerificationCode($user));

        }
        
        
        return $usercreat;
    }
}
