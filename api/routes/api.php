<?php

use App\Http\Controllers\HostAuthController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\Profile\GuestProfileController;
use App\Http\Controllers\Profile\HostProfileController;
use App\Http\Controllers\Profile\ProfileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Storage;


Route::prefix('v1')->group(function () {
    // testing s3 upload
    Route::post("/test-s3", function (Request $request) {
        try {
            Storage::disk('s3')->put('randomVideo.mp4', $request->file('video')->get());
            return response()->json([
                'status' => 'success',
                'message' => 'File uploaded successfully',
                'file_path' => Storage::disk('s3')->url('randomVideo.mp4')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred',
                'error' => $e->getMessage()
            ], 500);
        }
    });

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

    Route::post('/host/register', [HostAuthController::class,'register'])->middleware('auth:api');

    
    Route::post('/send-code', [AuthController::class, 'sendVerificationCode'])->middleware('auth');
    Route::post('/verify-phone', [AuthController::class, 'verifyPhone'])->middleware('auth');


    // Email verification routes
    Route::post('/email/verification-notification', [AuthController::class, 'sendVerificationEmail'])
        ->middleware('auth:api')
        ->name('verification.send');

    Route::get('/verify-email/{token}', [AuthController::class, 'verify'])
        ->name('verification.verify');


    // Password reset routes
    Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLinkEmail'])
        ->name('password.email');

    Route::post('/reset-password', [PasswordResetController::class, 'reset'])
        ->name('password.reset');

    // Own Profile routes
    Route::middleware('auth:api')->group(function () {
        Route::get('/me/guest-profile', [GuestProfileController::class, 'me']);
        Route::get('/me/host-profile', [HostProfileController::class, 'me']);

        
        Route::put('/profile/edit',[ProfileController::class, 'update']);

        // Profile picture routes
        Route::post('/profile/picture', [ProfileController::class, 'editPfp']);
        Route::delete('/profile/picture', [ProfileController::class, 'deletePfp']);
    });
    
    //Other Profiles routes
    Route::get('/profile/host/{id}', [HostProfileController::class, 'show']);

});
