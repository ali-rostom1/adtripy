<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class StayResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'price_per_night' => (float)$this->price_per_night,
            'max_guests' => $this->max_guests,
            'bedrooms' => $this->bedrooms,
            'bathrooms' => $this->bathrooms,
            'category' => $this->whenLoaded('category', function() {
                return [
                    'id' => $this->category->id,
                    'name' => $this->category->name,
                ];
            }),
            'location' => $this->whenLoaded('location', function() {
                return [
                    'id' => $this->location->id,
                    'address' => $this->location->address,
                    'city' => $this->location->city,
                    'state' => $this->location->state,
                    'country' => $this->location->country,
                    'postal_code' => $this->location->postal_code,
                    'latitude' => $this->location->latitude,
                    'longitude' => $this->location->longitude,
                ];
            }),
            'host_id' => $this->host_id,
            'amenities' => $this->whenLoaded('amenities', function() {
                return $this->amenities->map(function($amenity) {
                    return [
                        'id' => $amenity->id,
                        'name' => $amenity->name,
                    ];
                });
            }),
            'media' => $this->whenLoaded('media', function() {
                return $this->media->map(function($media) {
                    return [
                        'id' => $media->id,
                        'url' => $media->url,
                        'type' => $media->type,
                    ];
                });
            }),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}