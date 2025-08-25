<?php


use App\Http\Controllers\CompteController;

Route::middleware('auth')->group(function () {
    Route::get('/compte', [CompteController::class, 'index' ])->name('compte.index');
    
    // Routes protégées par la permission 'create-users'
    Route::group(['middleware' => ['auth', 'can:create-users']], function () {
        Route::get('addUser', [CompteController::class, 'create'])->name('compte.create');
        Route::post('addUser', [CompteController::class, 'store'])->name('compte.store');
        
        // User management routes
        Route::get('users', [CompteController::class, 'users'])->name('users.index');
        Route::patch('users/{id}', [CompteController::class, 'update'])->name('users.update');
        Route::delete('users/{id}', [CompteController::class, 'destroy'])->name('users.destroy');
    });
});
