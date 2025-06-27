<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'              => 'sometimes|required|string|max:255',
            'description'        => 'sometimes|nullable|string',
            'price_per_day'      => 'sometimes|required|numeric|min:0',
            'seats'              => 'sometimes|required|integer|min:1',
            'doors'              => 'sometimes|required|integer|min:1',
            'transmission'       => 'sometimes|required|in:automatic,manual',
            'fuel_type'          => 'sometimes|required|in:petrol,diesel,electric,hybrid',
            'vehicle_category_id'=> 'sometimes|required|exists:vehicle_categories,id',
            'location_id'        => 'sometimes|required|exists:locations,id',
            'features'           => 'nullable|array',
            'features.*'         => 'integer|exists:vehicle_features,id',
            'media'              => 'nullable|array',
            'media.*.url'        => 'required_with:media|url',
            'media.*.type'       => 'in:image,video',
            'media.*.sort_order' => 'integer|min:0',
        ];
    }
}
