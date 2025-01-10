<?php


use App\Http\Controllers\DetenteController;

Route::middleware('auth')->group(function () {
    Route::get('/detente', [DetenteController::class, 'index'])->name('detente.index');
});
