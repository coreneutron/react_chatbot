<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserRoleController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ScenarioController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\SettingController;

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
Route::get('/getStory', [ScenarioController::class, 'getStory']);
Route::apiResource('settings', SettingController::class);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('users', UserController::class);
    Route::apiResource('roles', RoleController::class);
    Route::apiResource('user-role', UserRoleController::class);
    Route::apiResource('scenarios', ScenarioController::class);
    Route::post('/updateScenario', [ScenarioController::class, 'updateScenario']);
    Route::post('/updateScenarioStatus', [ScenarioController::class, 'updateScenarioStatus']);
    Route::apiResource('questions', QuestionController::class);
    Route::post('/getQuestionsById', [QuestionController::class, 'getQuestionsById']);
    Route::post('/updateSettingBotAvatar', [SettingController::class, 'updateSettingBotAvatar']);

    Route::post('/changePwd', [AuthController::class, 'changePwd']);
    Route::get('/logout', [AuthController::class, 'logout']);

    
});


Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    $user = $request->user();
    $user['role'] = $user->roles[0]->id;
    return $user;
});
