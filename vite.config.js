import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.jsx', 'resources/js/ssr.jsx'], // Inclut SSR
            ssr: 'resources/js/ssr.jsx', // Point d’entrée SSR
        }),
        react(),
    ],
});


