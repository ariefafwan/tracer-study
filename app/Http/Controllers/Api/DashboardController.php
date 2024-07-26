<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Hasil\HasilJawaban;
use App\Models\Hasil\HasilKuisioner;
use App\Models\Master\MasterAlumni;
use App\Models\Master\MasterDosen;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function dashboard(Request $request)
    {
        $total_alumni = MasterAlumni::where('status', 'Aktif')->count();
        $total_dosen = MasterDosen::where('status', 'Aktif')->count();
        return response()->json(compact('total_alumni', 'total_dosen'));
    }
    public function grafik_kuisioner(Request $request)
    {
        $filterbulan = request('filterbulan', 12);
        if ($filterbulan == '12') {
            $label = Carbon::now()->firstOfMonth()->subMonth(11)->addDay(1)->monthsUntil(now());
            $data = HasilKuisioner::whereDate('tanggal_pengisian', '>', Carbon::now()->firstOfMonth()->subMonth(12))
                ->selectRaw('year(tanggal_pengisian) as tahun, month(tanggal_pengisian) as month, count(DISTINCT id_alumni) as jumlah')
                ->groupBy('tahun', 'month')
                ->orderBy('tahun', 'desc')
                ->orderBy('month', 'desc')
                ->get();
        } else if ($filterbulan == '3') {
            $label = Carbon::now()->firstOfMonth()->subMonth(2)->addDay(1)->monthsUntil(now());
            $data = HasilKuisioner::whereDate('tanggal_pengisian', '>', Carbon::now()->firstOfMonth()->subMonth(3))
                ->selectRaw('year(tanggal_pengisian) as tahun, month(tanggal_pengisian) as month, count(DISTINCT id_alumni) as jumlah')
                ->groupBy('tahun', 'month')
                ->orderBy('tahun', 'desc')
                ->orderBy('month', 'desc')
                ->get();
        } else if ($filterbulan == '1') {
            $start = Carbon::parse(Carbon::now())->firstOfMonth()->subSecond(1)->addDay(1);
            $end = Carbon::parse(Carbon::now())->endOfMonth();

            while ($start->lte($end)) {
                $label[] = $start->copy();
                $start->addDay();
            }

            $data = HasilKuisioner::whereMonth('tanggal_pengisian', Carbon::now()->month)
                ->selectRaw('Date(tanggal_pengisian) hari, count(DISTINCT id_alumni) as jumlah')
                ->groupBy('hari')
                ->orderBy('hari', 'desc')
                ->get();
        } else if ($filterbulan == '15') {
            $label = Carbon::now()->startOfDay()->subDay(14)->subSecond(1)->addDay(1)->daysUntil(now()->addDay(1));
            $data = HasilKuisioner::whereDate('tanggal_pengisian', '>', Carbon::now()->subDay(15))
                ->selectRaw('Date(tanggal_pengisian) hari, count(DISTINCT id_alumni) as jumlah')
                ->groupBy('hari')
                ->orderBy('hari', 'desc')
                ->get();
        } else if ($filterbulan == '7') {
            $label = Carbon::now()->startOfDay()->subDay(6)->subSecond(1)->addDay(1)->daysUntil(now()->addDay(1));
            $data = HasilKuisioner::whereDate('tanggal_pengisian', '>', Carbon::now()->subDay(7))
                ->selectRaw('Date(tanggal_pengisian) hari, count(DISTINCT id_alumni) as jumlah')
                ->groupBy('hari')
                ->orderBy('hari', 'desc')
                ->get();
        }

        return response()->json(compact('data', 'label'), 200);
    }

    public function grafik_prodi_kuisioner(Request $request)
    {
        $filterbulan = request('filterbulan', 12);
        if ($filterbulan == '12') {
            $data = HasilKuisioner::whereDate('tanggal_pengisian', '>', Carbon::now()->firstOfMonth()->subMonth(12))
                ->leftJoin('master_alumni', 'master_alumni.id', '=', 'hasil_kuisioner.id_alumni')
                ->leftJoin('master_program_studi', 'master_program_studi.id', '=', 'master_alumni.id_program_studi')
                ->selectRaw('count(master_alumni.id_program_studi) as jumlah, master_program_studi.nama as nama_prodi')
                ->groupBy('master_alumni.id_program_studi')
                ->orderBy('jumlah', 'desc')
                ->limit(10)
                ->get();
        } else if ($filterbulan == '3') {
            $data = HasilKuisioner::whereDate('tanggal_pengisian', '>', Carbon::now()->firstOfMonth()->subMonth(3))
                ->leftJoin('master_alumni', 'master_alumni.id', '=', 'hasil_kuisioner.id_alumni')
                ->leftJoin('master_program_studi', 'master_program_studi.id', '=', 'master_alumni.id_program_studi')
                ->selectRaw('count(master_alumni.id_program_studi) as jumlah, master_program_studi.nama as nama_prodi')
                ->groupBy('master_alumni.id_program_studi')
                ->orderBy('jumlah', 'desc')
                ->limit(10)
                ->get();
        } else if ($filterbulan == '1') {
            $data = HasilKuisioner::whereMonth('tanggal_pengisian', Carbon::now()->month)
                ->leftJoin('master_alumni', 'master_alumni.id', '=', 'hasil_kuisioner.id_alumni')
                ->leftJoin('master_program_studi', 'master_program_studi.id', '=', 'master_alumni.id_program_studi')
                ->selectRaw('count(master_alumni.id_program_studi) as jumlah, master_program_studi.nama as nama_prodi')
                ->groupBy('master_alumni.id_program_studi')
                ->orderBy('jumlah', 'desc')
                ->limit(10)
                ->get();
        } else if ($filterbulan == '15') {
            $data = HasilKuisioner::whereDate('tanggal_pengisian', '>', Carbon::now()->subDay(15))
                ->leftJoin('master_alumni', 'master_alumni.id', '=', 'hasil_kuisioner.id_alumni')
                ->leftJoin('master_program_studi', 'master_program_studi.id', '=', 'master_alumni.id_program_studi')
                ->selectRaw('count(master_alumni.id_program_studi) as jumlah, master_program_studi.nama as nama_prodi')
                ->groupBy('master_alumni.id_program_studi')
                ->orderBy('jumlah', 'desc')
                ->limit(10)
                ->get();
        } else if ($filterbulan == '7') {
            $data = HasilKuisioner::whereDate('tanggal_pengisian', '>', Carbon::now()->subDay(7))
                ->leftJoin('master_alumni', 'master_alumni.id', '=', 'hasil_kuisioner.id_alumni')
                ->leftJoin('master_program_studi', 'master_program_studi.id', '=', 'master_alumni.id_program_studi')
                ->selectRaw('count(master_alumni.id_program_studi) as jumlah, master_program_studi.nama as nama_prodi')
                ->groupBy('master_alumni.id_program_studi')
                ->orderBy('jumlah', 'desc')
                ->limit(10)
                ->get();
        }

        return response($data, 200);
    }
}
