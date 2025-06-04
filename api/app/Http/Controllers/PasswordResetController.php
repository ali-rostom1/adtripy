<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use App\Mail\ResetPassword;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;


class PasswordResetController extends Controller
{
    /**
     * Send password reset link to the given user.
     */
    public function sendResetLinkEmail(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ], [
            'email.exists' => 'No user found with this email address.',
        ]);

        try {
            // Generate token
            $token = Str::random(64);
            
            // Store token in database
            DB::table('password_reset_tokens')->updateOrInsert(
                ['email' => $request->email],
                [
                    'email' => $request->email,
                    'token' => $token,
                    'created_at' => Carbon::now()
                ]
            );
            
            // Send email with reset link
            Mail::to($request->email)->send(new ResetPassword($token, $request->email));
            
            return response()->json([
                'status' => 'success',
                'message' => 'Password reset link sent to your email'
            ]);
        } catch (\Exception $e) {
            Log::error('Password Reset Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Could not send reset link',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Validate token and reset password.
     */
    public function reset(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'token' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ]);
        
        try {
            // Get the reset record from the database
            $resetRecord = DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->where('token', $request->token)
                ->first();
            
            // Check if token exists and is valid
            if (!$resetRecord) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid token'
                ], 400);
            }
            
            // Check if token is expired (older than 60 minutes)
            if (Carbon::parse($resetRecord->created_at)->addMinutes(60)->isPast()) {
                DB::table('password_reset_tokens')->where('email', $request->email)->delete();
                return response()->json([
                    'status' => 'error',
                    'message' => 'Token has expired'
                ], 400);
            }
            
            // Update the user's password
            $user = User::where('email', $request->email)->first();
            $user->password = Hash::make($request->password);
            $user->save();
            
            // Delete the token
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Password has been reset successfully'
            ]);
        } catch (\Exception $e) {
            Log::error('Password Reset Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Could not reset password',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

