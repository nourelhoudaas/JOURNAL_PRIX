<?php

namespace App\Mail;

use App\Models\User;
use App\Models\Compte;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerifyCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    public $comptee;

    public function __construct(Compte $comptee)
    {
        $this->comptee = $comptee;
    }

    public function build()
    {
        return $this->subject('Votre code de vérification')
            ->view('emails.verify-code');
    }
}

