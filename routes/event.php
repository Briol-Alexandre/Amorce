<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;

Route::middleware('auth')->group(function () {
    // Routes accessibles avec la permission 'access-meetings'
    Route::group(['middleware' => ['auth', 'can:access-meetings']], function () {
        Route::get('/events', [EventController::class, 'index'])->name('event.index');
        Route::get('/events/{event}', [EventController::class, 'show'])->name('event.show');
    });
    
    // Routes nécessitant la permission 'manage-meetings'
    Route::group(['middleware' => ['auth', 'can:manage-meetings']], function () {
        Route::get('/events/create', [EventController::class, 'create'])->name('event.create');
        Route::post('/events', [EventController::class, 'store'])->name('event.store');
        Route::get('/events/{event}/edit', [EventController::class, 'edit'])->name('event.edit');
        Route::put('/events/{event}', [EventController::class, 'update'])->name('event.update');
        Route::delete('/events/{event}', [EventController::class, 'destroy'])->name('event.destroy');
        Route::post('/events/{event}/report', [EventController::class, 'addReport'])->name('event.add-report');
        
        // Routes pour la gestion des participants
        Route::post('/events/{event}/participants', [EventController::class, 'addParticipant'])->name('event.add-participant');
        Route::delete('/events/{event}/participants', [EventController::class, 'removeParticipant'])->name('event.remove-participant');
    });
});
