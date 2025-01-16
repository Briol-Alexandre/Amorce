<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class UserCreated extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;
    public $plainPassword;

    public function __construct($user, $plainPassword)
    {
        $this->user = $user;
        $this->plainPassword = $plainPassword;
    }

    public function build(): UserCreated
    {
        return $this
            ->subject('Vos informations de connexion')
            ->view('emails.user_created')
            ->with([
                'name' => $this->user->name,
                'email' => $this->user->email,
                'role' => $this->user->role,
                'password' => $this->plainPassword,
            ]);
    }
}

