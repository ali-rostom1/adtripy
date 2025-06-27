<?php

namespace App\Http\Controllers;

use App\Models\Vehicle;
use App\Http\Requests\StoreVehicleRequest;
use App\Http\Requests\UpdateVehicleRequest;
use Illuminate\Http\JsonResponse;

class VehicleController extends Controller
{
    public function index(): JsonResponse
    {
        $vehicles = Vehicle::with(['category', 'location', 'features', 'media'])
                           ->paginate(15);
        return response()->json($vehicles);
    }

    public function store(StoreVehicleRequest $request): JsonResponse
    {
        $data = $request->validated();

        $vehicle = Vehicle::create($data);

        if (!empty($data['features'])) {
            $vehicle->features()->sync($data['features']);
        }

        if (!empty($data['media'])) {
            foreach ($data['media'] as $item) {
                $vehicle->media()->create($item);
            }
        }

        $vehicle->load(['category', 'location', 'features', 'media']);
        return response()->json($vehicle, 201);
    }

    public function show(Vehicle $vehicle): JsonResponse
    {
        $vehicle->load(['category', 'location', 'features', 'media']);
        return response()->json($vehicle);
    }

    public function update(UpdateVehicleRequest $request, Vehicle $vehicle): JsonResponse
    {
        $data = $request->validated();
        $vehicle->update($data);

        if (array_key_exists('features', $data)) {
            $vehicle->features()->sync($data['features'] ?? []);
        }

        if (array_key_exists('media', $data)) {
            $vehicle->media()->delete();
            foreach ($data['media'] ?? [] as $item) {
                $vehicle->media()->create($item);
            }
        }

        $vehicle->load(['category', 'location', 'features', 'media']);
        return response()->json($vehicle);
    }

    public function destroy(Vehicle $vehicle): JsonResponse
    {
        $vehicle->delete();
        return response()->json(null, 204);
    }
}
