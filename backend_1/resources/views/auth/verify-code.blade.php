<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Vérification du code</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-100 flex items-center justify-center min-h-screen">

    <div class="bg-white shadow p-8 rounded w-full max-w-md">
        <h2 class="text-2xl font-bold mb-4 text-center">Vérification du code</h2>

        @if ($errors->any())
            <div class="mb-4 text-red-600 text-sm">
                {{ $errors->first() }}
            </div>
        @endif

        <form method="POST" action="{{ route('verify.code.submit') }}">
            @csrf
            <div class="mb-4">
                <label for="code" class="block text-gray-700">Code reçu par e-mail</label>
                <input type="text" name="code" id="code" required class="w-full border rounded px-3 py-2 mt-1">
            </div>
            <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded">
                Vérifier le code
            </button>
        </form>
    </div>

</body>
</html>
