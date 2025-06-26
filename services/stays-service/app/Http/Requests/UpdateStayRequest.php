<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateStayRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        // same as store, but all fields optional
        return [
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|nullable|string',
            'price_per_night' => 'sometimes|required|numeric|min:0',
            'max_guests' => 'sometimes|required|integer|min:1',
            'location_id' => 'sometimes|required|exists:locations,id',
            'category_id' => 'sometimes|required|exists:categories,id',
            'amenities' => 'nullable|array',
            'amenities.*' => 'integer|exists:amenities,id',
            'media' => 'nullable|array',
            'media.*.url' => 'required_with:media|url',
            'media.*.type' => 'in:image,video',
            'media.*.sort_order' => 'integer|min:0',
        ];
    }
}
