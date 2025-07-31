@extends('layouts.guest')

@section('content')
<div class="bg-white rounded-2xl shadow-lg flex w-full max-w-4xl overflow-hidden">
    <div class="w-1/2 p-10 flex flex-col justify-center">
        <h2 class="text-3xl font-bold text-gray-800 mb-2">Reset Password</h2>
        <p class="text-sm text-gray-500 mb-6">
            Enter your email and a new password to reset your account.
        </p>

        <form method="POST" action="{{ route('password.update') }}" class="space-y-4">
            @csrf

            <input type="hidden" name="token" value="{{ request()->route('token') }}">

            <div>
                <input type="email" name="email" required autofocus placeholder="Enter Email Address"
                    class="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value="{{ old('email') }}">
            </div>

            <div>
                <input type="password" name="password" required placeholder="Enter New Password"
                    class="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
            </div>

            <div>
                <input type="password" name="password_confirmation" required placeholder="Confirm New Password"
                    class="w-full px-4 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400">
            </div>

            <button type="submit"
                class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-300">
                Reset Password
            </button>
        </form>

        <p class="text-sm text-center text-gray-500 mt-6">
            <a href="{{ route('login') }}" class="text-blue-500 hover:underline">Back to login</a>
        </p>
    </div>

    <div class="w-1/2 hidden md:block">
        <img src="{{ asset('images/reset.jpg') }}" alt="Reset Password image" class="object-cover h-full w-full rounded-r-2xl">
    </div>
</div>
@endsection

