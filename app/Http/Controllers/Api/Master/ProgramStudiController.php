<?php

namespace App\Http\Controllers\Api\Master;

use App\Http\Controllers\Controller;
use App\Models\Master\MasterFakultas;
use App\Models\Master\MasterProgramStudi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ProgramStudiController extends Controller
{
    public function index()
    {
        $paginate = request('paginate', 10);
        $search_value = request('q', '');
        $id_fakultas = request('fakultas');
        $prodi = MasterProgramStudi::with('dataFakultas')
            // ->leftJoin('master_fakultas', 'master_fakultas.id', '=', 'master_program_studi.id_fakultas')
            ->when($id_fakultas, function ($query) use ($id_fakultas) {
                $query->where('id_fakultas', $id_fakultas);
            })
            // ->when($search_value, function ($query) use ($search_value) {
            //     $query->where('nama', 'like', trim($search_value))
            //         ->orWhere('nama_fakultas', 'like', trim($search_value));
            // })
            ->orderBy('id_fakultas', 'asc')
            ->orderBy('nama', 'asc')
            ->search(trim($search_value))
            ->paginate($paginate);
        return response(json_encode($prodi), 200);
    }

    public function create()
    {
        $fakultas = MasterFakultas::get();
        return response()->json(compact('fakultas'), 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required',
            'id_fakultas' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        try {
            DB::beginTransaction();

            $cek = MasterProgramStudi::where('nama', $request->nama)
                ->first();

            if (isset($cek)) {
                return response()->json(['error' => 'Data Sudah Ada'], 422);
            }

            $new = new MasterProgramStudi();
            $new->nama = $request->nama;
            $new->id_fakultas = $request->id_fakultas;
            $new->save();

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
            'nama' => 'required',
            'id_fakultas' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        try {
            DB::beginTransaction();

            $cek = MasterProgramStudi::where('id', '!=', $request->id)
                ->where('nama', $request->nama)
                ->first();

            if (isset($cek)) {
                return response()->json(['error' => 'Data Sudah Ada'], 422);
            }

            $data = MasterProgramStudi::findOrFail($request->id);

            $data->nama = $request->nama;
            $data->id_fakultas = $request->id_fakultas;
            $data->save();

            DB::commit();
            return response()->json(['success' => 'Berhasil Mengupdate']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    public function edit($id)
    {
        $data = MasterProgramStudi::findOrFail($id);
        return response(json_encode($data), 200);
    }

    public function delete($id)
    {
        DB::beginTransaction();
        try {
            $data = MasterProgramStudi::findOrFail($id);
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
