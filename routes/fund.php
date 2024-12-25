<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\FondController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware('auth')->group(function () {
    Route::get('/fonds', [FondController::class, 'index'])->name('fond.index');

    Route::get('/fonds/{fund}', [FondController::class, 'show'])->name('fond.show');

    Route::post('/fonds', [FondController::class, 'store'])->name('fond.store');

    Route::delete('/fonds/{fund}', [FondController::class, 'destroy'])->name('fond.destroy');

    Route::patch('/fonds/{fund}', [FondController::class, 'update'])->name('fond.update');
});
