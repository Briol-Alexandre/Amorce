<?php


use App\Http\Controllers\CompteController;

Route::middleware('auth')->group(function () {
    Route::get('/compte', [CompteController::class, 'index' ])->name('compte.index');
    Route::get('addUser', [CompteController::class, 'create'])->name('compte.create');
    Route::post('addUser', [CompteController::class, 'store'])->name('compte.store');
});
