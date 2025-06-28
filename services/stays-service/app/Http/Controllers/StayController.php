<?php

namespace App\Http\Controllers;

use App\Models\Stay;
use Illuminate\Http\Request;
use App\Http\Requests\StoreStayRequest;
use App\Http\Requests\UpdateStayRequest;
use App\Http\Resources\StayResource;
use App\Http\Resources\StayCollection;

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
        // This is a protected endpoint - auth is required
        $user = $request->auth; // User from JWT middleware
        
        // Create a new stay owned by the authenticated user
        $stay = new Stay($request->validated());
        $stay->host_id = $user->id;
        $stay->save();
        
        // Handle relationships (amenities, media, etc.)
        if ($request->has('amenities')) {
            $stay->amenities()->sync($request->amenities);
        }
        
        // Handle media uploads if any
        if ($request->hasFile('media')) {
            // Your media upload logic here
        }
        
        return new StayResource($stay->load(['location', 'category', 'amenities', 'media']));
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
        $user = $request->auth; // User from JWT middleware
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
        $user = $request->auth; // User from JWT middleware
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
        $user = $request->auth; // User from JWT middleware
        
        $stays = Stay::where('host_id', $user->id)
                    ->with(['location', 'category', 'amenities', 'media'])
                    ->paginate(10);
                    
        return new StayCollection($stays);
    }
}
