<?php

namespace App\Http\Controllers;

use App\Models\Detente;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use function Termwind\render;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $events = Event::all();
        $detenteParticipants = Detente::all();

        return Inertia::render('Dashboard', [
            'user' => $user,
            'events' => $events,
            'detenteParticipants' => $detenteParticipants
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
