<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\FondController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware('auth')->group(function () {
    // Routes accessibles avec la permission 'manage-funds'
    Route::group(['middleware' => ['auth', 'can:manage-funds']], function () {
        Route::get('/donators', [TransactionController::class, 'getDonators'])->name('transaction.donators');
        Route::get('/csv/list', [TransactionController::class, 'csvList'])->name('transaction.csv-list');
    
        // Routes pour gérer les transactions
        Route::post('/fonds/csv', function () {
            return redirect('/fonds');
        });
        Route::post('/fonds/{fund}', [TransactionController::class, 'store'])->name('transaction.store');
        Route::patch('/fonds/{fund}', [TransactionController::class, 'update'])->name('transaction.update');
        Route::post('/csv/submit', [TransactionController::class, 'storeCsvTransactions'])->name('transaction.store-csv-transactions');
        Route::get('/csv', [TransactionController::class, 'index'])->name('transaction.index');
        Route::post('/csv', [TransactionController::class, 'csv'])->name('transaction.seed-csv-transactions');
    });
});
