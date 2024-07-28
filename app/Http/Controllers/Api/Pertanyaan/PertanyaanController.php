<?php

namespace App\Http\Controllers\Api\Pertanyaan;

use App\Http\Controllers\Controller;
use App\Models\Master\MasterKategoriPertanyaan;
use App\Models\Master\MasterPertanyaan;
use App\Models\Master\MasterPilihanJawaban;
use App\Models\Master\MasterSubPertanyaan;
use App\Models\Master\MasterSubTopikPertanyaan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class PertanyaanController extends Controller
{
    public function index()
    {
        $paginate = request('paginate', 10);
        $search_value = request('q', '');
        $data = MasterPertanyaan::select('master_pertanyaan.*', 'master_kategori_pertanyaan.urutan as urutan_kategori_pertanyaan', 'master_kategori_pertanyaan.nama as nama_kategori_pertanyaan')
            ->leftJoin('master_kategori_pertanyaan', 'master_kategori_pertanyaan.id', '=', 'master_pertanyaan.id_kategori_pertanyaan')
            ->orderBy('urutan_kategori_pertanyaan')
            ->orderBy('urutan')
            ->search(trim($search_value))
            ->paginate($paginate);
        return response(json_encode($data), 200);
    }

    public function create()
    {
        $kategoripertanyaan = MasterKategoriPertanyaan::select('id as value', 'nama as label')->get();
        $pertanyaan = MasterPertanyaan::select('id as value', 'pertanyaan as label')->get();
        return response()->json(compact('kategoripertanyaan', 'pertanyaan'), 200);
    }

    public function data($id)
    {
        $data = MasterPilihanJawaban::select('id as value', 'nama_pilihan as label')
            ->where('id_pertanyaan', $id)
            ->get();
        return response(json_encode($data), 200);
    }

    public function store(Request $request)
    {
        try {
            DB::beginTransaction();

            $cek = MasterPertanyaan::where('pertanyaan', $request->pertanyaan)
                ->first();

            if (isset($cek)) {
                return response()->json(['error' => 'Pertanyaan Yang Sama Sudah Ada'], 422);
            }

            $cekUrutan = MasterPertanyaan::where('urutan', $request->urutan)
                ->first();

            if (isset($cekUrutan)) {
                return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
            }

            $new = new MasterPertanyaan();
            $new->pertanyaan = $request->pertanyaan;
            $new->urutan = $request->urutan;
            $new->status = $request->status['value'];
            $new->id_kategori_pertanyaan = $request->id_kategori_pertanyaan['value'];
            $new->tipe = $request->tipe_pertanyaan['value'];
            if ($request->tipe_pertanyaan['value'] == 'Pilihan') {
                if ($request->pilihan_lainnya == false) {
                    $new->is_jawaban_lainnya = 'Tidak';
                } else {
                    $new->is_jawaban_lainnya = 'Ya';
                }
            } else if ($request->tipe_pertanyaan['value'] == 'Checkbox') {
                $new->is_jawaban_lainnya = 'Ya';
            } else {
                $new->is_jawaban_lainnya = 'Tidak';
            }
            $new->save();

            if ($request->tipe_pertanyaan['value'] == 'Pilihan') {
                foreach ($request->pilihan as $index => $pilihan) {
                    $cekUrutan = MasterPilihanJawaban::where('id_pertanyaan', $new->id)
                        ->where('urutan', $pilihan['urutan'])
                        ->first();

                    if (isset($cekUrutan)) {
                        return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
                    }

                    $newPilihan = new MasterPilihanJawaban();
                    $newPilihan->id_pertanyaan = $new->id;
                    $newPilihan->urutan = $pilihan['urutan'];
                    $newPilihan->nama_pilihan = $pilihan['value'];
                    $newPilihan->isInput = 'Tidak';
                    $newPilihan->save();
                }
            } else if ($request->tipe_pertanyaan['value'] == 'Pilihan_Dengan_Inputan') {
                foreach ($request->pilihan_inputan as $index => $pilihan_inputan) {
                    $cekUrutan = MasterPilihanJawaban::where('id_pertanyaan', $new->id)->where('urutan', $pilihan_inputan['urutan'])
                        ->first();

                    if (isset($cekUrutan)) {
                        return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
                    }

                    $newPilihan = new MasterPilihanJawaban();
                    $newPilihan->id_pertanyaan = $new->id;
                    $newPilihan->urutan = $pilihan_inputan['urutan'];
                    $newPilihan->nama_pilihan = $pilihan_inputan['value'];
                    if ($pilihan_inputan['isInput'] == false) {
                        $newPilihan->isInput = 'Tidak';
                    } else {
                        $newPilihan->isInput = 'Ya';
                    }
                    $newPilihan->save();
                }
            } else if ($request->tipe_pertanyaan['value'] == 'Pilihan_2_Sisi_Pertanyaan') {
                foreach ($request->sub_pertanyaan as $index => $sub_pertanyaan) {
                    $cekUrutan = MasterSubPertanyaan::where('id_pertanyaan', $new->id)->where('urutan', $sub_pertanyaan['urutan'])
                        ->first();

                    if (isset($cekUrutan)) {
                        return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
                    }

                    $newSubPertanyaan = new MasterSubPertanyaan();
                    $newSubPertanyaan->id_pertanyaan = $new->id;
                    $newSubPertanyaan->urutan = $sub_pertanyaan['urutan'];
                    $newSubPertanyaan->sub_pertanyaan = $sub_pertanyaan['value'];
                    $newSubPertanyaan->save();
                }

                foreach ($request->sub_topik_pertanyaan as $index => $sub_topik_pertanyaan) {
                    $cekUrutan = MasterSubTopikPertanyaan::where('id_pertanyaan', $new->id)->where('urutan', $sub_topik_pertanyaan['urutan'])
                        ->first();

                    if (isset($cekUrutan)) {
                        return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
                    }

                    $newSubTopikPertanyaan = new MasterSubTopikPertanyaan();
                    $newSubTopikPertanyaan->id_pertanyaan = $new->id;
                    $newSubTopikPertanyaan->urutan = $sub_topik_pertanyaan['urutan'];
                    $newSubTopikPertanyaan->sub_topik_pertanyaan = $sub_topik_pertanyaan['value'];
                    $newSubTopikPertanyaan->save();
                }
            } else if ($request->tipe_pertanyaan['value'] == 'Pilihan_Dengan_SubTopik') {
                foreach ($request->sub_topik as $index => $sub_topik) {
                    $cekUrutan = MasterSubTopikPertanyaan::where('id_pertanyaan', $new->id)
                        ->where('urutan', $sub_topik['urutan'])
                        ->first();

                    if (isset($cekUrutan)) {
                        return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
                    }

                    $newSubTopikPertanyaan = new MasterSubTopikPertanyaan();
                    $newSubTopikPertanyaan->id_pertanyaan = $new->id;
                    $newSubTopikPertanyaan->urutan = $sub_topik['urutan'];
                    $newSubTopikPertanyaan->sub_topik_pertanyaan = $sub_topik['value'];
                    $newSubTopikPertanyaan->save();
                }
            } else if ($request->tipe_pertanyaan['value'] == 'Checkbox') {
                foreach ($request->checkbox as $index => $checkbox) {
                    $cekUrutan = MasterPilihanJawaban::where('id_pertanyaan', $new->id)
                        ->where('urutan', $checkbox['urutan'])
                        ->first();

                    if (isset($cekUrutan)) {
                        return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
                    }

                    $newcheckbox = new MasterPilihanJawaban();
                    $newcheckbox->id_pertanyaan = $new->id;
                    $newcheckbox->urutan = $checkbox['urutan'];
                    $newcheckbox->nama_pilihan = $checkbox['value'];
                    $newcheckbox->isInput = 'Tidak';
                    $newcheckbox->save();
                }
            } else if ($request->tipe_pertanyaan['value'] == 'Sub_Pertanyaan') {
                $new->id_parent = $request->id_parent['value'];
                $new->save();

                $newSubPertanyaan = new MasterSubPertanyaan();
                $newSubPertanyaan->id_pertanyaan = $new->id;
                $newSubPertanyaan->urutan = $request->urutan;
                $newSubPertanyaan->jenis_subpertanyaan = $request->jenis_sub_pertanyaan['value'];
                $newSubPertanyaan->id_pilihan_jawaban = $request->id_pilihan_jawaban['value'];
                $newSubPertanyaan->sub_pertanyaan = $request->pertanyaan;
                $newSubPertanyaan->save();

                if ($request->jenis_sub_pertanyaan['value'] == 'Pilihan') {
                    foreach ($request->pilihan as $index => $pilihan) {
                        $cekUrutan = MasterPilihanJawaban::where('id_pertanyaan', $new->id)
                            ->where('urutan', $pilihan['urutan'])
                            ->first();

                        if (isset($cekUrutan)) {
                            return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
                        }

                        $newSubTopikPertanyaan = new MasterPilihanJawaban();
                        $newSubTopikPertanyaan->id_pertanyaan = $new->id;
                        $newSubTopikPertanyaan->urutan = $pilihan['urutan'];
                        $newSubTopikPertanyaan->nama_pilihan = $pilihan['value'];
                        $newSubTopikPertanyaan->isInput = 'Tidak';
                        $newSubTopikPertanyaan->save();
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

    public function edit($id)
    {
        $data = MasterPertanyaan::with('dataPilihanJawaban', 'dataSubPertanyaan.dataPilihanJawaban', 'dataSubTopikPertanyaan', 'dataKategoriPertanyaan', 'dataParent')->findOrFail($id);
        return response(json_encode($data), 200);
    }

    public function update(Request $request)
    {
        try {
            DB::beginTransaction();

            $cek = MasterPertanyaan::where('id', '!=', $request->id)->where('pertanyaan', $request->pertanyaan)
                ->first();

            if (isset($cek)) {
                return response()->json(['error' => 'Pertanyaan Yang Sama Sudah Ada'], 422);
            }

            $cekUrutan = MasterPertanyaan::where('id', '!=', $request->id)->where('urutan', $request->urutan)
                ->first();

            if (isset($cekUrutan)) {
                return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
            }

            $new = MasterPertanyaan::findOrFail($request->id);
            $new->pertanyaan = $request->pertanyaan;
            $new->urutan = $request->urutan;
            $new->status = $request->status['value'];
            $new->id_kategori_pertanyaan = $request->id_kategori_pertanyaan['value'];
            $new->tipe = $request->tipe_pertanyaan['value'];
            if ($request->tipe_pertanyaan['value'] == 'Pilihan') {
                if ($request->pilihan_lainnya == false) {
                    $new->is_jawaban_lainnya = 'Tidak';
                } else {
                    $new->is_jawaban_lainnya = 'Ya';
                }
            } else if ($request->tipe_pertanyaan['value'] == 'Checkbox') {
                $new->is_jawaban_lainnya = 'Ya';
            } else {
                $new->is_jawaban_lainnya = 'Tidak';
            }
            $new->save();

            if ($request->tipe_pertanyaan['value'] == 'Pilihan') {
                foreach ($request->pilihan as $index => $pilihan) {
                    if ($pilihan['id'] != 0) {
                        $newPilihan = MasterPilihanJawaban::findOrFail($pilihan['id']);
                        $cekUrutan = MasterPilihanJawaban::where('id', '!=', $newPilihan->id)
                            ->where('id_pertanyaan', $new->id)->where('urutan', $pilihan['urutan'])
                            ->first();

                        if (isset($cekUrutan)) {
                            return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
                        }

                        $newPilihan->urutan = $pilihan['urutan'];
                        $newPilihan->nama_pilihan = $pilihan['value'];
                        $newPilihan->save();
                    } else {
                        $cekUrutan = MasterPilihanJawaban::where('id_pertanyaan', $new->id)->where('urutan', $pilihan['urutan'])
                            ->first();

                        if (isset($cekUrutan)) {
                            return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
                        }

                        $newPilihan = new MasterPilihanJawaban();
                        $newPilihan->id_pertanyaan = $new->id;
                        $newPilihan->urutan = $pilihan['urutan'];
                        $newPilihan->nama_pilihan = $pilihan['value'];
                        $newPilihan->isInput = 'Tidak';
                        $newPilihan->save();
                    }
                }
            } else if ($request->tipe_pertanyaan['value'] == 'Pilihan_Dengan_Inputan') {
                foreach ($request->pilihan_inputan as $index => $pilihan_inputan) {
                    if ($pilihan_inputan['id'] != 0) {
                        $newPilihan = MasterPilihanJawaban::findOrFail($pilihan_inputan['id']);
                        $cekUrutan = MasterPilihanJawaban::where('id', '!=', $newPilihan->id)
                            ->where('id_pertanyaan', $new->id)
                            ->where('urutan', $pilihan_inputan['urutan'])
                            ->first();

                        if (isset($cekUrutan)) {
                            return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
                        }

                        $newPilihan->urutan = $pilihan_inputan['urutan'];
                        $newPilihan->nama_pilihan = $pilihan_inputan['value'];
                        if ($pilihan_inputan['isInput'] == false) {
                            $newPilihan->isInput = 'Tidak';
                        } else {
                            $newPilihan->isInput = 'Ya';
                        }
                        $newPilihan->save();
                    } else {
                        $cekUrutan = MasterPilihanJawaban::where('id_pertanyaan', $new->id)
                            ->where('urutan', $pilihan_inputan['urutan'])
                            ->first();

                        if (isset($cekUrutan)) {
                            return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
                        }

                        $newPilihan = new MasterPilihanJawaban();
                        $newPilihan->id_pertanyaan = $new->id;
                        $newPilihan->urutan = $pilihan_inputan['urutan'];
                        $newPilihan->nama_pilihan = $pilihan_inputan['value'];
                        if ($pilihan_inputan['isInput'] == false) {
                            $newPilihan->isInput = 'Tidak';
                        } else {
                            $newPilihan->isInput = 'Ya';
                        }
                        $newPilihan->save();
                    }
                }
            } else if ($request->tipe_pertanyaan['value'] == 'Pilihan_2_Sisi_Pertanyaan') {
                foreach ($request->sub_pertanyaan as $index => $sub_pertanyaan) {
                    if ($sub_pertanyaan['id'] != 0) {
                        $newSubPertanyaan = MasterSubPertanyaan::findOrFail($sub_pertanyaan['id']);
                        $cekUrutan = MasterSubPertanyaan::where('id', '!=', $newSubPertanyaan->id)
                            ->where('id_pertanyaan', $new->id)
                            ->where('urutan', $sub_pertanyaan['urutan'])
                            ->first();

                        if (isset($cekUrutan)) {
                            return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
                        }

                        $newSubPertanyaan->urutan = $sub_pertanyaan['urutan'];
                        $newSubPertanyaan->sub_pertanyaan = $sub_pertanyaan['value'];
                        $newSubPertanyaan->save();
                    } else {
                        $cekUrutan = MasterSubPertanyaan::where('id_pertanyaan', $new->id)
                            ->where('urutan', $sub_pertanyaan['urutan'])
                            ->first();

                        if (isset($cekUrutan)) {
                            return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
                        }

                        $newSubPertanyaan = new MasterSubPertanyaan();
                        $newSubPertanyaan->id_pertanyaan = $new->id;
                        $newSubPertanyaan->urutan = $sub_pertanyaan['urutan'];
                        $newSubPertanyaan->sub_pertanyaan = $sub_pertanyaan['value'];
                        $newSubPertanyaan->save();
                    }
                }

                foreach ($request->sub_topik_pertanyaan as $index => $sub_topik_pertanyaan) {
                    if ($sub_topik_pertanyaan['id'] != 0) {
                        $newSubTopikPertanyaan = MasterSubTopikPertanyaan::findOrFail($sub_topik_pertanyaan['id']);
                        $cekUrutan = MasterSubTopikPertanyaan::where('id', '!=', $newSubTopikPertanyaan->id)
                            ->where('id_pertanyaan', $new->id)
                            ->where('urutan', $sub_topik_pertanyaan['urutan'])
                            ->first();

                        if (isset($cekUrutan)) {
                            return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
                        }

                        $newSubTopikPertanyaan->urutan = $sub_topik_pertanyaan['urutan'];
                        $newSubTopikPertanyaan->sub_topik_pertanyaan = $sub_topik_pertanyaan['value'];
                        $newSubTopikPertanyaan->save();
                    } else {
                        $cekUrutan = MasterSubTopikPertanyaan::where('id_pertanyaan', $new->id)
                            ->where('urutan', $sub_topik_pertanyaan['urutan'])
                            ->first();

                        if (isset($cekUrutan)) {
                            return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
                        }

                        $newSubTopikPertanyaan = new MasterSubTopikPertanyaan();
                        $newSubTopikPertanyaan->id_pertanyaan = $new->id;
                        $newSubTopikPertanyaan->urutan = $sub_topik_pertanyaan['urutan'];
                        $newSubTopikPertanyaan->sub_topik_pertanyaan = $sub_topik_pertanyaan['value'];
                        $newSubTopikPertanyaan->save();
                    }
                }
            } else if ($request->tipe_pertanyaan['value'] == 'Pilihan_Dengan_SubTopik') {
                foreach ($request->sub_topik as $index => $sub_topik) {
                    if ($sub_topik['id'] != 0) {
                        $newSubTopik = MasterSubTopikPertanyaan::findOrFail($sub_topik['id']);
                        $cekUrutan = MasterSubTopikPertanyaan::where('id', '!=', $newSubTopik->id)
                            ->where('id_pertanyaan', $new->id)
                            ->where('urutan', $sub_topik['urutan'])
                            ->first();

                        if (isset($cekUrutan)) {
                            return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
                        }

                        $newSubTopik->urutan = $sub_topik['urutan'];
                        $newSubTopik->sub_topik_pertanyaan = $sub_topik['value'];
                        $newSubTopik->save();
                    } else {
                        $cekUrutan = MasterSubTopikPertanyaan::where('id_pertanyaan', $new->id)
                            ->where('urutan', $sub_topik['urutan'])
                            ->first();

                        if (isset($cekUrutan)) {
                            return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
                        }

                        $newSubTopik = new MasterSubTopikPertanyaan();
                        $newSubTopik->id_pertanyaan = $new->id;
                        $newSubTopik->urutan = $sub_topik['urutan'];
                        $newSubTopik->sub_topik_pertanyaan = $sub_topik['value'];
                        $newSubTopik->save();
                    }
                }
            } else if ($request->tipe_pertanyaan['value'] == 'Checkbox') {
                foreach ($request->checkbox as $index => $checkbox) {
                    if ($checkbox['id'] != 0) {
                        $newPilihanJawaban = MasterPilihanJawaban::findOrFail($checkbox['id']);
                        $cekUrutan = MasterPilihanJawaban::where('id', '!=', $newPilihanJawaban->id)
                            ->where('id_pertanyaan', $new->id)
                            ->where('urutan', $checkbox['urutan'])
                            ->first();

                        if (isset($cekUrutan)) {
                            return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
                        }

                        $newPilihanJawaban->urutan = $checkbox['urutan'];
                        $newPilihanJawaban->nama_pilihan = $checkbox['value'];
                        $newPilihanJawaban->save();
                    } else {
                        $cekUrutan = MasterPilihanJawaban::where('id_pertanyaan', $new->id)
                            ->where('urutan', $checkbox['urutan'])
                            ->first();

                        if (isset($cekUrutan)) {
                            return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
                        }

                        $newPilihanJawaban = new MasterPilihanJawaban();
                        $newPilihanJawaban->id_pertanyaan = $new->id;
                        $newPilihanJawaban->urutan = $checkbox['urutan'];
                        $newPilihanJawaban->nama_pilihan = $checkbox['value'];
                        $newPilihanJawaban->save();
                    }
                }
            } else if ($request->tipe_pertanyaan['value'] == 'Sub_Pertanyaan') {
                $new->id_parent = $request->id_parent['value'];
                $new->save();

                $newSubPertanyaan = MasterSubPertanyaan::where('id_pertanyaan', $new->id)->first();
                $newSubPertanyaan->id_pertanyaan = $new->id;
                $newSubPertanyaan->urutan = $request->urutan;
                $newSubPertanyaan->jenis_subpertanyaan = $request->jenis_sub_pertanyaan['value'];
                $newSubPertanyaan->id_pilihan_jawaban = $request->id_pilihan_jawaban['value'];
                $newSubPertanyaan->sub_pertanyaan = $request->pertanyaan;
                $newSubPertanyaan->save();

                if ($request->jenis_sub_pertanyaan['value'] == 'Pilihan') {
                    foreach ($request->pilihan as $index => $pilihan) {
                        if ($pilihan['id'] != 0) {
                            $newPilihanJawaban = MasterPilihanJawaban::findOrFail($pilihan['id']);
                            $cekUrutan = MasterPilihanJawaban::where('id', '!=', $newPilihanJawaban->id)
                                ->where('id_pertanyaan', $new->id)
                                ->where('urutan', $pilihan['urutan'])
                                ->first();

                            if (isset($cekUrutan)) {
                                return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
                            }

                            $newPilihanJawaban->urutan = $pilihan['urutan'];
                            $newPilihanJawaban->nama_pilihan = $pilihan['value'];
                            $newPilihanJawaban->save();
                        } else {
                            $cekUrutan = MasterPilihanJawaban::where('id_pertanyaan', $new->id)
                                ->where('urutan', $pilihan['urutan'])
                                ->first();

                            if (isset($cekUrutan)) {
                                return response()->json(['error' => 'Urutan Pertanyaan Sudah Ada'], 422);
                            }

                            $newPilihanJawaban = new MasterPilihanJawaban();
                            $newPilihanJawaban->id_pertanyaan = $new->id;
                            $newPilihanJawaban->urutan = $pilihan['urutan'];
                            $newPilihanJawaban->nama_pilihan = $pilihan['value'];
                            $newPilihanJawaban->save();
                        }
                    }
                }
            }

            DB::commit();
            return response()->json(['success' => 'Berhasil Menambahkan Data'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            if ($e->getCode() == "23000") {
                return response()->json(['error' => 'Jawaban Atas Pertanyaan Ini Sudah Ada'], 422);
            } else {
                return response()->json(['error' => $e->getMessage()], 422);
            }
        }
    }

    public function delete($id)
    {
        DB::beginTransaction();
        try {
            $data = MasterPertanyaan::findOrFail($id);
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
