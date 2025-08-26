<?php

namespace App\Http\Controllers;

use App\Models\Detente;
use App\Models\Donators;
use App\Models\Event;
use App\Models\Fund;
use App\Models\Project;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $userId = Auth::id();

        // Charger les permissions de l'utilisateur pour les widgets
        $user->load('permissions');

        // Récupérer les événements
        $events = Event::with('participants')
            ->where('user_id', $userId)
            ->orWhereHas('participants', function ($query) use ($userId) {
                $query->where('users.id', $userId);
            })
            ->orderBy('date', 'asc')
            ->get();

        // Récupérer les participants à la détente
        $detenteParticipants = Detente::all();

        // Récupérer les fonds pour le widget des fonds
        $funds = Fund::orderBy('updated_at', 'desc')->take(10)->get();
        $totalFundsAmount = Fund::sum('amount');
        $fundCount = Fund::count();

        // Récupérer les transactions récentes
        $recentTransactions = Transaction::with('fund')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();
            
        // Récupérer les projets pour le widget des projets
        $projects = Project::orderBy('updated_at', 'desc')->take(5)->get();
        
        // Récupérer les donateurs pour le widget des donateurs
        $recentDonators = Cache::remember('recent_donators', 60*5, function () {
            return Donators::with('periods')
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get();
        });
        
        $totalDonators = Cache::remember('total_donators', 60*10, function () {
            return Donators::count();
        });
        
        $activeDonators = Donators::whereHas('periods', function($query) {
            $query->where('year', Carbon::now()->year)
                ->where('month', Carbon::now()->month);
        })->count();

        // Statistiques générales
        $stats = [
            'totalFundsAmount' => $totalFundsAmount,
            'transactionsThisMonth' => Transaction::whereMonth('created_at', Carbon::now()->month)
                ->whereYear('created_at', Carbon::now()->year)
                ->count(),
            'upcomingEvents' => Event::where('date', '>=', Carbon::now())->count(),
            'activeDonators' => Donators::whereHas('periods', function($query) {
                $query->where('year', Carbon::now()->year)
                    ->where('month', Carbon::now()->month);
            })->count(),
        ];

        return Inertia::render('Dashboard', [
            'user' => $user,
            'events' => $events,
            'detenteParticipants' => $detenteParticipants,
            'funds' => $funds,
            'totalFundsAmount' => $totalFundsAmount,
            'fundCount' => $fundCount,
            'recentTransactions' => $recentTransactions,
            'stats' => $stats,
            'projects' => $projects,
            'donators' => $recentDonators,
            'totalDonators' => $totalDonators,
            'activeDonators' => $activeDonators,
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
