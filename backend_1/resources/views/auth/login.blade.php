@extends('layouts.guest')

@section('content')
<div class="bg-white rounded-2xl shadow-lg flex w-full max-w-4xl overflow-hidden">
    <div class="w-1/2 p-10 flex flex-col justify-center">
        <h2 class="text-3xl font-bold text-gray-800 mb-2">Login</h2>
        <p class="text-sm text-gray-500 mb-6">If you have an account, please login</p>

        <form method="POST" action="{{ route('login') }}" class="space-y-4">
            @csrf
            <div>
                <input type="email" name="email" required autofocus placeholder="Enter Email Address"
                    class="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
            </div>
            <div>
                <input type="password" name="password" required placeholder="Enter Password"
                    class="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
            </div>
            <div class="flex justify-end text-sm">
                <a href="{{ route('password.request') }}" class="text-blue-500 hover:underline">Forgot Password?</a>
            </div>

            <button type="submit"
                class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">
                Log In
            </button>
        </form>

        <div class="flex items-center my-6">
            <hr class="flex-grow border-gray-300">
            <span class="mx-4 text-gray-400">OR</span>
            <hr class="flex-grow border-gray-300">
        </div>

       
        <a href="{{ route('login.google') }}"
   class="w-full flex items-center justify-center border border-gray-300 rounded-md py-2 text-gray-700 hover:bg-gray-100 transition duration-200">
    <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-5 h-5 mr-2">
    Login with Google
</a>

        <p class="text-sm text-center text-gray-500 mt-6">
            If you don't have an account...
            <a href="{{ route('register') }}" class="ml-1 text-blue-500 hover:underline">Register</a>
        </p>
    </div>

    <div class="w-1/2 hidden md:block">
        <img src="{{ asset('images/background.jpeg') }}" alt="Login image" class="object-cover h-full w-full rounded-r-2xl">
    </div>
</div>
@endsection
