<?php

namespace App\Http\Middleware;

use Closure;
use Exception;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class JwtMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            // Validate token and get authenticated user
            $user = JWTAuth::parseToken()->authenticate();
            
            // Store user in request for later use
            $request->auth = $user;
        } catch (Exception $e) {
            if ($e instanceof TokenInvalidException) {
                return response()->json(['status' => 'error', 'message' => 'Token is invalid'], 401);
            } else if ($e instanceof TokenExpiredException) {
                return response()->json(['status' => 'error', 'message' => 'Token is expired'], 401);
            } else {
                return response()->json(['status' => 'error', 'message' => 'Authorization token not found'], 401);
            }
        }
        
        return $next($request);
    }
}