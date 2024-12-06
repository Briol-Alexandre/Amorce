<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class BaseController extends Controller
{
    public function index()
    {
        return Redirect::to('/dashboard');
    }
}
