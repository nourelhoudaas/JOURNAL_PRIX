<?php

return [
    'paths'                    => ['api/*', 'login', 'logout', 'register', 'profile', '/infosPerso', 'sanctum/csrf-cookie', 'csrf-token',
                                     'soumission/*', 'form-data', 'soumission/step1',
                                      'soumission/step2', 'soumission/step3', 
                                      'wilayas', 'check-nin', 'check-professional-card'],

    'allowed_methods'          => ['*'],

    'allowed_origins'          => ['http://localhost:5173', 'http://localhost:8000'], // ← ton app React

    'allowed_origins_patterns' => [],

    'allowed_headers'          => ['*'],

    'exposed_headers'          => [],

    'max_age'                  => 0,

    'supports_credentials'     => true,
];
