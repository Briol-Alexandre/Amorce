<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;

class QueueController extends Controller
{
    /**
     * Traite les jobs en attente dans la queue
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function processQueue()
    {
        try {
            $exitCode = Artisan::call('queue:work', [
                '--stop-when-empty' => true,
                '--tries' => 3,
            ]);

            \Log::info('Queue processed via API', [
                'exit_code' => $exitCode,
                'output' => Artisan::output()
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Jobs traités avec succès',
                'exit_code' => $exitCode
            ]);
        } catch (\Exception $e) {
            \Log::error('Erreur lors du traitement de la queue', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Erreur lors du traitement des jobs',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
