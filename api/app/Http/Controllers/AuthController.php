<?php

namespace App\Http\Controllers;

use App\Mail\VerifyEmail;
use App\Models\Guest;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Mail;
use Str;
use Tymon\JWTAuth\Facades\JWTAuth;
use Twilio\Rest\Client;
use Exception;
use URL;

class AuthController extends Controller
{
    /**
     * Send verification email with a signed URL
     */
    public function sendVerificationEmail(Request $request)
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthenticated'
            ], 401);
        }

        if ($user->email_verified_at) {
            return response()->json([
                'status' => 'error',
                'message' => 'Email already verified'
            ], 400);
        }

        try {
            // Generate a unique token
            $token = Str::random(60);

            // Store token in cache with user ID for 24 hours
            Cache::put('email_verify_' . $token, $user->id, now()->addHours(24));

            // Generate verification URL
            $verificationUrl = URL::to('/api/verify-email/' . $token);

            // Send email
            Mail::to($user->email)->send(new VerifyEmail($user, $verificationUrl));

            return response()->json([
                'status' => 'success',
                'message' => 'Verification email sent'
            ]);
        } catch (Exception $e) {
            Log::error('Email Verification Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Could not send verification email',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Verify email with token
     */
    public function verify($token)
    {
        // Get user ID from cache
        $userId = Cache::get('email_verify_' . $token);
        if (!$userId) {
            return response()->json([
                'status' => 'error',
                'message' => 'Invalid or expired verification link'
            ], 400);
        }

        // Find user
        $user = User::find($userId);

        if (!$user) {
            return response()->json([
                'status' => 'error',
                'message' => 'User not found'
            ], 404);
        }

        // Mark email as verified
        if (!$user->email_verified_at) {
            $user->email_verified_at = now();
            $user->save();
        }
        if($user->phone_verified_at) {
            if($user->hasRole('unverified-guest')) {
                $user->syncRoles(['verified-guest']);
            } else if($user->hasRole('unverified-host')) {
                $user->syncRoles(['verified-host']);
            }
        }

        // Remove token from cache
        Cache::forget('email_verify_' . $token);

        // Redirect to frontend verification success page
        return response()->json([
            'status' => 'success',
            'message' => 'Email verified successfully'
        ]);
    }


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

            if($user->email_verified_at){
                if($user->hasRole('unverified-guest')) {
                    $user->syncRoles(['verified-guest']);
                } else if($user->hasRole('unverified-host')) {
                    $user->syncRoles(['verified-host']);
                }
            }
            Cache::forget('verify_' . $request->phone);
            return response()->json(['status' => 'success', 'message' => 'Phone verified successfully.']);
        }
        return response()->json(['status' => 'error', 'message' => 'Invalid or expired verification code.'], 400);
    }

    public function register(Request $request)
    {
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
            $user->syncRoles(['unverified-guest']);
            $guest = Guest::create([
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
