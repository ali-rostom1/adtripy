<?php

namespace App\Http\Controllers;

use App\Models\Stay;
use Illuminate\Http\Request;
use App\Http\Requests\StoreStayRequest;
use App\Http\Requests\UpdateStayRequest;
use App\Http\Resources\StayResource;
use App\Http\Resources\StayCollection;
use Illuminate\Support\Facades\Auth;

class StayController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // Public endpoint - no auth required
        $query = Stay::query()->with(['location', 'category', 'amenities', 'media']);
        
        // Add filtering logic here if needed
        
        $stays = $query->paginate(10);
        return new StayCollection($stays);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreStayRequest $request)
    {
        try {
            // Get the user ID from the request (set by middleware)
            $userId = $request->user_id;
            
            if (!$userId) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'User authentication failed'
                ], 401);
            }
            
            // Log all incoming data for debugging
            \Log::info('Creating stay with request data:', [
                'user_id' => $userId,
                'validated_data' => $request->validated(),
                'has_files' => $request->hasFile('media'),
            ]);
            
            // Create a new stay owned by the authenticated user
            try {
                $stay = new Stay($request->validated());
                $stay->host_id = $userId;
                $stay->save();
            } catch (\Exception $e) {
                \Log::error('Error saving stay: ' . $e->getMessage(), [
                    'exception' => get_class($e),
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'trace' => $e->getTraceAsString()
                ]);
                throw $e;
            }
            
            // Handle relationships (amenities, media, etc.)
            try {
                if ($request->has('amenities')) {
                    $stay->amenities()->sync($request->amenities);
                }
            } catch (\Exception $e) {
                \Log::error('Error saving amenities: ' . $e->getMessage());
                // Continue execution - don't fail the whole request for amenities
            }
            
            // Handle media uploads if any
            if ($request->hasFile('media')) {
                try {
                    // Simple file saving for now
                    foreach ($request->file('media') as $index => $file) {
                        $path = $file->store('stays/' . $stay->id, 'public');
                        
                        // Create media record
                        $stay->media()->create([
                            'path' => $path,
                            'type' => 'image',
                            'order' => $index
                        ]);
                    }
                } catch (\Exception $e) {
                    \Log::error('Error processing media uploads: ' . $e->getMessage());
                    // Don't fail the request if media upload fails
                }
            }
            
            return new StayResource($stay->load(['location', 'category', 'amenities', 'media']));
        } catch (\Exception $e) {
            \Log::error('Error creating stay: ' . $e->getMessage(), [
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to create stay: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        // Public endpoint - no auth required
        $stay = Stay::with(['location', 'category', 'amenities', 'media'])->findOrFail($id);
        return new StayResource($stay);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateStayRequest $request, string $id)
    {
        // This is a protected endpoint - auth is required
        $user = Auth::user(); // Changed from $request->auth
        $stay = Stay::findOrFail($id);
        
        // Check if the authenticated user owns this stay
        if ($stay->host_id != $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You are not authorized to update this stay'
            ], 403);
        }
        
        // Update the stay
        $stay->update($request->validated());
        
        // Handle relationships
        if ($request->has('amenities')) {
            $stay->amenities()->sync($request->amenities);
        }
        
        // Handle media updates if any
        if ($request->hasFile('media')) {
            // Your media update logic here
        }
        
        return new StayResource($stay->load(['location', 'category', 'amenities', 'media']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, string $id)
    {
        // This is a protected endpoint - auth is required
        $user = Auth::user(); // Changed from $request->auth
        $stay = Stay::findOrFail($id);
        
        // Check if the authenticated user owns this stay
        if ($stay->host_id != $user->id) {
            return response()->json([
                'status' => 'error',
                'message' => 'You are not authorized to delete this stay'
            ], 403);
        }
        
        // Delete the stay
        $stay->delete();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Stay deleted successfully'
        ]);
    }
    
    /**
     * Get stays owned by the authenticated user.
     */
    public function myStays(Request $request)
    {
        // This is a protected endpoint - auth is required
        $user = Auth::user(); // Changed from $request->auth
        
        $stays = Stay::where('host_id', $user->id)
                    ->with(['location', 'category', 'amenities', 'media'])
                    ->paginate(10);
                    
        return new StayCollection($stays);
    }
}
