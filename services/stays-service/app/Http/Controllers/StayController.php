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
        $data = $request->validated();

        // create main record
        $stay = Stay::create($data);

        // attach amenities if present
        if (!empty($data['amenities'])) {
            $stay->amenities()->sync($data['amenities']);
        }

        // add media if present
        if (!empty($data['media'])) {
            foreach ($data['media'] as $item) {
                $stay->media()->create($item);
            }
        }

        // reload relations
        $stay->load(['location', 'category', 'amenities', 'media']);

        return response()->json($stay, 201);
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
