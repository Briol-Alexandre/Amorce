<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\FondController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware('auth')->group(function () {
    Route::inertia('/', 'Auth/Login')->name('auth/login');

    Route::inertia('/dashboard', 'Dashboard')->name('dashboard');

    Route::get('/fonds', [FondController::class, 'index'])->name('fond.index');

    Route::get('/fonds/{fund}', [FondController::class, 'show'])->name('fond.show');

    Route::inertia('/detente', 'Detente')->name('detente.index');

    Route::inertia('/evenement', 'Evenement')->name('meetup.index');

    Route::inertia('/compte', 'Compte')->name('account.index');

    Route::post('/fonds', [FondController::class, 'store'])->name('fond.store');

    Route::get('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('session-authenticated.destroy');
});

Route::middleware('guest')->group(function () {
    Route::inertia('/', 'Auth/Login')->name('auth/login');

});

Route::get('/', function () {
    return Inertia::render('Auth/Login', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
