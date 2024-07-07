<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Biodata;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class BiodataController extends Controller
{
    public function index()
    {
        $data = Biodata::first();
        return response(json_encode($data), 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama' => 'required',
            'alamat' => 'required',
            'no_telp' => 'required',
            'email' => 'required',
            'logo' => 'required'
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        try {
            DB::beginTransaction();

            $new = new Biodata();
            $new->nama = $request->nama;
            $new->alamat = $request->alamat;
            $new->no_telp = $request->no_telp;
            $new->email = $request->email;

            $logo = $request->file('logo');
            $fileName = $logo->getClientOriginalName();
            $logo->storeAs('public/Profile/Logo/', $fileName);
            $new->logo = $fileName;

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
            'alamat' => 'required',
            'no_telp' => 'required',
            'email' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        try {
            DB::beginTransaction();

            $new = Biodata::findOrFail($request->id);
            $new->nama = $request->nama;
            $new->alamat = $request->alamat;
            $new->no_telp = $request->no_telp;
            $new->email = $request->email;

            if ($request->hasFile('logo')) {
                Storage::delete('public/Profile/Logo/' . $new->logo);
                $logo = $request->file('logo');
                $fileName = $logo->getClientOriginalName();
                $logo->storeAs('public/Profile/Logo/', $fileName);
                $new->logo = $fileName;
            }

            $new->save();

            DB::commit();
            return response()->json(['success' => 'Berhasil Menambahkan Data'], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }
}
