<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Tymon\JWTAuth\Facades\JWTAuth;
use Twilio\Rest\Client;
use Exception;

class AuthController extends Controller
{
    // Send WhatsApp verification code
    public function sendVerificationCode(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
        ]);
        $user = Auth::user();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthenticated'], 401);
        }
        if ($user->phone !== $request->phone) {
            return response()->json([
                'status' => 'error',
                'message' => 'Phone number does not belong to authenticated user'
            ], 403);
        }
        try {
            $code = rand(100000, 999999);
            Cache::put('verify_' . $request->phone, $code, now()->addMinutes(5));
            $twilio = new Client(env('TWILIO_SID'), env('TWILIO_AUTH_TOKEN'));
            $twilio->messages->create(
                'whatsapp:' . $request->phone,
                [
                    'from' => 'whatsapp:' . env('TWILIO_WHATSAPP_FROM'),
                    'body' => "Your verification code is: $code"
                ]
            );
            return response()->json(['status' => 'success', 'message' => 'Verification code sent.']);
        } catch (Exception $e) {
            Log::error('Send Verification Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Could not send verification code.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function verifyPhone(Request $request)
    {
        $request->validate([
            'phone' => 'required|string',
            'code' => 'required|numeric',
        ]);
        
        $user = Auth::user();
        if (!$user) {
            return response()->json(['status' => 'error', 'message' => 'Unauthenticated'], 401);
        }
        
        if ($user->phone !== $request->phone) {
            return response()->json(['status' => 'error', 'message' => 'Phone number does not belong to authenticated user'], 403);
        }
        
        $cachedCode = Cache::get('verify_' . $request->phone);
        if ($cachedCode && $cachedCode == $request->code) {
            $user->phone_verified_at = now();
            $user->save();
            
            Cache::forget('verify_' . $request->phone);
            return response()->json(['status' => 'success', 'message' => 'Phone verified successfully.']);
        }
        return response()->json(['status' => 'error', 'message' => 'Invalid or expired verification code.'], 400);
    }

    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);
        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
            
            // Generate access token
            $token = JWTAuth::fromUser($user);
            
            // Generate refresh token with 30-day expiration
            $refreshToken = JWTAuth::customClaims([
                'exp' => now()->addDays(30)->timestamp,
                'token_type' => 'refresh'
            ])->fromUser($user);
            
            return response()->json([
                'status' => 'success',
                'message' => 'User created successfully.',
                'user' => $user,
                'access_token' => $token,
                'refresh_token' => $refreshToken,
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

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
        try {
            $credentials = $request->only('email', 'password');
            if (!$token = Auth::attempt($credentials)) {
                return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 401);
            }
            $user = Auth::user();
            
            // Generate refresh token with 30-day expiration
            $refreshToken = JWTAuth::customClaims([
                'exp' => now()->addDays(30)->timestamp,
                'token_type' => 'refresh'
            ])->fromUser($user);
            
            return response()->json([
                'status' => 'success',
                'user' => $user,
                'access_token' => $token,
                'refresh_token' => $refreshToken,
                'token_type' => 'bearer',
                'expires_in' => Auth::factory()->getTTL() * 60
            ]);
        } catch (Exception $e) {
            Log::error('Login Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred during login.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function refresh(Request $request)
    {
        try {
            $request->validate([
                'refresh_token' => 'required|string'
            ]);
            
            $refreshToken = $request->refresh_token;
            
            try {
                $payload = JWTAuth::setToken($refreshToken)->getPayload();
                
                if (!isset($payload['token_type']) || $payload['token_type'] !== 'refresh') {
                    return response()->json(['status' => 'error', 'message' => 'Invalid refresh token'], 401);
                }
                
                try {
                    JWTAuth::setToken($refreshToken)->invalidate();
                } catch (Exception $e) {
                    // Already invalidated or error, ignore 
                }
                
                // Get user from token sub (subject)
                $userId = $payload['sub'];
                $user = User::find($userId);
                
                if (!$user) {
                    return response()->json(['status' => 'error', 'message' => 'User not found'], 404);
                }
                
                // Generate new access token
                $token = JWTAuth::fromUser($user);
                // Rotate refresh token: issue a new one
                $newRefreshToken = JWTAuth::customClaims([
                    'exp' => now()->addDays(30)->timestamp,
                    'token_type' => 'refresh'
                ])->fromUser($user);
                
                return response()->json([
                    'status' => 'success',
                    'access_token' => $token,
                    'refresh_token' => $newRefreshToken,
                    'token_type' => 'bearer',
                    'expires_in' => Auth::factory()->getTTL() * 60
                ]);
            } catch (Exception $e) {
                return response()->json(['status' => 'error', 'message' => 'Invalid refresh token'], 401);
            }
        } catch (Exception $e) {
            Log::error('Token Refresh Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Could not refresh token.',
                'error' => $e->getMessage()
            ], 401);
        }
    }

    public function logout(Request $request)
    {
        try {
            try {
                $accessToken = $request->bearerToken();
                if ($accessToken) {
                    JWTAuth::setToken($accessToken)->invalidate();
                }
            } catch (Exception $e) {
                // Already invalidated or error, ignore
            }
            if ($request->has('refresh_token')) {
                try {
                    JWTAuth::setToken($request->refresh_token)->invalidate();
                } catch (Exception $e) {
                    // Already invalidated or error, ignore
                }
            }
            return response()->json(['status' => 'success', 'message' => 'Successfully logged out']);
        } catch (Exception $e) {
            Log::error('Logout Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred during logout.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
