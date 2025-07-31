<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as Middleware;
use Closure;

class VerifyCsrfToken extends Middleware
{
    /**
     * Log pour vérifier que le middleware est exécuté.
     */
    public function handle($request, Closure $next)
    {
        \Log::info('🚧 Middleware CSRF exécuté');
        return parent::handle($request, $next);
    }

    /**
     * Ajouter le cookie CSRF automatiquement à la réponse.
     *
     * @var bool
     */
    protected $addHttpCookie = true;

    /**
     * Les URI qui doivent être exclues de la vérification CSRF.
     *
     * @var array<int, string>
     */
    protected $except = [];

}
