<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserRoleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RoutingController;
use App\Http\Controllers\TraderController;
use App\Http\Controllers\ClipboardController;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::post('/login', [AuthController::class, 'login'])->name('login.api');
Route::post('/register', [AuthController::class, 'register'])->name('register.api');
Route::get('/logout', [AuthController::class, 'logout']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('users', UserController::class);
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('user-role', UserRoleController::class);
    Route::post('/changePwd', [AuthController::class, 'changePwd']);    
});


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    $user = $request->user();
    $user['role'] = $user->roles[0]->id;
    return $user;
});
