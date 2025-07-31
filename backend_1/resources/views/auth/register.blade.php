@extends('layouts.guest')

@section('content')
<div class="bg-white rounded-2xl shadow-lg flex w-full max-w-4xl overflow-hidden">
    <div class="w-1/2 p-10 flex flex-col justify-center">
        <h2 class="text-3xl font-bold text-gray-800 mb-2">S'enregistrer</h2>
        <p class="text-sm text-gray-500 mb-6">Créer votre compte</p>
        @if ($errors->any())
    <div class="bg-red-100 text-red-700 p-3 rounded mb-4">
        <ul class="list-disc pl-5 text-sm">
            @foreach ($errors->all() as $error)
                <li>{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

        <form method="POST" action="{{ route('register') }}" class="space-y-4">
            @csrf

            <div>
                <input type="text" name="name" required autofocus placeholder="Enter Votre Nom"
                    class="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
            </div>

            <div>
                <input type="email" name="email" required placeholder="Enter Votre Addresse Mail"
                    class="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
            </div>

            <div>
                <input type="password" name="password" required placeholder="Enter Votre Mot de Passe"
                    class="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
            </div>

            <div>
                <input type="password" name="password_confirmation" required placeholder="Confirmer Votre Mot de Passe"
                    class="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
            </div>

            <button type="submit"
                class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">
                Enregistrer
            </button>
        </form>

        <p class="text-sm text-center text-gray-500 mt-6">
            Vous avez deja un compte?
            <a href="{{ route('login') }}" class="ml-1 text-blue-500 hover:underline">Login</a>
        </p>
    </div>

    <div class="w-1/2 hidden md:block">
        <img src="{{ asset('images/background.jpeg') }}" alt="Register image" class="object-cover h-full w-full rounded-r-2xl">
    </div>
</div>
@endsection
