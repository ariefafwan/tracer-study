<?php

namespace App\Http\Controllers\Api\Hasil;

use App\Http\Controllers\Controller;
use App\Models\Hasil\HasilJawaban;
use App\Models\Hasil\HasilKuisioner;
use App\Models\Master\MasterAlumni;
use App\Models\Master\MasterFakultas;
use App\Models\Master\MasterKategoriPertanyaan;
use App\Models\Master\MasterPertanyaan;
use App\Models\Master\MasterProgramStudi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class HasilController extends Controller
{
    public function index()
    {
        $paginate = request('paginate', 10);
        $search_value = request('q', '');
        $formdate = request('daritanggal', '');
        $formke = request('ketanggal', '');
        $prodi = request('prodi', '');
        $fakultas = request('fakultas', '');
        $data = HasilKuisioner::with('dataAlumni', 'dataAlumni.dataProdi.dataFakultas')->when($fakultas, function ($query) use ($fakultas) {
            $query->whereHas('dataAlumni', function ($e) use ($fakultas) {
                $e->whereHas('dataProdi', function ($f) use ($fakultas) {
                    $f->where('id_fakultas', $fakultas);
                });
            });
        })->when($prodi, function ($query) use ($prodi) {
            $query->whereHas('dataAlumni', function ($e) use ($prodi) {
                $e->where('id_program_studi', $prodi);
            });
        })
            ->when($formdate && $formke, function ($q) use ($formdate, $formke) {
                $q->whereBetween('tanggal_pengisian', [$formdate, $formke]);
            })
            ->orderBy('tanggal_pengisian', 'desc')
            ->search(trim($search_value))
            ->paginate($paginate);

        return response(json_encode($data), 200);
    }

    public function create()
    {
        $prodi = MasterProgramStudi::orderBy('nama')->get();
        $fakultas = MasterFakultas::orderBy('nama')->get();
        return response()->json(compact('prodi', 'fakultas'), 200);
    }

    public function show_hasil($id_hasil_kuisioner)
    {
        $data = HasilJawaban::where('id_hasil_kuisioner', $id_hasil_kuisioner)->with(
            'dataPertanyaan',
            'dataHasilJawabanPilihan.dataMasterPilihanJawaban',
            'dataHasilJawabanSubPertanyaan.dataMasterSubPertanyaan',
            'dataHasilJawabanSubPertanyaan.dataHasilJawaban2Sisi.dataMasterSubTopikPertanyaan',
            'dataHasilJawabanSubTopik.dataMasterSubTopikPertanyaan'
        )
            ->get();
        $pertanyaan = MasterPertanyaan::whereHas('dataHasilJawaban', function ($query) use ($id_hasil_kuisioner) {
            $query->where('id_hasil_kuisioner', $id_hasil_kuisioner);
        })->with('dataPilihanJawaban', 'dataSubPertanyaan', 'dataSubTopikPertanyaan', 'dataKategoriPertanyaan')
            ->where('status', 'Wajib')->get();
        $pertanyaanOptional = MasterPertanyaan::whereHas('dataHasilJawaban', function ($query) use ($id_hasil_kuisioner) {
            $query->where('id_hasil_kuisioner', $id_hasil_kuisioner);
        })->with('dataPilihanJawaban', 'dataParent', 'dataChildren', 'dataSubPertanyaan.dataPilihanJawaban')
            ->where('status', 'Optional')->get();
        $alumni = MasterAlumni::with('dataProdi.dataFakultas')->whereHas('dataHasilKuisioner', function ($query) use ($id_hasil_kuisioner) {
            $query->where('id', $id_hasil_kuisioner);
        })->first();

        return response()->json(compact('data', 'pertanyaan', 'pertanyaanOptional', 'alumni'), 200);
    }

    public function delete($id)
    {
        DB::beginTransaction();
        try {
            $data = HasilKuisioner::findOrFail($id);
            $data->delete();
            DB::commit();
            return response()->json(['success' => 'Berhasil Menghapus Data'], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            if ($e->getCode() == "23000") {
                return response()->json(['error' => 'Data Sedang Digunakan'], 422);
            } else {
                return response()->json(['error' => $e->getMessage()], 422);
            }
        }
    }
}
