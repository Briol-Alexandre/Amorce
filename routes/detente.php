<?php


use App\Http\Controllers\DetenteController;

Route::middleware('auth')->group(function () {
    // Routes accessibles avec la permission 'access-detente'
    Route::group(['middleware' => ['auth', 'can:access-detente']], function () {
        Route::get('/detente', [DetenteController::class, 'index'])->name('detente.index');
        Route::get('/draw', [DetenteController::class, 'draw'])->name('detente.draw');
        Route::get('/history', [DetenteController::class, 'history'])->name('detente.history');
    });

    // Routes nécessitant la permission 'manage-detente'
    Route::group(['middleware' => ['auth', 'can:manage-detente']], function () {
        Route::post('/detente', [DetenteController::class, 'store'])->name('detente.store');
        Route::delete('/draw', [DetenteController::class, 'destroy'])->name('detente.destroy');
        Route::post('/draw', [DetenteController::class, 'participationUpdate'])->name('detente.participation-update');
        Route::post('/remove', [DetenteController::class, 'remove'])->name('detente.remove');
        Route::get('/perform-draw', [DetenteController::class, 'performDraw'])->name('detente.perform-draw');
        Route::post('/remove-all', [DetenteController::class, 'removeAll'])->name('detente.remove-all');
    });
});
