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
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price_per_night' => 'required|numeric|min:0',
            'max_guests' => 'required|integer|min:1',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'host_id' => 'required|exists:users,id',
            'location_id' => 'required|exists:locations,id',
            'amenities' => 'nullable|array',
            'amenities.*' => 'integer|exists:amenities,id',
            'media' => 'nullable|array',
            'media.*' => 'image|mimes:jpeg,png,jpg,gif|max:10240', // Allow image files up to 10MB
        ];
    }
}
// This request class validates the data for creating a new stay.