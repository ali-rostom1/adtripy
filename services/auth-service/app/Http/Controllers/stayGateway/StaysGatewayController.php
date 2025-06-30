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
        // No /api needed in the URL because we're manually prefixing the routes
        $this->staysServiceUrl = env('STAYS_SERVICE_URL', 'http://localhost:8001/api');
    }
    
    /**
     * Forward request to stays service with proper file handling
     */
    protected function forwardRequest($method, $endpoint, Request $request)
    {
        try {
            // Build HTTP request with basic headers
            $httpRequest = Http::withHeaders([
                'X-Gateway-Service' => 'auth-service',
                'Accept' => 'application/json'
            ]);
            
            // If user is authenticated, add user headers
            $user = Auth::user();
            if ($user) {
                $httpRequest = $httpRequest->withHeaders([
                    'X-User-ID' => $user->id,
                    'X-User-Email' => $user->email,
                ]);
                
                // Add user_id to data for POST/PUT requests
                if (in_array(strtolower($method), ['post', 'put'])) {
                    $data = $request->all();
                    $data['user_id'] = $user->id;
                    $request->merge($data);
                }
            }
            
            // Add token to forwarded request if present
            $token = $request->bearerToken();
            if ($token) {
                $httpRequest = $httpRequest->withToken($token);
            }
            
            // Handle file uploads
            if ($request->hasFile('media')) {
                // For multipart requests with files
                $formData = [];
                
                // Add all fields except files
                foreach ($request->except('media') as $key => $value) {
                    if (is_array($value)) {
                        foreach ($value as $k => $v) {
                            $formData[] = [
                                'name' => "{$key}[{$k}]",
                                'contents' => $v
                            ];
                        }
                    } else {
                        $formData[] = [
                            'name' => $key,
                            'contents' => $value
                        ];
                    }
                }
                
                // Add user_id
                $formData[] = [
                    'name' => 'user_id',
                    'contents' => $user->id
                ];
                
                // Add each file
                foreach ($request->file('media') as $index => $file) {
                    $formData[] = [
                        'name' => "media[{$index}]",
                        'contents' => fopen($file->getRealPath(), 'r'),
                        'filename' => $file->getClientOriginalName()
                    ];
                }
                
                // Make the request with multipart form data
                $response = $httpRequest->asMultipart()->post(
                    $this->staysServiceUrl . $endpoint, 
                    $formData
                );
            } else {
                // Regular JSON request
                $data = $request->all();
                $data['user_id'] = $user->id;
                
                // Make the request based on HTTP method
                switch ($method) {
                    case 'get':
                        $response = $httpRequest->get($this->staysServiceUrl . $endpoint, $data);
                        break;
                    case 'post':
                        $response = $httpRequest->post($this->staysServiceUrl . $endpoint, $data);
                        break;
                    case 'put':
                        $response = $httpRequest->put($this->staysServiceUrl . $endpoint, $data);
                        break;
                    case 'delete':
                        $response = $httpRequest->delete($this->staysServiceUrl . $endpoint, $data);
                        break;
                    default:
                        throw new \Exception("Unsupported HTTP method: {$method}");
                }
            }
            
            // Log the response
            \Log::info('Stays service response', [
                'status' => $response->status(),
                'body_preview' => substr($response->body(), 0, 500) // First 500 chars
            ]);
            
            // Return the response as-is
            return response($response->body(), $response->status())
                ->withHeaders($response->headers());
        } catch (\Exception $e) {
            \Log::error('Error forwarding request', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine()
            ]);
            
            return response()->json([
                'status' => 'error',
                'message' => 'Gateway error: ' . $e->getMessage()
            ], 500);
        }
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
    
    /**
     * Get all stay categories
     */
    public function categories(Request $request)
    {
        return $this->forwardRequest('get', '/categories', $request);
    }

    /**
     * Get all stay amenities
     */
    public function amenities(Request $request)
    {
        return $this->forwardRequest('get', '/amenities', $request);
    }
}
