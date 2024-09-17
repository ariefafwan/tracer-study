<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Biodata;
use App\Models\Faq;
use App\Models\Hasil\HasilJawaban;
use App\Models\Hasil\HasilJawaban2Sisi;
use App\Models\Hasil\HasilJawabanPertanyaan;
use App\Models\Hasil\HasilJawabanPilihan;
use App\Models\Hasil\HasilJawabanSubPertanyaan;
use App\Models\Hasil\HasilJawabanSubTopik;
use App\Models\Hasil\HasilKuisioner;
use App\Models\Hasil\HasilLowongan;
use App\Models\Konten;
use App\Models\Master\MasterAlumni;
use App\Models\Master\MasterKategoriPertanyaan;
use App\Models\Master\MasterPertanyaan;
use App\Models\Master\MasterProgramStudi;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

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
        $formdate = request('daritanggal', '');
        $formke = request('ketanggal', '');
        $bidangusaha = request('bidang_usaha', '');
        $prodi = request('prodi', '');
        $arrayprodi = [];
        if ($prodi != '') {
            $arrayprodi = explode(',', $prodi);
        }
        $ordering = request('ordering', '');
        $data = HasilLowongan::where('tanggal_selesai', '>=', Carbon::now()->format('Y-m-d'))
            ->when($formdate && $formke, function ($q) use ($formdate, $formke) {
                $q->whereBetween('tanggal_selesai', [$formdate, $formke]);
            })->when($bidangusaha, function ($q) use ($bidangusaha) {
                $q->where('bidang_usaha', 'like', '%' . trim($bidangusaha) . '%');
            })->when(count($arrayprodi) > 0, function ($q) use ($arrayprodi) {
                $q->whereHas('dataKualifikasiProdi', function ($var) use ($arrayprodi) {
                    $var->whereIn('id_program_studi', $arrayprodi);
                });
            })
            ->when($ordering == 'A-Z' || $ordering == '', function ($q) {
                $q->orderBy('judul_lowongan', 'asc');
            })->when($ordering == 'Z-A', function ($q) {
                $q->orderBy('judul_lowongan', 'desc');
            })
            ->search(trim($search_value))
            ->paginate($paginate);
        return response(json_encode($data), 200);
    }

    public function detail_lowongan($id_lowongan)
    {
        $data = HasilLowongan::with('dataKualifikasiProdi.dataProdi', 'dataKualifikasiUmum')
            ->where('id', $id_lowongan)
            ->first();
        return response()->json($data, 200);
    }

    public function data()
    {
        $program_studi = MasterProgramStudi::get();
        $bidang_usaha = HasilLowongan::select('bidang_usaha')->distinct()->orderBy('bidang_usaha')->get();
        return response()->json(compact('bidang_usaha', 'program_studi'), 200);
    }

    public function programstudi(Request $request)
    {
        $data = MasterProgramStudi::select('id as value', 'nama as label')->orderBy('label')->get();
        return response()->json($data, 200);
    }

    public function checkAlumni(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required',
            'nim' => 'required',
            'id_program_studi' => 'required',
            'jenis_kelamin' => 'required',
            'nik' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        $data = MasterAlumni::where('nim', $request->nim)
            ->where('status', 'Aktif')
            ->where('nik', $request->nik)
            ->where('id_program_studi', $request->id_program_studi)
            ->where('nama', $request->nama)
            ->where('jenis_kelamin', $request->jenis_kelamin)
            ->first();

        if (isset($data)) {
            return response()->json($data, 200);
        } else {
            return response()->json(['error' => 'Data Tidak Sesuai / Tidak Ditemukan'], 422);
        }
    }

    public function pertanyaan()
    {
        $pertanyaan = MasterPertanyaan::with('dataPilihanJawaban', 'dataSubPertanyaan', 'dataSubTopikPertanyaan', 'dataKategoriPertanyaan')
            ->where('status', 'Wajib')->get();
        $pertanyaanOptional = MasterPertanyaan::with('dataPilihanJawaban', 'dataParent', 'dataChildren', 'dataSubPertanyaan.dataPilihanJawaban')
            ->where('status', 'Optional')->get();
        return response()->json(compact('pertanyaan', 'pertanyaanOptional'), 200);
    }

    public function kuisioner(Request $request)
    {
        try {
            DB::beginTransaction();

            $hasilkuisioner = new HasilKuisioner();
            $hasilkuisioner->id_alumni = $request->id_alumni;
            $hasilkuisioner->tanggal_pengisian = Carbon::now();
            $hasilkuisioner->save();

            foreach ($request->wajib as $key => $value) {
                $new = new HasilJawaban();
                $new->id_pertanyaan = $value['id_pertanyaan'];
                $new->id_hasil_kuisioner = $hasilkuisioner->id;
                $new->save();

                if ($value['tipe'] == 'Pilihan') {
                    $jawaban = new HasilJawabanPilihan();
                    $jawaban->id_hasil_jawaban = $new->id;
                    if (array_key_exists('__isNew__', $value['pilihan_jawaban'])) {
                        $jawaban->jawaban_input = $value['pilihan_jawaban']['value'];
                    } else {
                        $jawaban->id_pilihan_jawaban = $value['pilihan_jawaban']['value'];
                    }
                    $jawaban->save();
                } else if ($value['tipe'] == 'Inputan_Text') {
                    $jawaban = new HasilJawabanPilihan();
                    $jawaban->id_hasil_jawaban = $new->id;
                    $jawaban->jawaban_input = $value['jawaban_input'];
                    $jawaban->save();
                } else if ($value['tipe'] == 'Inputan_Angka') {
                    $jawaban = new HasilJawabanPilihan();
                    $jawaban->id_hasil_jawaban = $new->id;
                    $jawaban->jawaban_input = $value['jawaban_input'];
                    $jawaban->save();
                } else if ($value['tipe'] == 'Inputan_Tanggal') {
                    $jawaban = new HasilJawabanPilihan();
                    $jawaban->id_hasil_jawaban = $new->id;
                    $jawaban->jawaban_input = $value['jawaban_input'];
                    $jawaban->save();
                } else if ($value['tipe'] == 'Checkbox') {
                    foreach ($value['checkbox'] as $index => $checkbox) {
                        if ($checkbox['value']) {
                            $jawaban = new HasilJawabanPilihan();
                            $jawaban->id_hasil_jawaban = $new->id;
                            if ($checkbox['isLainnya']) {
                                $jawaban->jawaban_input = $checkbox['jawaban_input'];
                            } else {
                                $jawaban->id_pilihan_jawaban = $checkbox['id_pilihan_jawaban'];
                            }
                            $jawaban->save();
                        }
                    }
                } else if ($value['tipe'] == 'Pilihan_Dengan_SubTopik') {
                    foreach ($value['pilihan_jawaban_subtopik'] as $index => $subtopik) {
                        $jawaban = new HasilJawabanSubTopik();
                        $jawaban->id_hasil_jawaban = $new->id;
                        $jawaban->id_sub_topik = $subtopik['id_sub_topik_pertanyaan'];
                        $jawaban->jawaban = $subtopik['value'];
                        $jawaban->save();
                    }
                } else if ($value['tipe'] == 'Pilihan_2_Sisi_Pertanyaan') {
                    foreach ($value['pilihan_jawaban_2_sisi'] as $index => $pilihan2sisi) {
                        $subpertanyaan = new HasilJawabanSubPertanyaan();
                        $subpertanyaan->id_hasil_jawaban = $new->id;
                        $subpertanyaan->id_sub_pertanyaan = $pilihan2sisi['id_sub_pertanyaan'];
                        $subpertanyaan->save();

                        foreach ($pilihan2sisi['value'] as $i => $subtopik2sisi) {
                            $jawaban = new HasilJawaban2Sisi();
                            $jawaban->id_jawaban_sub_pertanyaan = $subpertanyaan->id;
                            $jawaban->id_sub_topik = $subtopik2sisi['id_sub_topik_pertanyaan'];
                            $jawaban->jawaban = $subtopik2sisi['value']['value'];
                            $jawaban->save();
                        }
                    }
                } else if ($value['tipe'] == 'Pilihan_Dengan_Inputan') {
                    $jawaban = new HasilJawabanPilihan();
                    $jawaban->id_hasil_jawaban = $new->id;
                    $jawaban->id_pilihan_jawaban = $value['jawaban_pilihan_inputan']['id_pilihan_jawaban'];
                    $jawaban->jawaban_input = $value['jawaban_pilihan_inputan']['jawaban_input'];
                    $jawaban->save();
                }
            }

            foreach ($request->optional as $key => $value2) {
                if ($value2['isTampil']) {
                    $new = new HasilJawaban();
                    $new->id_pertanyaan = $value2['id_pertanyaan'];
                    $new->id_hasil_kuisioner = $hasilkuisioner->id;
                    $new->save();

                    if ($value2['jenis_subpertanyaan'] == 'Pilihan') {
                        $jawaban = new HasilJawabanPilihan();
                        $jawaban->id_hasil_jawaban = $new->id;
                        if (array_key_exists('__isNew__', $value2['pilihan_jawaban'])) {
                            $jawaban->jawaban_input = $value2['pilihan_jawaban']['value'];
                        } else {
                            $jawaban->id_pilihan_jawaban = $value2['pilihan_jawaban']['value'];
                        }
                        $jawaban->save();
                    } else if ($value2['jenis_subpertanyaan'] == 'Inputan_Text') {
                        $jawaban = new HasilJawabanPilihan();
                        $jawaban->id_hasil_jawaban = $new->id;
                        $jawaban->jawaban_input = $value2['jawaban_input'];
                        $jawaban->save();
                    } else if ($value2['jenis_subpertanyaan'] == 'Inputan_Angka') {
                        $jawaban = new HasilJawabanPilihan();
                        $jawaban->id_hasil_jawaban = $new->id;
                        $jawaban->jawaban_input = $value2['jawaban_input'];
                        $jawaban->save();
                    } else if ($value2['jenis_subpertanyaan'] == 'Inputan_Tanggal') {
                        $jawaban = new HasilJawabanPilihan();
                        $jawaban->id_hasil_jawaban = $new->id;
                        $jawaban->jawaban_input = $value2['jawaban_input'];
                        $jawaban->save();
                    }
                }
            }

            DB::commit();
            return response()->json(['success' => 'Berhasil Menambahkan Data'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}
