<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Biodata;
use App\Models\Faq;
use App\Models\Hasil\HasilLowongan;
use App\Models\Konten;
use App\Models\Master\MasterProgramStudi;
use Carbon\Carbon;
use Illuminate\Http\Request;

class ClientWebsiteController extends Controller
{
    public function index()
    {
        $profile = Biodata::first();
        return response(json_encode($profile), 200);
    }

    public function konten()
    {
        $konten = Konten::get();
        $lowongan = HasilLowongan::get();
        $faq = Faq::orderBy('urutan')->get();
        return response()->json(compact('konten', 'lowongan', 'faq'), 200);
    }

    public function lowongan()
    {
        $paginate = request('paginate', 10);
        $search_value = request('q', '');
        $ordering = request('ordering', '');
        $data = HasilLowongan::where('tanggal_selesai', '>=', Carbon::now()->format('Y-m-d'))
            ->when($ordering == 'A-Z' || $ordering == '', function ($q) {
                $q->orderBy('judul_lowongan', 'asc');
            })->when($ordering == 'Z-A', function ($q) {
                $q->orderBy('judul_lowongan', 'desc');
            })->search(trim($search_value))
            ->paginate($paginate);
        return response(json_encode($data), 200);
    }

    public function data()
    {
        $programstudi = MasterProgramStudi::get();
        $bidang_usaha = HasilLowongan::select('bidang_usaha')->distinct()->orderBy('bidang_usaha')->get();
        return response()->json(compact('bidang_usaha', 'programstudi'), 200);
    }
}
