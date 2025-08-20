<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\User;
use App\Http\Requests\EventStoreRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Afficher la liste des événements.
     */
    public function index()
    {
        $events = Event::with('participants')->orderBy('date', 'asc')->get();
        $users = User::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Evenement', [
            'events' => $events,
            'users' => $users,
        ]);
    }

    /**
     * Afficher le formulaire de création d'un événement.
     */
    public function create()
    {
        $users = User::all();

        return Inertia::render('Event/Create', [
            'users' => $users
        ]);
    }

    /**
     * Enregistrer un nouvel événement.
     */
    public function store(EventStoreRequest $request)
    {
        $validated = $request->validated();

        $event = Event::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'date' => $validated['date'],
            'time' => $validated['time'],
            'user_id' => Auth::id(),
        ]);

        if (isset($validated['participants'])) {
            $event->participants()->attach($validated['participants']);
        }

        return redirect()->route('event.index')
            ->with('success', 'Événement créé avec succès');
    }

    /**
     * Afficher un événement spécifique.
     */
    public function show(Event $event)
    {
        $event->load('participants');

        return Inertia::render('Event/Show', [
            'event' => $event,
        ]);
    }

    /**
     * Afficher le formulaire d'édition d'un événement.
     */
    public function edit(Event $event)
    {
        $event->load('participants');
        $users = User::all();

        return Inertia::render('Event/Edit', [
            'event' => $event,
            'users' => $users,
            'selectedParticipants' => $event->participants->pluck('id')
        ]);
    }

    /**
     * Mettre à jour un événement.
     */
    public function update(Request $request, Event $event)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'participants' => 'sometimes|array',
            'participants.*' => 'exists:users,id'
        ]);

        $event->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'date' => $validated['date'],
            'time' => $validated['time'],
        ]);

        if (isset($validated['participants'])) {
            $event->participants()->sync($validated['participants']);
        }

        return redirect()->route('event.index')
            ->with('success', 'Événement mis à jour avec succès');
    }

    /**
     * Supprimer un événement.
     */
    public function destroy(Event $event)
    {
        $event->participants()->detach();
        $event->delete();

        return redirect()->route('event.index')
            ->with('success', 'Événement supprimé avec succès');
    }

    /**
     * Ajouter un participant à un événement.
     */
    public function addParticipant(Request $request, Event $event)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $event->participants()->attach($validated['user_id']);

        return back()->with('success', 'Participant ajouté avec succès');
    }

    /**
     * Retirer un participant d'un événement.
     */
    public function removeParticipant(Request $request, Event $event)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $event->participants()->detach($validated['user_id']);

        return back()->with('success', 'Participant retiré avec succès');
    }
}
