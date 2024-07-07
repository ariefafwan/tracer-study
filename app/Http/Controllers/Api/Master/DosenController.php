<?php

namespace App\Http\Controllers\Api\Master;

use App\Http\Controllers\Controller;
use App\Models\Master\MasterDosen;
use App\Models\Master\MasterFakultas;
use App\Models\Master\MasterProgramStudi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DosenController extends Controller
{
    public function index()
    {
        $paginate = request('paginate', 10);
        $search_value = request('q', '');
        $status = request('status', '');
        $prodi = request('prodi', '');
        $fakultas = request('fakultas', '');
        $alumni = MasterDosen::with('dataProdi.dataFakultas')
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
            ->orderBy('id_program_studi', 'asc')
            ->orderBy('nik', 'asc')
            ->search(trim($search_value))
            ->paginate($paginate);
        return response(json_encode($alumni), 200);
    }

    public function create()
    {
        $fakultas = MasterFakultas::get();
        $prodi = MasterProgramStudi::get();
        return response()->json(compact('fakultas', 'prodi'), 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required',
            'id_program_studi' => 'required',
            'jenis_kelamin' => 'required',
            'nik' => 'required',
            'status' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        try {
            DB::beginTransaction();

            $cek = MasterDosen::where('nama', $request->nama)->where('nik', $request->nik)
                ->first();

            if (isset($cek)) {
                return response()->json(['error' => 'Data Sudah Ada'], 422);
            }

            $new = new MasterDosen();
            $new->nama = $request->nama;
            $new->id_program_studi = $request->id_program_studi;
            $new->jenis_kelamin = $request->jenis_kelamin;
            $new->nik = $request->nik;
            $new->nidn = $request->nidn;
            $new->status = $request->status;
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
        $data = MasterDosen::with('dataProdi')->findOrFail($id);
        return response(json_encode($data), 200);
    }

    public function update(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required',
            'id_program_studi' => 'required',
            'jenis_kelamin' => 'required',
            'nik' => 'required',
            'status' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        try {
            DB::beginTransaction();

            $cek = MasterDosen::where('id', '!=', $request->id)
                ->where('nama', $request->nama)->where('nik', $request->nik)
                ->first();

            if (isset($cek)) {
                return response()->json(['error' => 'Data Sudah Ada'], 422);
            }

            $data = MasterDosen::findOrFail($request->id);

            $data->nama = $request->nama;
            $data->id_program_studi = $request->id_program_studi;
            $data->jenis_kelamin = $request->jenis_kelamin;
            $data->nik = $request->nik;
            $data->nidn = $request->nidn;
            $data->status = $request->status;
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

            $data = MasterDosen::findOrFail($request->id);
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
            $data = MasterDosen::findOrFail($id);
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
