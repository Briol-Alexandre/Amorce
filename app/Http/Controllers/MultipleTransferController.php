<?php

namespace App\Http\Controllers;

use App\Models\Fund;
use App\Models\Transaction;
use App\Models\Donators;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MultipleTransferController extends Controller
{
    public function transferMultiple(Request $request, Fund $fund)
    {
        $request->validate([
            'transfers' => 'required|array|min:1',
            'transfers.*.amount' => 'required|numeric|min:0.01',
            'transfers.*.destinationFundId' => 'required|exists:funds,id',
            'transfers.*.transactor' => 'required|string|max:255',
            'transfers.*.communication' => 'required|string|max:255',
            'transfers.*.date' => 'required|date',
        ]);

        $transfers = $request->input('transfers');
        
        // Vérifier que le total des transferts ne dépasse pas le montant du fond
        $totalAmount = collect($transfers)->sum('amount');
        if ($totalAmount > $fund->amount) {
            return response()->json([
                'message' => 'Le total des transferts dépasse le montant disponible dans le fond.',
                'errors' => ['total' => 'Montant insuffisant']
            ], 422);
        }

        // Pas de vérification de doublons - on peut transférer plusieurs fois vers le même fond

        // Exécuter tous les transferts dans une transaction DB
        DB::transaction(function () use ($fund, $transfers, $totalAmount) {
            foreach ($transfers as $transfer) {
                $amount = $transfer['amount'];
                $destinationFund = Fund::findOrFail($transfer['destinationFundId']);
                
                // Créer le donateur s'il n'existe pas
                $donator = Donators::firstOrCreate(
                    ['name' => $transfer['transactor']],
                    ['name' => $transfer['transactor']]
                );

                // Créer la transaction de débit (fond source)
                Transaction::create([
                    'fund_id' => $fund->id,
                    'amount' => -$amount,
                    'communication' => $transfer['communication'],
                    'transactor' => $transfer['transactor'],
                    'date' => $transfer['date'],
                ]);

                // Créer la transaction de crédit (fond destinataire)
                Transaction::create([
                    'fund_id' => $destinationFund->id,
                    'amount' => $amount,
                    'communication' => $transfer['communication'],
                    'transactor' => $transfer['transactor'],
                    'date' => $transfer['date'],
                ]);

                // Mettre à jour les montants des fonds
                $destinationFund->increment('amount', $amount);
            }

            // Décrémenter le montant total du fond source
            $fund->decrement('amount', $totalAmount);
        });

        // Retourner une réponse avec un flag de succès pour le frontend
        return back()->with('transfersCompleted', true);
    }
}
