<?php

namespace App\Http\Controllers\Profile;
use App\Http\Controllers\Controller;

use App\Models\Guest;
use Auth;
use Illuminate\Http\Request;

class GuestProfileController extends Controller
{
    public function me(){
        try{
            $guest = Guest::with('user')->where('user_id',Auth::id())->first();
            return response()->json([
                'status' => 'success',
                'data' => $guest,
            ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => 'Could not retrieve user profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
