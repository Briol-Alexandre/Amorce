<?php


use App\Http\Controllers\DetenteController;

Route::middleware('auth')->group(function () {
    Route::get('/detente', [DetenteController::class, 'index'])->name('detente.index');
    Route::post('/detente', [DetenteController::class, 'store'])->name('detente.store');
    Route::get('/draw', [DetenteController::class, 'draw'])->name('detente.draw');
    Route::delete('/draw', [DetenteController::class, 'destroy'])->name('detente.destroy');
    Route::post('/draw', [DetenteController::class, 'participationUpdate'])->name('detente.participation-update');
    Route::post('/remove', [DetenteController::class, 'remove'])->name('detente.remove');
    Route::get('/perform-draw', [DetenteController::class, 'performDraw'])->name('detente.perform-draw');
    Route::get('/history', [DetenteController::class, 'history'])->name('detente.history');
});
