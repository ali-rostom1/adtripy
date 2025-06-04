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
        $request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        try {
            $user = User::create([
                'id' => (string) Str::uuid(),
                'firstName' => $request->firstName,
                'lastName' => $request->lastName,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'phone' => $request->phone ?? null,
            ]);
            $user->syncRoles(['unverified-host']);
            $host = Host::create([
                'id' => (string) Str::uuid(),
                'user_id' => $user->id,
            ]);

            // Generate access token
            $token = JWTAuth::fromUser($user);

            // Send verification email
            try {
                $verificationToken = Str::random(60);
                Cache::put('email_verify_' . $verificationToken, $user->getKey(), now()->addHours(24));
                $verificationUrl = URL::to('/api/v1/verify-email/' . $verificationToken);
                Mail::to($user->email)->send(new VerifyEmail($user, $verificationUrl));
            } catch (Exception $e) {
                Log::error('Failed to send verification email: ' . $e->getMessage());
                // Continue with registration even if email fails
            }

            return response()->json([
                'status' => 'success',
                'message' => 'User created successfully. Please check your email to verify your account.',
                'user' => $user,
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => Auth::factory()->getTTL() * 60
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
