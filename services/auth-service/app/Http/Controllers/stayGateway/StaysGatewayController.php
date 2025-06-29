<?php

namespace App\Http\Controllers\stayGateway;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class StaysGatewayController extends Controller
{
    protected $staysServiceUrl;
    
    public function __construct()
    {
        // Get from environment variable
        $this->staysServiceUrl = env('STAYS_SERVICE_URL', 'http://localhost:8001/api');
    }
    
    /**
     * Forward any request to the stays-service with user ID added
     */
    protected function forwardRequest($method, $endpoint, Request $request, $params = [])
    {
        // Get authenticated user
        $user = Auth::user();
        
        // Prepare request data
        $data = $request->all();
        
        // Add user ID to the request data
        $data['user_id'] = $user->id;
        
        // Forward the request with user_id and original data
        $response = Http::withHeaders([
            'X-Gateway-Service' => 'auth-service',
            'X-User-ID' => $user->id,
            // Add any other needed headers
        ]);
        
        // Include files if present
        if ($request->hasFile('media')) {
            foreach ($request->file('media') as $index => $file) {
                $response = $response->attach("media[$index]", 
                    file_get_contents($file), 
                    $file->getClientOriginalName()
                );
            }
        }
        
        // Make the actual request to stays-service
        if ($method == 'get') {
            $response = $response->get($this->staysServiceUrl . $endpoint, $data);
        } else if ($method == 'post') {
            $response = $response->post($this->staysServiceUrl . $endpoint, $data);
        } else if ($method == 'put') {
            $response = $response->put($this->staysServiceUrl . $endpoint, $data);
        } else if ($method == 'delete') {
            $response = $response->delete($this->staysServiceUrl . $endpoint, $data);
        }
        
        // Return the response directly
        return response($response->body(), $response->status())
            ->withHeaders($response->headers());
    }
    
    /**
     * Get all stays
     */
    public function index(Request $request)
    {
        return $this->forwardRequest('get', '/stays', $request);
    }
    
    /**
     * Store a new stay
     */
    public function store(Request $request)
    {
        return $this->forwardRequest('post', '/stays', $request);
    }
    
    /**
     * Get a specific stay
     */
    public function show(Request $request, $id)
    {
        return $this->forwardRequest('get', "/stays/{$id}", $request);
    }
    
    /**
     * Update a stay
     */
    public function update(Request $request, $id)
    {
        return $this->forwardRequest('put', "/stays/{$id}", $request);
    }
    
    /**
     * Delete a stay
     */
    public function destroy(Request $request, $id)
    {
        return $this->forwardRequest('delete', "/stays/{$id}", $request);
    }
    
    /**
     * Get user's own stays
     */
    public function myStays(Request $request)
    {
        return $this->forwardRequest('get', '/my-stays', $request);
    }
}
