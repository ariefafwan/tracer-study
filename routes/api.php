<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BiodataController;
use App\Http\Controllers\Api\ClientWebsiteController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\Hasil\HasilController;
use App\Http\Controllers\Api\Hasil\StatistikController;
use App\Http\Controllers\Api\Konten\FAQController;
use App\Http\Controllers\Api\Konten\KontenWebsiteController;
use App\Http\Controllers\Api\Konten\LowonganController;
use App\Http\Controllers\Api\Master\AlumniController;
use App\Http\Controllers\Api\Master\DosenController;
use App\Http\Controllers\Api\Master\FakultasController;
use App\Http\Controllers\Api\Master\KategoriPertanyaanController;
use App\Http\Controllers\Api\Master\ProgramStudiController;
use App\Http\Controllers\Api\Pertanyaan\PertanyaanController;

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
Route::get('getAuthenticatedUser', [AuthController::class, 'getAuthenticatedUser']);

Route::group(['prefix' => 'client'], function () {
    Route::get('/profile', [ClientWebsiteController::class, 'index']);
    Route::get('/konten', [ClientWebsiteController::class, 'konten']);
    Route::get('/lowongan', [ClientWebsiteController::class, 'lowongan']);
    Route::get('/data', [ClientWebsiteController::class, 'data']);
    Route::get('/pertanyaan', [ClientWebsiteController::class, 'pertanyaan']);
    Route::get('/checkAlumni', [ClientWebsiteController::class, 'checkAlumni']);
    Route::get('/programstudi', [ClientWebsiteController::class, 'programstudi']);
    Route::post('/kuisioner', [ClientWebsiteController::class, 'kuisioner']);
    Route::get('/detail_lowongan/{id}', [ClientWebsiteController::class, 'detail_lowongan']);
});

Route::middleware(('jwt'))->group(function () {

    Route::group(['prefix' => 'dashboard'], function () {
        Route::get('/dashboard', [DashboardController::class, 'dashboard']);
        Route::get('/grafik_kuisioner', [DashboardController::class, 'grafik_kuisioner']);
        Route::get('/grafik_prodi_kuisioner', [DashboardController::class, 'grafik_prodi_kuisioner']);
    });

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

    Route::group(['prefix' => 'pertanyaan'], function () {
        Route::group(['prefix' => 'kategori-pertanyaan'], function () {
            Route::get('/', [KategoriPertanyaanController::class, 'index']);
            Route::post('/store', [KategoriPertanyaanController::class, 'store']);
            Route::get('/edit/{id}', [KategoriPertanyaanController::class, 'edit']);
            Route::post('/update', [KategoriPertanyaanController::class, 'update']);
            Route::delete('/delete/{id}', [KategoriPertanyaanController::class, 'delete']);
        });

        Route::group(['prefix' => 'pertanyaan'], function () {
            Route::get('/', [PertanyaanController::class, 'index']);
            Route::get('/create', [PertanyaanController::class, 'create']);
            Route::post('/store', [PertanyaanController::class, 'store']);
            Route::get('/data/{id}', [PertanyaanController::class, 'data']);
            Route::get('/edit/{id}', [PertanyaanController::class, 'edit']);
            Route::post('/update', [PertanyaanController::class, 'update']);
            Route::delete('/delete/{id}', [PertanyaanController::class, 'delete']);
        });
    });

    Route::group(['prefix' => 'hasil'], function () {
        Route::group(['prefix' => 'hasil'], function () {
            Route::get('/', [HasilController::class, 'index']);
            Route::get('/create', [HasilController::class, 'create']);
            Route::get('/show_hasil/{id}', [HasilController::class, 'show_hasil']);
            Route::delete('/delete/{id}', [HasilController::class, 'delete']);
        });

        Route::group(['prefix' => 'statistik'], function () {
            Route::get('/', [StatistikController::class, 'index']);
            Route::get('/statistik-per-kategori/{id_kategori}/{tahun_lulus}', [StatistikController::class, 'statistik_perkategori']);
            Route::get('/statistik-per-pertanyaan/{id_pertanyaan}/{tahun_lulus}', [StatistikController::class, 'statistik_perpertanyaan']);
        });
    });

    Route::group(['prefix' => 'konten'], function () {
        Route::group(['prefix' => 'lowongan'], function () {
            Route::get('/', [LowonganController::class, 'index']);
            Route::get('/data', [LowonganController::class, 'data']);
            Route::post('/store', [LowonganController::class, 'store']);
            Route::get('/edit/{id}', [LowonganController::class, 'edit']);
            Route::post('/update', [LowonganController::class, 'update']);
            Route::delete('/delete/{id}', [LowonganController::class, 'delete']);
        });

        Route::group(['prefix' => 'faq'], function () {
            Route::get('/', [FAQController::class, 'index']);
            Route::post('/store', [FAQController::class, 'store']);
            Route::get('/edit/{id}', [FAQController::class, 'edit']);
            Route::post('/update', [FAQController::class, 'update']);
            Route::delete('/delete/{id}', [FAQController::class, 'delete']);
        });

        Route::group(['prefix' => 'konten'], function () {
            Route::get('/', [KontenWebsiteController::class, 'index']);
            Route::post('/store', [KontenWebsiteController::class, 'store']);
            Route::get('/edit/{id}', [KontenWebsiteController::class, 'edit']);
            Route::post('/update', [KontenWebsiteController::class, 'update']);
            Route::delete('/delete/{id}', [KontenWebsiteController::class, 'delete']);
        });

        Route::group(['prefix' => 'profile'], function () {
            Route::get('/', [BiodataController::class, 'index']);
            Route::post('/store', [BiodataController::class, 'store']);
            Route::post('/update', [BiodataController::class, 'update']);
        });
    });
});
