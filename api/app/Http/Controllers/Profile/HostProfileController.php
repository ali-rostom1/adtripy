<?php

namespace App\Http\Controllers\Profile;
use App\Http\Controllers\Controller;

use App\Models\Host;
use Auth;
use Illuminate\Http\Request;

class HostProfileController extends Controller
{
    public function me(){
        try{
            $host = Host::with('user')->where('user_id', Auth::id())->first();
            return response()->json([
                'status' => 'success',
                'data' => $host
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
