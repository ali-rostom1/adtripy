<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Accommodation;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class StayController extends Controller
{
    public function store(Request $request)
    {
        // Debug incoming request
        Log::info('[STAYS] Received request data:', [
            'has_user_id' => $request->has('user_id'),
            'user_id' => $request->user_id ?? 'NULL',
            'method' => $request->method(),
            'content_type' => $request->header('Content-Type'),
            'all_data' => $request->all()
        ]);

        // Validate with explicit user_id requirement
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price_per_night' => 'required|numeric',
            'max_guests' => 'required|integer',
            'location_id' => 'required|exists:locations,id',
            'category_id' => 'required|exists:categories,id',
            'amenities' => 'nullable|array',
            'media' => 'nullable|array',
        ]);

        if ($validator->fails()) {
            Log::error('[STAYS] Validation failed:', [
                'errors' => $validator->errors()->toArray()
            ]);
            return response()->json([
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();
        Log::info('[STAYS] Validated data:', ['user_id' => $validated['user_id']]);

        try {
            $accommodation = Accommodation::create([
                'user_id' => $validated['user_id'],
                'title' => $validated['title'],
                'description' => $validated['description'],
                'price_per_night' => $validated['price_per_night'],
                'max_guests' => $validated['max_guests'],
                'location_id' => $validated['location_id'],
                'category_id' => $validated['category_id'],
                'amenities' => isset($validated['amenities']) ? json_encode($validated['amenities']) : null,
                'media' => isset($validated['media']) ? json_encode($validated['media']) : null,
            ]);

            Log::info('[STAYS] Accommodation created successfully:', [
                'id' => $accommodation->id,
                'user_id' => $accommodation->user_id
            ]);

            return response()->json([
                'message' => 'Accommodation created successfully!',
                'data' => $accommodation
            ], 201);
        } catch (\Exception $e) {
            Log::error('[STAYS] Error creating accommodation:', [
                'error' => $e->getMessage(),
                'user_id_was' => $validated['user_id'] ?? null
            ]);
            
            return response()->json([
                'message' => 'Failed to create accommodation: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
