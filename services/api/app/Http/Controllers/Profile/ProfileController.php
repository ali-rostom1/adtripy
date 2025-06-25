<?php

namespace App\Http\Controllers\Profile;
use App\Http\Controllers\Controller;

use App\Models\Host;
use Auth;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    public function editPfp(Request $request){
        try {
            // Validate the uploaded file
            $validator = Validator::make($request->all(), [
                'pfp' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = Auth::user();

            // Generate unique filename
            $file = $request->file('pfp');
            // Upload to S3
            $path = Storage::disk('s3')->putFileAs('profile_pictures/' . $user->id, $file, name:'pfp.' . $file->getClientOriginalExtension());

            // Update user's profile picture path in database
            $user->pfp_path = config('app.aws_url') . $path;
            $user->save();


            return response()->json([
                'status' => 'success',
                'message' => 'Profile picture updated successfully',
                'user' => $user,
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Could not update profile picture',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    /**
     * Delete profile picture
     */
    public function deletePfp(){
        try {
            $user = Auth::user();
            
            if (!$user->pfp_path) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No profile picture to delete'
                ], 404);
            }

            // Delete from S3
            Storage::disk('s3')->delete($user->pfp_path);

            // Update user record
            $user->pfp_path = null;
            $user->save();

            return response()->json([
                'status' => 'success',
                'message' => 'Profile picture deleted successfully',
                'user' => $user
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Could not delete profile picture',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function update(Request $request){
        try{
            $request->validate([
                'firstName' => 'nullable|string|max:255',
                'lastName' => 'nullable|string|max:255',
                'birth_date' => 'nullable|date',
                'city' => 'nullable|string|max:100',
                'country' => 'nullable|string|max:100',
            ]);
            $user = Auth::user();
            $user->update($request->all());
            $user->refresh();

            return response()->json([
                'status' => 'success',
                'data' => $user,
            ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => 'Could not update user profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
