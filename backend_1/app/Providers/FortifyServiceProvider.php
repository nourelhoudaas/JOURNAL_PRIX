<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Laravel\Fortify\Fortify;
use Illuminate\Http\Request;
use Laravel\Fortify\Contracts\LoginViewResponse;
use Laravel\Fortify\Contracts\RegisterViewResponse;
use Laravel\Fortify\Contracts\ForgotPasswordViewResponse;
use Laravel\Fortify\Contracts\ResetPasswordViewResponse;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Cache\RateLimiting\Limit;
use Laravel\Fortify\Contracts\RequestPasswordResetLinkViewResponse;
use App\Actions\Fortify\ResetUserPassword;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Mail\VerifyCodeMail;





class FortifyServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        // ✅ Définir le rate limiter pour login
        RateLimiter::for('login', function (Request $request) {
            return Limit::perMinute(5)->by($request->email . $request->ip());
        });
        // 🔐 Vues Blade personnalisées
        $this->app->singleton(RegisterViewResponse::class, function () {
            return new class implements RegisterViewResponse {
                public function toResponse($request)
                {
                    return view('auth.register');
                }

            };
        });

        $this->app->singleton(LoginViewResponse::class, function () {
            return new class implements LoginViewResponse {
                public function toResponse($request)
                {
                    return view('auth.login');
                }
            };
        });

        $this->app->singleton(ForgotPasswordViewResponse::class, function () {
            return new class implements ForgotPasswordViewResponse {
                public function toResponse($request)
                {
                    return view('auth.forgot-password');
                }
            };
        });

        $this->app->singleton(ResetPasswordViewResponse::class, function () {
            return new class implements ResetPasswordViewResponse {
                public function toResponse($request)
                {
                    return view('auth.reset-password', ['request' => $request]);
                }
            };
        });
        $this->app->singleton(RequestPasswordResetLinkViewResponse::class, function () {
    return new class implements RequestPasswordResetLinkViewResponse {
        public function toResponse($request)
        {
            return view('auth.forgot-password');
        }
    };
});

        // ⚙️ Exemple d'action
      //  Fortify::createUsersUsing(\App\Actions\Fortify\CreateNewUser::class);

      
        Fortify::createUsersUsing(\App\Actions\Fortify\RegisterUserWithCode::class);

        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
                 


    }
}
