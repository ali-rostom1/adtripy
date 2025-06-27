<?php

namespace App\Http\Controllers;

use App\Models\HostProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class HostController extends Controller
{
    public function becomeHost(Request $request)
    {
        $user = Auth::user();
        
        try {
            // Step 1: Verify eligibility
            $this->validateHostUpgrade($user);
            
            // Step 2: Validate host-specific data
            $validated = $request->validate([
                'business_name' => 'required|string|max:255',
                'tax_id'       => 'required|string|max:50|unique:host_profiles,tax_id',
                'bank_account'  => 'required|string',
            ]);

            // Step 3: Atomic transaction
            DB::transaction(function () use ($user, $validated) {
                // Create host profile
                $hostProfile = HostProfile::create([
                    'id' => Str::orderedUuid(),
                    'business_name' => $validated['business_name'],
                    'tax_id' => $validated['tax_id'], // Will be auto-encrypted by model cast
                    'bank_account' => $validated['bank_account'], // Will be auto-encrypted
                    'verification_status' => 'pending',
                ]);

                // Link to user via polymorphic profile
                $user->profiles()->create([
                    'id' => Str::orderedUuid(),
                    'profileable_id' => $hostProfile->id,
                    'profileable_type' => HostProfile::class,
                ]);

                // Assign host role
                $user->assignRole('host');
            });

            return response()->json([
                'status' => 'success',
                'message' => 'Host profile submitted for verification',
                'data' => [
                    'business_name' => $validated['business_name'],
                    'status' => 'pending'
                ]
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], $e->getCode() === 403 ? 403 : 400);
        }
    }

    private function validateHostUpgrade(User $user): void
    {
        if ($user->hasRole('host')) {
            abort(403, 'You are already a host!');
        }

    }
}