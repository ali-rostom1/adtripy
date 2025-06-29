<?php

namespace App\Http\Middleware;

use Closure;
use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Log;

class SyncJwtUser
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            $token = JWTAuth::parseToken();
            $payload = $token->getPayload();
            $userId = $payload->get('sub');
            
            Log::info('SyncJwtUser processing token with user ID: ' . $userId);
            
            // Try to find user first
            $user = User::find($userId);
            
            // If no user exists, create one from the token
            if (!$user) {
                $user = new User();
                $user->id = $userId;
                $user->email = $payload->get('email', $userId . '@example.com');
                $user->firstName = $payload->get('firstName', 'Unknown');
                $user->lastName = $payload->get('lastName', 'User');
                $user->save();
                
                Log::info('Created new user from JWT token', ['id' => $userId]);
            }
            
            // Force authenticate this user
            auth()->login($user);
            
            Log::info('User authenticated', ['id' => $userId]);
            
            return $next($request);
            
        } catch (\Exception $e) {
            Log::error('Error in SyncJwtUser middleware: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 401);
        }
    }
}