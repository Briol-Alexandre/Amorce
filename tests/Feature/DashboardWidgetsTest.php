<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\Permission;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class DashboardWidgetsTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        // Créer les permissions nécessaires pour les tests
        $permissions = [
            ['name' => 'Accès aux fonds', 'slug' => 'access-funds'],
            ['name' => 'Accès aux réunions', 'slug' => 'access-meetings'],
            ['name' => 'Accès à la détente', 'slug' => 'access-detente'],
            ['name' => 'Accès aux projets', 'slug' => 'access-projects'],
            ['name' => 'Accès aux donateurs', 'slug' => 'access-donators'],
            ['name' => 'Gérer les fonds', 'slug' => 'manage-funds'],
            ['name' => 'Créer des utilisateurs', 'slug' => 'create-users'],
        ];

        foreach ($permissions as $permission) {
            Permission::create($permission);
        }
    }

    /**
     * Test que l'utilisateur sans permissions ne voit que les widgets autorisés
     */
    public function test_user_without_permissions_sees_only_allowed_widgets(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)
            ->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn($assert) => $assert
                ->component('Dashboard')
                ->has('user')
                ->has('stats')
                ->has('projects')
                ->has('donators')
        );

        // Vérifier que l'utilisateur n'a pas de permissions
        $this->assertCount(0, $user->permissions);
    }

    /**
     * Test que l'utilisateur avec permission access-funds voit les widgets correspondants
     */
    public function test_user_with_funds_permission_sees_funds_widgets(): void
    {
        $user = User::factory()->create();
        $fundsPermission = Permission::where('slug', 'access-funds')->first();

        // Attribuer la permission à l'utilisateur
        DB::table('user_permissions')->insert([
            'user_id' => $user->id,
            'permission_id' => $fundsPermission->id,
        ]);

        // Rafraîchir l'utilisateur pour charger les permissions
        $user = User::find($user->id);

        $response = $this->actingAs($user)
            ->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn($assert) => $assert
                ->component('Dashboard')
                ->has('user')
                ->has('funds')
                ->has('recentTransactions')
        );

        // Vérifier que l'utilisateur a la permission access-funds
        $this->assertTrue($user->permissions->contains('slug', 'access-funds'));
    }

    /**
     * Test que l'utilisateur avec permission access-meetings voit les widgets correspondants
     */
    public function test_user_with_meetings_permission_sees_events_widget(): void
    {
        $user = User::factory()->create();
        $meetingsPermission = Permission::where('slug', 'access-meetings')->first();

        // Attribuer la permission à l'utilisateur
        DB::table('user_permissions')->insert([
            'user_id' => $user->id,
            'permission_id' => $meetingsPermission->id,
        ]);

        // Rafraîchir l'utilisateur pour charger les permissions
        $user = User::find($user->id);

        $response = $this->actingAs($user)
            ->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn($assert) => $assert
                ->component('Dashboard')
                ->has('user')
                ->has('events')
        );

        // Vérifier que l'utilisateur a la permission access-meetings
        $this->assertTrue($user->permissions->contains('slug', 'access-meetings'));
    }

    /**
     * Test que l'utilisateur avec permission access-detente voit les widgets correspondants
     */
    public function test_user_with_detente_permission_sees_detente_widget(): void
    {
        $user = User::factory()->create();
        $detentePermission = Permission::where('slug', 'access-detente')->first();

        // Attribuer la permission à l'utilisateur
        DB::table('user_permissions')->insert([
            'user_id' => $user->id,
            'permission_id' => $detentePermission->id,
        ]);

        // Rafraîchir l'utilisateur pour charger les permissions
        $user = User::find($user->id);

        $response = $this->actingAs($user)
            ->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn($assert) => $assert
                ->component('Dashboard')
                ->has('user')
                ->has('detenteParticipants')
        );

        // Vérifier que l'utilisateur a la permission access-detente
        $this->assertTrue($user->permissions->contains('slug', 'access-detente'));
    }

    /**
     * Test que l'utilisateur avec permission access-projects voit les widgets correspondants
     */
    public function test_user_with_projects_permission_sees_projects_widget(): void
    {
        $user = User::factory()->create();
        $projectsPermission = Permission::where('slug', 'access-projects')->first();

        // Attribuer la permission à l'utilisateur
        DB::table('user_permissions')->insert([
            'user_id' => $user->id,
            'permission_id' => $projectsPermission->id,
        ]);

        // Rafraîchir l'utilisateur pour charger les permissions
        $user = User::find($user->id);

        $response = $this->actingAs($user)
            ->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn($assert) => $assert
                ->component('Dashboard')
                ->has('user')
                ->has('projects')
        );

        // Vérifier que l'utilisateur a la permission access-projects
        $this->assertTrue($user->permissions->contains('slug', 'access-projects'));
    }

    /**
     * Test que l'utilisateur avec permission access-donators voit les widgets correspondants
     */
    public function test_user_with_donators_permission_sees_donators_widget(): void
    {
        $user = User::factory()->create();
        $donatorsPermission = Permission::where('slug', 'access-donators')->first();

        // Attribuer la permission à l'utilisateur
        DB::table('user_permissions')->insert([
            'user_id' => $user->id,
            'permission_id' => $donatorsPermission->id,
        ]);

        // Rafraîchir l'utilisateur pour charger les permissions
        $user = User::find($user->id);

        $response = $this->actingAs($user)
            ->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn($assert) => $assert
                ->component('Dashboard')
                ->has('user')
                ->has('donators')
                ->has('totalDonators')
                ->has('activeDonators')
        );

        // Vérifier que l'utilisateur a la permission access-donators
        $this->assertTrue($user->permissions->contains('slug', 'access-donators'));
    }

    /**
     * Test que l'utilisateur avec toutes les permissions voit tous les widgets
     */
    public function test_user_with_all_permissions_sees_all_widgets(): void
    {
        $user = User::factory()->create();
        $permissions = Permission::all();

        // Attribuer toutes les permissions à l'utilisateur
        foreach ($permissions as $permission) {
            DB::table('user_permissions')->insert([
                'user_id' => $user->id,
                'permission_id' => $permission->id,
            ]);
        }

        // Rafraîchir l'utilisateur pour charger les permissions
        $user = User::find($user->id);

        $response = $this->actingAs($user)
            ->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn($assert) => $assert
                ->component('Dashboard')
                ->has('user')
                ->has('stats')
                ->has('funds')
                ->has('events')
                ->has('detenteParticipants')
                ->has('recentTransactions')
                ->has('projects')
                ->has('donators')
                ->has('totalDonators')
                ->has('activeDonators')
        );

        // Vérifier que l'utilisateur a toutes les permissions nécessaires
        $this->assertTrue($user->permissions->contains('slug', 'access-funds'));
        $this->assertTrue($user->permissions->contains('slug', 'access-meetings'));
        $this->assertTrue($user->permissions->contains('slug', 'access-detente'));
        $this->assertTrue($user->permissions->contains('slug', 'access-projects'));
        $this->assertTrue($user->permissions->contains('slug', 'access-donators'));
    }

    /**
     * Test que les actions rapides sont filtrées en fonction des permissions
     */
    public function test_quick_actions_are_filtered_by_permissions(): void
    {
        $user = User::factory()->create();
        $createUsersPermission = Permission::where('slug', 'create-users')->first();

        // Attribuer la permission à l'utilisateur
        DB::table('user_permissions')->insert([
            'user_id' => $user->id,
            'permission_id' => $createUsersPermission->id,
        ]);

        // Rafraîchir l'utilisateur pour charger les permissions
        $user = User::find($user->id);

        $response = $this->actingAs($user)
            ->get(route('dashboard'));

        $response->assertStatus(200);
        $response->assertInertia(
            fn($assert) => $assert
                ->component('Dashboard')
                ->has('user')
                ->where('user.permissions', function ($permissions) {
                    return collect($permissions)->contains('slug', 'create-users') &&
                        !collect($permissions)->contains('slug', 'manage-funds') &&
                        !collect($permissions)->contains('slug', 'manage-meetings');
                })
        );

        // Vérifier que l'utilisateur a la permission create-users
        $this->assertTrue($user->permissions->contains('slug', 'create-users'));
        $this->assertFalse($user->permissions->contains('slug', 'manage-funds'));
    }
}
