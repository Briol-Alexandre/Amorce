<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\User;
use App\Http\Requests\EventStoreRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Afficher la liste des événements.
     * Filtre pour n'afficher que les événements créés par l'utilisateur ou auxquels il participe.
     */
    public function index()
    {
        $userId = Auth::id();


        $events = Event::with('participants')
            ->where('user_id', $userId)
            ->orWhereHas('participants', function ($query) use ($userId) {
                $query->where('users.id', $userId);
            })
            ->orderBy('date', 'asc')
            ->get();

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
            'platform' => $validated['platform'] ?? null,
            'meeting_link' => $validated['meeting_link'] ?? null,
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

        $userId = Auth::id();
        if ($event->user_id !== $userId && !$event->participants->contains('id', $userId)) {
            abort(403, 'Vous n\'avez pas accès à cet événement.');
        }

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

        $user = Auth::user();
        if ($event->user_id !== $user->id && !$user->is_admin && !($user->permissions && in_array('edit-events', $user->permissions))) {
            abort(403, 'Vous n\'avez pas les droits pour éditer cet événement.');
        }


        if ($event->isPast()) {
            abort(403, 'Les événements passés ne peuvent pas être modifiés.');
        }

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

        $user = Auth::user();
        if ($event->user_id !== $user->id && !$user->is_admin && !($user->permissions && in_array('edit-events', $user->permissions))) {
            abort(403, 'Vous n\'avez pas les droits pour modifier cet événement.');
        }


        if ($event->isPast()) {
            abort(403, 'Les événements passés ne peuvent pas être modifiés.');
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'platform' => 'nullable|string|max:255',
            'meeting_link' => 'nullable|string|url|max:2048',
            'date' => 'required|date',
            'time' => 'required|date_format:H:i',
            'participants' => 'sometimes|array',
            'participants.*' => 'exists:users,id'
        ]);

        $event->update([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'platform' => $validated['platform'] ?? null,
            'meeting_link' => $validated['meeting_link'] ?? null,
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

        $user = Auth::user();
        if ($event->user_id !== $user->id && !$user->is_admin && !($user->permissions && in_array('delete-events', $user->permissions))) {
            abort(403, 'Vous n\'avez pas les droits pour supprimer cet événement.');
        }


        if ($event->file) {
            Storage::disk('public')->delete($event->file);
        }

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

        $user = Auth::user();
        if ($event->user_id !== $user->id && !$user->is_admin && !($user->permissions && in_array('edit-events', $user->permissions))) {
            abort(403, 'Vous n\'avez pas les droits pour ajouter des participants à cet événement.');
        }

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

        $user = Auth::user();
        $userId = $request->input('user_id');

        if (
            $event->user_id !== $user->id &&
            !$user->is_admin &&
            !($user->permissions && in_array('edit-events', $user->permissions)) &&
            $userId != $user->id
        ) {
            abort(403, 'Vous n\'avez pas les droits pour retirer ce participant de l\'\u00e9vénement.');
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id'
        ]);

        $event->participants()->detach($validated['user_id']);

        return back()->with('success', 'Participant retiré avec succès');
    }

    /**
     * Ajouter un compte rendu PDF à un événement passé.
     */
    public function addReport(Request $request, Event $event)
    {

        if (!$event->canAddReport(Auth::user())) {
            return back()->with('error', 'Vous n\'êtes pas autorisé à ajouter un compte rendu à cet événement');
        }


        $request->validate([
            'report_file' => 'required|file|mimes:pdf|max:10240',
        ]);


        if ($event->file) {
            Storage::disk('public')->delete($event->file);
        }


        $path = $request->file('report_file')->store('event-reports', 'public');


        $event->update([
            'file' => $path
        ]);

        return back()->with('success', 'Compte rendu ajouté avec succès');
    }
}
