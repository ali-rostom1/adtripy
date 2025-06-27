<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreVehicleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'host_id'            => 'required|integer',
            'title'              => 'required|string|max:255',
            'description'        => 'nullable|string',
            'price_per_day'      => 'required|numeric|min:0',
            'seats'              => 'required|integer|min:1',
            'doors'              => 'required|integer|min:1',
            'transmission'       => 'required|in:automatic,manual',
            'fuel_type'          => 'required|in:petrol,diesel,electric,hybrid',
            'vehicle_category_id'=> 'required|exists:vehicle_categories,id',
            'location_id'        => 'required|exists:locations,id',
            'features'           => 'nullable|array',
            'features.*'         => 'integer|exists:vehicle_features,id',
            'media'              => 'nullable|array',
            'media.*.url'        => 'required_with:media|url',
            'media.*.type'       => 'in:image,video',
            'media.*.sort_order' => 'integer|min:0',
        ];
    }
}
