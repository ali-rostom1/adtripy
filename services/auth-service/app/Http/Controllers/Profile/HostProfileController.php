<?php

namespace App\Http\Controllers\Profile;
use App\Http\Controllers\Controller;

use App\Models\Host;
use App\Models\User;
use Auth;
use Illuminate\Http\Request;

class HostProfileController extends Controller
{
    public function me(){
        try{
            $user = User::where('id', Auth::id())
                ->first();
            if($user->hostProfile() == Null){
                return response()->json([
                    'status' => 'error',
                    'message' => 'Host profile not found'
                ], 404);
            }
            return response()->json([
                'status' => 'success',
                'data' => $user->hostProfile()
            ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => 'Could not retrieve user profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function updateHostProfile(Request $request)
    {
        try{
            $validated = $request->validate([
            'business_name' => 'sometimes|string|max:255',
            ]);

            $profile = $request->user()->hostProfile()->firstOrFail();
            $profile->update($validated);

            return response()->json([
                'status' => 'success',
                'message' => 'Host profile updated successfully',
                'data' => $profile
            ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => 'Could not update host profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
