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
            'transfers.*.communication' => 'required|string|max:255',
            'transfers.*.date' => 'required|date',
        ]);

        $transfers = $request->input('transfers');


        $totalAmount = collect($transfers)->sum('amount');
        if ($totalAmount > $fund->amount) {
            return response()->json([
                'message' => 'Le total des transferts dépasse le montant disponible dans le fond.',
                'errors' => ['total' => 'Montant insuffisant']
            ], 422);
        }

        DB::transaction(function () use ($fund, $transfers, $totalAmount) {
            foreach ($transfers as $transfer) {
                $amount = $transfer['amount'];
                $destinationFund = Fund::findOrFail($transfer['destinationFundId']);

                $donator = Donators::firstOrCreate(
                    ['name' => $fund->name],
                    ['name' => $fund->name]
                );

                $date = new \DateTime($transfer['date']);
                $month = $date->format('n');
                $year = $date->format('Y');


                Transaction::create([
                    'fund_id' => $fund->id,
                    'amount' => -$amount,
                    'communication' => $transfer['communication'],
                    'month' => $month,
                    'year' => $year,
                ]);


                Transaction::create([
                    'fund_id' => $destinationFund->id,
                    'amount' => $amount,
                    'communication' => $transfer['communication'],
                    'month' => $month,
                    'year' => $year,
                ]);


                $destinationFund->increment('amount', $amount);
            }


            $fund->decrement('amount', $totalAmount);
        });


        return back()->with('transfersCompleted', true);
    }
}
