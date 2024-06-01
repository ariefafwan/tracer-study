<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Master\AlumniController;
use App\Http\Controllers\Api\Master\DosenController;
use App\Http\Controllers\Api\Master\FakultasController;
use App\Http\Controllers\Api\Master\ProgramStudiController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::post('login', [AuthController::class, 'login']);

Route::middleware(('jwt'))->group(function () {

    Route::group(['prefix' => 'pengguna'], function () {
        Route::group(['prefix' => 'alumni'], function () {
            Route::get('/', [AlumniController::class, 'index']);
            Route::get('/create', [AlumniController::class, 'create']);
            Route::post('/store', [AlumniController::class, 'store']);
            Route::get('/edit/{id}', [AlumniController::class, 'edit']);
            Route::post('/update', [AlumniController::class, 'update']);
            Route::post('/update_status', [AlumniController::class, 'update_status']);
            Route::delete('/delete/{id}', [AlumniController::class, 'delete']);
        });

        Route::group(['prefix' => 'dosen'], function () {
            Route::get('/', [DosenController::class, 'index']);
            Route::get('/create', [DosenController::class, 'create']);
            Route::post('/store', [DosenController::class, 'store']);
            Route::get('/edit/{id}', [DosenController::class, 'edit']);
            Route::post('/update', [DosenController::class, 'update']);
            Route::post('/update_status', [DosenController::class, 'update_status']);
            Route::delete('/delete/{id}', [DosenController::class, 'delete']);
        });
    });

    Route::group(['prefix' => 'data-master'], function () {
        Route::group(['prefix' => 'fakultas'], function () {
            Route::get('/', [FakultasController::class, 'index']);
            Route::post('/store', [FakultasController::class, 'store']);
            Route::get('/edit/{id}', [FakultasController::class, 'edit']);
            Route::post('/update', [FakultasController::class, 'update']);
            Route::delete('/delete/{id}', [FakultasController::class, 'delete']);
        });

        Route::group(['prefix' => 'prodi'], function () {
            Route::get('/', [ProgramStudiController::class, 'index']);
            Route::post('/store', [ProgramStudiController::class, 'store']);
            Route::get('/create', [ProgramStudiController::class, 'create']);
            Route::get('/edit/{id}', [ProgramStudiController::class, 'edit']);
            Route::post('/update', [ProgramStudiController::class, 'update']);
            Route::delete('/delete/{id}', [ProgramStudiController::class, 'delete']);
        });
    });
});
