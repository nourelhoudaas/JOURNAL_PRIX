<?php

return [
    'paths' => ['api/*', 'login', 'logout', 'register', 'profile', '/infosPerso','sanctum/csrf-cookie', 'csrf-token', 
    'soumission/*', 'form-data', 'soumission/store-step1', 'soumission/store-step2', 'soumission/store-step3', 'wilayas', 'step2'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:5173', 'http://localhost:8000'], // ← ton app React

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];
