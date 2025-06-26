<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreStayRequest extends FormRequest
{
    public function authorize(): bool
    {
        // we assume auth + permissions done upstream
        return true;
    }

    public function rules(): array
    {
        return [
            'host_id' => 'required|integer',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price_per_night' => 'required|numeric|min:0',
            'max_guests' => 'required|integer|min:1',
            'location_id' => 'required|exists:locations,id',
            'category_id' => 'required|exists:categories,id',
            'amenities' => 'nullable|array',
            'amenities.*' => 'integer|exists:amenities,id',
            'media' => 'nullable|array',
            'media.*.url' => 'required_with:media|url',
            'media.*.type' => 'in:image,video',
            'media.*.sort_order' => 'integer|min:0',
        ];
    }
}
// This request class validates the data for creating a new stay.