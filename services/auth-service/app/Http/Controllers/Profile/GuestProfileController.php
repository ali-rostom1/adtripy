<?php

namespace App\Http\Controllers\Profile;
use App\Http\Controllers\Controller;

use App\Models\Guest;
use App\Models\User;
use Auth;
use Illuminate\Http\Request;

class GuestProfileController extends Controller
{
    public function me(){
        try{
            $user = User::where('id', Auth::id())
                ->first();
            return response()->json([
                'status' => 'success',
                'data' => $user->guestProfile(),
            ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => 'Could not retrieve user profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function updateGuestProfile(Request $request)
    {
        try{
            $validated = $request->validate([
                'preferred_language' => 'sometimes|string|size:2',
                'payment_methods' => 'sometimes|array',
                'payment_methods.*' => 'string|in:paypal,credit_card,apple_pay'
            ]);

            $profile = $request->user()->guestProfile()->firstOrFail();
            $profile->update($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Guest profile updated successfully',
                'data' => $profile
            ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => 'Could not update guest profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
