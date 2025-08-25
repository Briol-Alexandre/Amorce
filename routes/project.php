<?php

use App\Http\Controllers\ProjectController;
Route::middleware('auth')->group(function () {
    // Routes accessibles avec la permission 'access-projects'
    Route::group(['middleware' => ['auth', 'can:access-projects']], function () {
        Route::get('/project', [ProjectController::class, 'index'])->name('project.index');
        Route::get('/project/{project}', [ProjectController::class, 'show'])->name('project.show');
        
        // Route API pour récupérer un projet spécifique
        Route::get('/api/project/{project}', [ProjectController::class, 'getProject'])->name('api.project.get');
    });
    
    // Routes nécessitant la permission 'manage-projects'
    Route::group(['middleware' => ['auth', 'can:manage-projects']], function () {
        Route::get('/project/create', [ProjectController::class, 'create'])->name('project.create');
        Route::post('/project', [ProjectController::class, 'store'])->name('project.store');
        Route::get('/project/{project}/edit', [ProjectController::class, 'edit'])->name('project.edit');
        Route::put('/project/{project}', [ProjectController::class, 'update'])->name('project.update');
        Route::delete('/project/{project}', [ProjectController::class, 'destroy'])->name('project.destroy');
    });
});
