<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\FondController;
use App\Http\Controllers\MultipleTransferController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware('auth')->group(function () {
    // Routes accessibles avec la permission 'access-funds'
    Route::group(['middleware' => ['auth', 'can:access-funds']], function () {
        Route::get('/fonds', [FondController::class, 'index'])->name('fond.index');
        Route::get('/fonds/{fund}', [FondController::class, 'show'])->name('fond.show');
    });

    // Routes nécessitant la permission 'manage-funds'
    Route::group(['middleware' => ['auth', 'can:manage-funds']], function () {
        Route::post('/fonds', [FondController::class, 'store'])->name('fond.store');
        Route::patch('/fonds/{fund}/edit', [FondController::class, 'update'])->name('fond.update');
    });

    // Routes nécessitant la permission 'delete-funds'
    Route::group(['middleware' => ['auth', 'can:edit-delete-funds']], function () {
        Route::patch('/fonds/{fund}/edit', [FondController::class, 'update'])->name('fond.update');
        Route::delete('/fonds/{fund}', [FondController::class, 'destroy'])->name('fond.destroy');
        Route::post('/fonds/{fund}/transfer-multiple', [MultipleTransferController::class, 'transferMultiple'])->name('fond.transfer-multiple');
    });
});
