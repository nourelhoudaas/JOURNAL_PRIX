<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Accueil - MonApp</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <!-- ✅ Font Awesome (pour les icônes sociales) -->
    <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
  </head>
<body class="bg-gray-100 min-h-screen flex flex-col">

    {{-- 🔹 Barre de navigation --}}
    <nav class="bg-white shadow-md py-3 px-6 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-800">Grand Prix</h1>
        <div class="space-x-4">
            <a href="{{ route('login') }}"
               class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition">
               Se connecter
            </a>
            <a href="{{ route('register') }}"
               class="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white py-2 px-4 rounded transition">
               S’enregistrer
            </a>
        </div>
    </nav>

    {{-- 🖼️ Image entre la barre et le texte --}}


<div class="w-full flex justify-center my-6">
    <img src="{{ asset('images/logo.png') }}" alt="Bannière"
         style="width: 30cm; height: 6cm; object-fit: cover; border-radius: 0.5rem; box-shadow: 0 0 10px rgba(0,0,0,0.2);">
</div>
<main class="flex-grow flex items-center justify-center">
    <div class="text-justify p-8 bg-white shadow rounded-xl mt-10"
         style="width: 30cm;">
        <h2 class="text-3xl font-bold mb-4">
            Lancement de la 9e édition du Prix du président de la République du Journaliste Professionnel
        </h2>

        <p class="text-gray-700 text-lg leading-relaxed">
            {{-- 🖼️ Image insérée dans le paragraphe avec flottement à gauche --}}
            <img src="{{ asset('images/background.jpeg') }}" alt="Prix Journaliste"
                 class="float-left w-48 h-auto mr-6 mb-3 rounded shadow">

            "Grand Prix" est une plateforme simple, sécurisée et rapide pour vous Enregistrer et envoyer vos documents pour le concours du Prix du président de la République du Journaliste Professionnel.
            Elle met à disposition des journalistes professionnels un environnement propice à la gestion de leurs candidatures pour le prix du Président de la République.

            <br><br>

            Connectez-vous pour commencer ou créez un nouveau compte si vous êtes nouveau.
        </p>
    </div>
</main>

  
    {{-- 🔻 Pied de page --}}
<footer class="bg-gray-100 py-8">
    <div class="w-[30cm] mx-auto rounded-xl shadow-md p-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-gray-800">

            {{-- 📍 Coordonnées --}}
            <div>
                <h2 class="text-lg font-bold text-blue-900 uppercase mb-4">Portail des Médias Algériens</h2>
                <p><span class="font-semibold">Adresse :</span> 03 rue des Frères Bouadou, Bir Mourad Raïs, Alger</p>
                <p class="mt-2"><span class="font-semibold">Téléphone :</span> +213(0)23-54-98-98</p>
                <p><span class="font-semibold">Fax :</span> +213(0)23-54-99-18</p>
                <p class="mt-2"><strong>Email :</strong>
                    <a href="mailto:contact@ministerecommunication.gov.dz" class="text-blue-700 underline">
                        contact@ministerecommunication.gov.dz
                    </a>
                </p>
            </div>

            {{-- 🏛️ Liens importants --}}
            <div>
                <h2 class="text-lg font-bold text-blue-900 mb-4">Liens importants</h2>
                <ul class="space-y-2 text-sm">
                    <li><a href="https://www.ministerecommunication.gov.dz/fr" class="hover:underline text-gray-700">Ministère de la communication</a></li>
                    <li><a href="https://algerianmediagateway.dz/?lang=fr" class="hover:underline text-gray-700">Portail des médias algériens</a></li>
                </ul>
            </div>

            {{-- 📱 Réseaux sociaux --}}
            <div>
                <h2 class="text-lg font-bold text-blue-900 mb-4">Réseaux sociaux</h2>
                <p class="text-sm mb-4">Suivez-nous sur les plateformes suivantes :</p>
                <div class="flex space-x-4">
                    {{-- Facebook --}}
                    <a href="https://www.facebook.com/ministerecomdz/" target="_blank" class="bg-blue-600 p-2 rounded-full text-white">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22 12.07C22 6.48 17.52 2 12 2S2 6.48 2 12.07c0 5.02 3.66 9.17 8.44 9.88v-6.99h-2.54v-2.89h2.54V9.41c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.87h2.78l-.44 2.89h-2.34v6.99C18.34 21.24 22 17.09 22 12.07z"/>
                        </svg>
                    </a>
                    {{-- Twitter --}}
                    <a href="https://x.com/ministerecomdz" target="_blank" class="bg-blue-600 p-2 rounded-full text-white">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.69 4.27c-.77.34-1.6.56-2.47.66a4.27 4.27 0 0 0 1.87-2.36 8.54 8.54 0 0 1-2.7 1.03 4.26 4.26 0 0 0-7.32 3.88A12.1 12.1 0 0 1 3.1 3.16a4.26 4.26 0 0 0 1.32 5.7 4.25 4.25 0 0 1-1.93-.53v.05a4.27 4.27 0 0 0 3.42 4.18 4.29 4.29 0 0 1-1.92.07 4.27 4.27 0 0 0 3.98 2.96 8.56 8.56 0 0 1-5.3 1.83A8.65 8.65 0 0 1 2 18.57a12.08 12.08 0 0 0 6.56 1.92c7.87 0 12.18-6.52 12.18-12.18 0-.18 0-.37-.01-.55a8.65 8.65 0 0 0 2.13-2.2z"/>
                        </svg>
                    </a>
                    {{-- YouTube --}}
                    <a href="https://www.youtube.com/channel/UCh-59VCaCS_NZRNNlgotxBg" target="_blank" class="bg-red-600 p-2 rounded-full text-white">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.615 3.184a2.994 2.994 0 0 0-2.118-2.118C15.771.5 12 .5 12 .5s-3.771 0-5.497.566A2.994 2.994 0 0 0 4.385 3.184C3.82 4.911 3.82 8.682 3.82 8.682s0 3.77.566 5.497a2.994 2.994 0 0 0 2.118 2.118C8.229 17.5 12 17.5 12 17.5s3.771 0 5.497-.566a2.994 2.994 0 0 0 2.118-2.118c.566-1.727.566-5.497.566-5.497s0-3.771-.566-5.497zM9.75 11.318V6.682l4.5 2.318-4.5 2.318z"/>
                        </svg>
                    </a>
                </div>
            </div>

        </div>
    </div>
</footer>




</body>
</html>
