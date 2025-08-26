<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />
    <link rel="icon" href="{{ asset('favicon.ico') }}?v=1" type="image/x-icon">
    <link rel="shortcut icon" href="{{ asset('favicon.ico') }}?v=1" type="image/x-icon">


    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>

<body class="font-inter antialiased p-2 h-screen">
    <h1 class="sr-only">L'Amorce</h1>
    @inertia
    <script>
        // Script pour masquer l'attribut data-page dans l'inspecteur
        document.addEventListener('DOMContentLoaded', function () {
            const appDiv = document.querySelector('[data-page]');
            if (appDiv) {
                // Stocker les données dans une variable JavaScript
                const pageData = JSON.parse(appDiv.getAttribute('data-page'));
                // Supprimer l'attribut data-page visible
                appDiv.removeAttribute('data-page');
                // Stocker les données dans une propriété non-énumérable
                Object.defineProperty(appDiv, '_pageData', {
                    value: pageData,
                    enumerable: false
                });
                // Restaurer l'accès pour Inertia.js
                appDiv.getAttribute = function (attr) {
                    if (attr === 'data-page') {
                        return JSON.stringify(this._pageData);
                    }
                    return Element.prototype.getAttribute.call(this, attr);
                };
            }
        });
    </script>
</body>

</html>