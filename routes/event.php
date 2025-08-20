<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EventController;

Route::middleware('auth')->group(function () {
    Route::get('/events', [EventController::class, 'index'])->name('event.index');
    Route::get('/events/create', [EventController::class, 'create'])->name('event.create');
    Route::post('/events', [EventController::class, 'store'])->name('event.store');
    Route::get('/events/{event}', [EventController::class, 'show'])->name('event.show');
    Route::get('/events/{event}/edit', [EventController::class, 'edit'])->name('event.edit');
    Route::put('/events/{event}', [EventController::class, 'update'])->name('event.update');
    Route::delete('/events/{event}', [EventController::class, 'destroy'])->name('event.destroy');
});
