<?php

namespace App\Http\Controllers\Api\Master;

use App\Http\Controllers\Controller;
use App\Models\Master\MasterAlumni;
use App\Models\Master\MasterFakultas;
use App\Models\Master\MasterProgramStudi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class AlumniController extends Controller
{
    public function index()
    {
        $paginate = request('paginate', 10);
        $search_value = request('q', '');
        $status = request('status', '');
        $prodi = request('prodi', '');
        $tahun_lulus = request('tahun_lulus', '');
        $fakultas = request('fakultas', '');
        $alumni = MasterAlumni::with('dataProdi.dataFakultas')
            ->when($status, function ($query) use ($status) {
                $query->where('status', $status);
            })
            ->when($fakultas, function ($query) use ($fakultas) {
                $query->whereHas('dataProdi', function ($e) use ($fakultas) {
                    $e->where('id_fakultas', $fakultas);
                });
            })
            ->when($prodi, function ($query) use ($prodi) {
                $query->where('id_program_studi', $prodi);
            })
            ->when($tahun_lulus, function ($query) use ($tahun_lulus) {
                $query->where('tahun_lulus', $tahun_lulus);
            })
            ->orderBy('id_program_studi', 'asc')
            ->orderBy('nim', 'asc')
            ->search(trim($search_value))
            ->paginate($paginate);
        return response(json_encode($alumni), 200);
    }

    public function create()
    {
        $fakultas = MasterFakultas::select('id as value', 'nama as label')->orderBy('label')->get();
        $prodi = MasterProgramStudi::select('id as value', 'nama as label', 'id_fakultas')->orderBy('label')->get();
        return response()->json(compact('fakultas', 'prodi'), 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required',
            'id_program_studi.value' => 'required',
            'profile' => 'required',
            'jenis_kelamin' => 'required',
            'nim' => 'required',
            'nik' => 'required',
            'status' => 'required',
            'tahun_lulus.value' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        try {
            DB::beginTransaction();

            $cek = MasterAlumni::where('nama', $request->nama)->where('nim', $request->nim)
                ->first();

            if (isset($cek)) {
                return response()->json(['error' => 'Data Sudah Ada'], 422);
            }

            $new = new MasterAlumni();
            $new->nama = $request->nama;
            $new->id_program_studi = $request->id_program_studi['value'];

            $logo = $request->file('profile');
            $fileName = $logo->getClientOriginalName();
            $logo->storeAs('public/Alumni/', $fileName);
            $new->profile = $fileName;

            $new->jenis_kelamin = $request->jenis_kelamin;
            $new->nim = $request->nim;
            $new->nik = $request->nik;
            $new->npwp = $request->npwp;
            $new->status = $request->status;
            $new->tahun_lulus = $request->tahun_lulus['value'];
            $new->save();

            DB::commit();
            return response()->json(['success' => 'Berhasil Menambahkan Data'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function edit($id)
    {
        $data = MasterAlumni::with('dataProdi.dataFakultas')->findOrFail($id);
        return response(json_encode($data), 200);
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required',
            'id_program_studi.value' => 'required',
            'jenis_kelamin' => 'required',
            'nim' => 'required',
            'nik' => 'required',
            'status' => 'required',
            'tahun_lulus.value' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        try {
            DB::beginTransaction();

            $cek = MasterAlumni::where('id', '!=', $request->id)
                ->where('nama', $request->nama)->where('nim', $request->nim)
                ->first();

            if (isset($cek)) {
                return response()->json(['error' => 'Data Sudah Ada'], 422);
            }

            $data = MasterAlumni::findOrFail($request->id);

            $data->nama = $request->nama;
            $data->id_program_studi = $request->id_program_studi['value'];

            if ($request->profile != null || $request->profile != '') {
                Storage::delete('public/Alumni/' . $data->profile);
                $logo = $request->file('profile');
                $fileName = $logo->getClientOriginalName();
                $logo->storeAs('public/Alumni/', $fileName);
                $data->profile = $fileName;
            }

            $data->jenis_kelamin = $request->jenis_kelamin;
            $data->nim = $request->nim;
            $data->nik = $request->nik;
            $data->npwp = $request->npwp;
            $data->status = $request->status;
            $data->tahun_lulus = $request->tahun_lulus['value'];
            $data->save();

            DB::commit();
            return response()->json(['success' => 'Berhasil Mengupdate']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function update_status(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required',
            'status' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        try {
            DB::beginTransaction();

            $data = MasterAlumni::findOrFail($request->id);
            $data->status = $request->status;
            $data->save();

            DB::commit();
            return response()->json(['success' => 'Berhasil Mengupdate']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function delete($id)
    {
        DB::beginTransaction();
        try {
            $data = MasterAlumni::findOrFail($id);
            Storage::delete('public/Alumni/' . $data->profile);
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
