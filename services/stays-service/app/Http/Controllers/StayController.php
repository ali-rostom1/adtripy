<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreStayRequest;
use App\Http\Requests\UpdateStayRequest;
use App\Models\Stay;
use Illuminate\Http\JsonResponse;

class StayController extends Controller
{
    // GET /api/stays
    public function index(): JsonResponse
    {
        $stays = Stay::with(['location', 'category', 'amenities', 'media'])
                     ->paginate(15);

        return response()->json($stays);
    }

    // POST /api/stays
    public function store(StoreStayRequest $request): JsonResponse
    {
        // Get validated data
        $validatedData = $request->validated();
        
        // Create the stay
        $stay = Stay::create([
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
            'price_per_night' => $validatedData['price_per_night'],
            'max_guests' => $validatedData['max_guests'],
            'bedrooms' => $validatedData['bedrooms'],
            'bathrooms' => $validatedData['bathrooms'],
            'category_id' => $validatedData['category_id'],
            'host_id' => $validatedData['host_id'],
            'location_id' => $validatedData['location_id']
        ]);
        
        // Handle amenities
        if (isset($validatedData['amenities'])) {
            $stay->amenities()->sync($validatedData['amenities']);
        }
        
        // Handle media uploads
        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $index => $mediaFile) {
                // Generate a unique file name
                $fileName = time() . '_' . $index . '.' . $mediaFile->getClientOriginalExtension();
                
                // Store the file in the public/storage/stays directory
                $mediaPath = $mediaFile->storeAs('stays', $fileName, 'public');
                
                // Create a new media record
                $stay->media()->create([
                    'url' => '/storage/' . $mediaPath,
                    'type' => 'image',
                    'sort_order' => $index
                ]);
            }
        }
        
        // Return the created stay with its relationships
        return response()->json($stay->load(['location', 'amenities', 'media']), 201);
    }

    // GET /api/stays/{stay}
    public function show(Stay $stay): JsonResponse
    {
        $stay->load(['location', 'category', 'amenities', 'media']);
        return response()->json($stay);
    }

    // PUT/PATCH /api/stays/{stay}
    public function update(UpdateStayRequest $request, Stay $stay): JsonResponse
    {
        $data = $request->validated();

        $stay->update($data);

        // sync amenities if provided
        if (array_key_exists('amenities', $data)) {
            $stay->amenities()->sync($data['amenities'] ?? []);
        }

        // replace media if provided
        if (array_key_exists('media', $data)) {
            $stay->media()->delete();
            foreach ($data['media'] ?? [] as $item) {
                $stay->media()->create($item);
            }
        }

        $stay->load(['location', 'category', 'amenities', 'media']);
        return response()->json($stay);
    }

    // DELETE /api/stays/{stay}
    public function destroy(Stay $stay): JsonResponse
    {
        $stay->delete();
        return response()->json(null, 204);
    }
}
