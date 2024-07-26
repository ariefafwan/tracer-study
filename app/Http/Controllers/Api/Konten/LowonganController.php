<?php

namespace App\Http\Controllers\Api\Konten;

use App\Http\Controllers\Controller;
use App\Models\Hasil\HasilLowongan;
use App\Models\Hasil\HasilLowonganKualifikasiStudi;
use App\Models\Hasil\HasilLowonganKualifikasiUmum;
use App\Models\Master\MasterProgramStudi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class LowonganController extends Controller
{
    public function index()
    {
        $paginate = request('paginate', 10);
        $search_value = request('q', '');
        // $alumni = request('alumni', '');
        // $dosen = request('dosen', '');
        $data = HasilLowongan::orderBy('tanggal_mulai', 'desc')->orderBy('judul_lowongan')
            // ->when($alumni, function ($query) use ($alumni) {
            //     $query->where('id_alumni', $alumni);
            // })
            // ->when($dosen, function ($query) use ($dosen) {
            //     $query->where('id_alumni', $dosen);
            // })
            ->search(trim($search_value))
            ->paginate($paginate);
        return response(json_encode($data), 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'judul_lowongan' => 'required',
            'nama_perusahaan' => 'required',
            'bidang_usaha.value' => 'required',
            'logo_perusahaan' => 'required',
            'desk' => 'required',
            'tanggal_mulai' => 'required',
            'tanggal_selesai' => 'required',
            'data_kualifikasi_umum.*.value' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        try {
            DB::beginTransaction();

            $new = new HasilLowongan();
            $new->judul_lowongan = $request->judul_lowongan;
            $new->bidang_usaha = $request->bidang_usaha['value'];
            $new->nama_perusahaan = $request->nama_perusahaan;
            $new->kota = $request->kota;
            $new->link_lowongan = $request->link_lowongan;

            $logo = $request->file('logo_perusahaan');
            $fileName = $logo->getClientOriginalName();
            $logo->storeAs('public/Logo/', $fileName);
            $new->logo_perusahaan = $fileName;

            $new->desk = $request->desk;
            $new->tanggal_mulai = $request->tanggal_mulai;
            $new->tanggal_selesai = $request->tanggal_selesai;

            $new->save();

            foreach ($request->data_kualifikasi_umum as $index => $kualifikasi) {
                $newKualifikasiUmum = new HasilLowonganKualifikasiUmum();
                $newKualifikasiUmum->kualifikasi = $kualifikasi['value'];
                $newKualifikasiUmum->id_hasil_lowongan = $new->id;

                $newKualifikasiUmum->save();
            }

            if ($request->data_kualifikasi_prodi !== null) {
                foreach ($request->data_kualifikasi_prodi as $index => $kualifikasiProdi) {
                    $newKualifikasiProdi = new HasilLowonganKualifikasiStudi();
                    $newKualifikasiProdi->id_program_studi = $kualifikasiProdi['value'];
                    $newKualifikasiProdi->id_hasil_lowongan = $new->id;

                    $newKualifikasiProdi->save();
                }
            }

            DB::commit();
            return response()->json(['success' => 'Berhasil Menambahkan Data'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'judul_lowongan' => 'required',
            'nama_perusahaan' => 'required',
            'bidang_usaha.value' => 'required',
            'desk' => 'required',
            'tanggal_mulai' => 'required',
            'tanggal_selesai' => 'required',
            'data_kualifikasi_prodi.*' => 'required',
            'data_kualifikasi_umum.*.value' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        try {
            DB::beginTransaction();

            $data = HasilLowongan::findOrFail($request->id);

            $data->judul_lowongan = $request->judul_lowongan;
            $data->bidang_usaha = $request->bidang_usaha['value'];
            $data->kota = $request->kota;
            $data->link_lowongan = $request->link_lowongan;
            $data->nama_perusahaan = $request->nama_perusahaan;

            if ($request->logo_perusahaan != null || $request->logo_perusahaan != '') {
                Storage::delete('public/Logo/' . $data->logo_perusahaan);
                $logo = $request->file('logo_perusahaan');
                $fileName = $logo->getClientOriginalName();
                $logo->storeAs('public/Logo/', $fileName);
                $data->logo_perusahaan = $fileName;
            }

            $data->desk = $request->desk;
            $data->tanggal_mulai = $request->tanggal_mulai;
            $data->tanggal_selesai = $request->tanggal_selesai;
            $data->save();

            $dataumum = HasilLowonganKualifikasiUmum::where('id_hasil_lowongan', $data->id)->get();
            $dataprodi = HasilLowonganKualifikasiStudi::where('id_hasil_lowongan', $data->id)->get();

            $dataumum->each->delete();
            $dataprodi->each->delete();

            foreach ($request->data_kualifikasi_umum as $index => $kualifikasi) {
                $newKualifikasiUmum = new HasilLowonganKualifikasiUmum();
                $newKualifikasiUmum->kualifikasi = $kualifikasi['value'];
                $newKualifikasiUmum->id_hasil_lowongan = $data->id;

                $newKualifikasiUmum->save();
            }

            if ($request->data_kualifikasi_prodi !== null) {
                foreach ($request->data_kualifikasi_prodi as $index => $kualifikasiProdi) {
                    $newKualifikasiProdi = new HasilLowonganKualifikasiStudi();
                    $newKualifikasiProdi->id_program_studi = $kualifikasiProdi['value'];
                    $newKualifikasiProdi->id_hasil_lowongan = $data->id;

                    $newKualifikasiProdi->save();
                }
            }
            DB::commit();
            return response()->json(['success' => 'Berhasil Mengupdate']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function edit($slug)
    {
        $data = HasilLowongan::with('dataKualifikasiProdi.dataProdi', 'dataKualifikasiUmum')->where('slug', $slug)->first();
        return response(json_encode($data), 200);
    }

    public function data()
    {
        $program_studi = MasterProgramStudi::select('id as value', 'nama as label')->orderBy('label')->get();
        $bidang_usaha = HasilLowongan::select('bidang_usaha as value', 'bidang_usaha as label')->distinct()->orderBy('bidang_usaha')->get();
        $kualifikasi_umum = HasilLowonganKualifikasiUmum::select('kualifikasi as value', 'kualifikasi as label')->distinct()->orderBy('kualifikasi')->get();
        return response()->json(compact('program_studi', 'bidang_usaha', 'kualifikasi_umum'), 200);
    }

    public function delete($id)
    {
        DB::beginTransaction();
        try {
            $data = HasilLowongan::findOrFail($id);
            Storage::delete('public/Logo/' . $data->logo_perusahaan);
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
