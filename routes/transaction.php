<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\FondController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\TransactionController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware('auth')->group(function () {
    Route::post('/fonds/{fund}', [TransactionController::class, 'store'])->name('transaction.store');
    Route::patch('/fonds/{fund}', [TransactionController::class, 'update'])->name('transaction.update');
    Route::post('/fonds', [TransactionController::class, 'csv'])->name('transaction.seed-csv-transactions');
});
