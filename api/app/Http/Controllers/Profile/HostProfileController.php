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
    public function show(String $id){
        try{
            $host = Host::with(['user' => function($query) {
                $query->select([
                    'id',
                    'firstName', 
                    'lastName',
                    'city',
                    'country',
                    'pfp_path',
                    'created_at' // Join date/member since
                ]);
            }])->where('user_id', $id)->first();
            
            if(!$host){
                return response()->json([
                    'status' => 'error',
                    'message' => 'Host not found'
                ], 404);
            }

            if ($host && $host->user) {
                $host->user->append('age');
            }

            return response()->json([
                'status' => 'success',
                'data' => $host
            ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => 'Could not retrieve host profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
