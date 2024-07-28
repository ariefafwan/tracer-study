<?php

namespace App\Http\Controllers\Api\Hasil;

use App\Http\Controllers\Controller;
use App\Models\Hasil\HasilJawaban;
use App\Models\Master\MasterKategoriPertanyaan;
use App\Models\Master\MasterPertanyaan;
use Illuminate\Http\Request;

class StatistikController extends Controller
{
    public function index()
    {
        $pertanyaan = MasterPertanyaan::select('id as value', 'pertanyaan as label', 'urutan')->where('status', '!=', 'Nonaktif')->whereHas('dataHasilJawaban')->get();
        $kategoriPertanyaan = MasterKategoriPertanyaan::select('id as value', 'nama as label', 'urutan')->orderBy('urutan')->get();

        return response()->json(compact('pertanyaan', 'kategoriPertanyaan'), 200);
    }

    public function statistik_perkategori($id_kategori_pertanyaan, $tahun_lulus)
    {
        $kategori = MasterKategoriPertanyaan::findOrFail($id_kategori_pertanyaan);

        $data = HasilJawaban::whereHas('dataPertanyaan', function ($query) use ($id_kategori_pertanyaan) {
            $query->where('id_kategori_pertanyaan', $id_kategori_pertanyaan);
        })->whereHas('dataHasilKuisioner', function ($q) use ($tahun_lulus) {
            $q->whereHas('dataAlumni', function ($e) use ($tahun_lulus) {
                $e->where('tahun_lulus', $tahun_lulus);
            });
        })->with(
            'dataPertanyaan',
            'dataHasilJawabanPilihan.dataMasterPilihanJawaban',
            'dataHasilJawabanSubPertanyaan.dataMasterSubPertanyaan',
            'dataHasilJawabanSubPertanyaan.dataHasilJawaban2Sisi.dataMasterSubTopikPertanyaan',
            'dataHasilJawabanSubTopik.dataMasterSubTopikPertanyaan'
        )->get();

        $pertanyaan = MasterPertanyaan::with('dataPilihanJawaban', 'dataSubPertanyaan', 'dataSubTopikPertanyaan', 'dataKategoriPertanyaan')
            ->where('id_kategori_pertanyaan', $id_kategori_pertanyaan)
            ->where('status', '!=', 'Nonaktif')
            ->get();
        return response()->json(compact('data', 'pertanyaan', 'kategori'), 200);
    }

    public function statistik_perpertanyaan($id_pertanyaan, $tahun_lulus)
    {
        $data = HasilJawaban::where('id_pertanyaan', $id_pertanyaan)->whereHas('dataHasilKuisioner', function ($q) use ($tahun_lulus) {
            $q->whereHas('dataAlumni', function ($e) use ($tahun_lulus) {
                $e->where('tahun_lulus', $tahun_lulus);
            });
        })->with(
            'dataHasilKuisioner.dataAlumni.dataProdi',
            'dataPertanyaan',
            'dataHasilJawabanPilihan.dataMasterPilihanJawaban',
            'dataHasilJawabanSubPertanyaan.dataMasterSubPertanyaan',
            'dataHasilJawabanSubPertanyaan.dataHasilJawaban2Sisi.dataMasterSubTopikPertanyaan',
            'dataHasilJawabanSubTopik.dataMasterSubTopikPertanyaan'
        )->get();

        $pertanyaan = MasterPertanyaan::with('dataPilihanJawaban', 'dataSubPertanyaan', 'dataSubTopikPertanyaan', 'dataKategoriPertanyaan')
            ->findOrFail($id_pertanyaan);
        return response()->json(compact('data', 'pertanyaan'), 200);
    }
}
