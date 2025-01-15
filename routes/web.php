<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FondController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::middleware('auth')->group(function () {
    Route::inertia('/', 'Auth/Login')->name('auth/login');

    Route::inertia('/evenement', 'Evenement')->name('meetup.index');

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
Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::put('/password', [PasswordController::class, 'update'])->name('password.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__ . '/auth.php';
require __DIR__ . '/fund.php';
require __DIR__ . '/transaction.php';
require __DIR__ . '/detente.php';
require __DIR__ . '/compte.php';
