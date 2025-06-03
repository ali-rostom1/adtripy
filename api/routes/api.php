<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Storage;


Route::prefix('v1')->group(function () {
    // testing s3 upload
    Route::post("/test-s3", function (Request $request) {
        try{
            Storage::disk('s3')->put('randomVideo.mp4',$request->file('video')->get());
            return response()->json([
                'status' => 'success',
                'message' => 'File uploaded successfully',
                'file_path' => Storage::disk('s3')->url('randomVideo.mp4')
            ]);
        }catch(\Exception $e){
            return response()->json([
                'status' => 'error',
                'message' => 'An error occurred',
                'error' => $e->getMessage()
            ], 500);
        }
    });

    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/refresh',[AuthController::class,'refresh']);

    Route::post('/send-code',[AuthController::class,'sendVerificationCode'])->middleware('auth');
    Route::post('/verify-phone',[AuthController::class,'verifyPhone'])->middleware('auth');


    // Email verification routes
    Route::post('/email/verification-notification', [AuthController::class, 'sendVerificationEmail'])
        ->middleware('auth:api')
        ->name('verification.send');
        
    Route::get('/verify-email/{token}', [AuthController::class, 'verify'])
        ->name('verification.verify');
});
