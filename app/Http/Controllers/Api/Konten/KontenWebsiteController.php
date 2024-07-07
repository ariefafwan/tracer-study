<?php

namespace App\Http\Controllers\Api\Konten;

use App\Http\Controllers\Controller;
use App\Models\Konten;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class KontenWebsiteController extends Controller
{
    public function index()
    {
        $paginate = request('paginate', 10);
        $search_value = request('q', '');
        $data = Konten::search(trim($search_value))
            ->paginate($paginate);
        return response(json_encode($data), 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required',
            'tipe_konten' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        try {
            DB::beginTransaction();

            $cek = Konten::where('nama', $request->nama)
                ->first();

            if (isset($cek)) {
                return response()->json(['error' => 'Konten Yang Sama Sudah Ada'], 422);
            }

            $new = new Konten();
            $new->nama = $request->nama;
            $new->tipe_konten = $request->tipe_konten;

            if ($request->tipe_konten != 'Gambar') {
                $new->konten = $request->konten;
            }

            if ($request->gambar != null || $request->gambar != '' && $request->tipe_konten == 'Gambar') {
                $logo = $request->file('gambar');
                $fileName = $logo->getClientOriginalName();
                $logo->storeAs('public/Konten/Gambar/', $fileName);
                $new->gambar = $fileName;
            }

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
            'tipe_konten' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        try {
            DB::beginTransaction();

            $cek = Konten::where('id', '!=', $request->id)
                ->where('nama', $request->nama)
                ->first();

            if (isset($cek)) {
                return response()->json(['error' => 'Konten Yang Sama Sudah Ada'], 422);
            }

            $data = Konten::findOrFail($request->id);
            $data->nama = $request->nama;
            $data->tipe_konten = $request->tipe_konten;

            if ($request->gambar != null || $request->gambar != '' && $request->tipe_konten == 'Gambar') {
                Storage::delete('public/Konten/Gambar/' . $data->gambar);
                $logo = $request->file('gambar');
                $fileName = $logo->getClientOriginalName();
                $logo->storeAs('public/Konten/Gambar/', $fileName);
                $data->gambar = $fileName;
            }

            if ($request->tipe_konten != 'Gambar') {
                $data->konten = $request->konten;
            }
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
        $data = Konten::findOrFail($id);
        return response(json_encode($data), 200);
    }

    public function delete($id)
    {
        DB::beginTransaction();
        try {
            $data = Konten::findOrFail($id);
            Storage::delete('public/Konten/Gambar/' . $data->gambar);
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
