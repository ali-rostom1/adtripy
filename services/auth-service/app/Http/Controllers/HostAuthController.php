<?php

namespace App\Http\Controllers;

use App\Mail\VerifyEmail;
use App\Models\Host;
use App\Models\User;
use Auth;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Log;
use Str;
use Tymon\JWTAuth\Facades\JWTAuth;
use URL;

class HostAuthController extends Controller
{

    public function register(Request $request){

        try {
            $user = Auth::user();
            $user->assignRole('unverified-host');
            $host = Host::create([
                'id' => (string) Str::uuid(),
                'user_id' => $user->id,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Host registered successfully',
                'user' => $user,    
            ], 201);
        } catch (Exception $e) {
            Log::error('User Registration Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred during registration.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
