<?php

namespace App\Http\Controllers\Api\Konten;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class FAQController extends Controller
{
    public function index()
    {
        $paginate = request('paginate', 10);
        $search_value = request('q', '');
        $data = Faq::orderBy('urutan')
            ->search(trim($search_value))
            ->paginate($paginate);
        return response(json_encode($data), 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'pertanyaan' => 'required',
            'urutan' => 'required',
            'jawaban' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        try {
            DB::beginTransaction();

            $cek = Faq::where('pertanyaan', $request->pertanyaan)
                ->first();

            if (isset($cek)) {
                return response()->json(['error' => 'Pertanyaan Yang Sama Sudah Ada'], 422);
            }

            $cekUrutan = Faq::where('urutan', $request->urutan)
                ->first();

            if (isset($cekUrutan)) {
                return response()->json(['error' => 'Urutan Sudah Ada'], 422);
            }

            $new = new Faq();
            $new->pertanyaan = $request->pertanyaan;
            $new->jawaban = $request->jawaban;
            $new->urutan = $request->urutan;
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
            'pertanyaan' => 'required',
            'urutan' => 'required',
            'jawaban' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()->first()], 422);
        }

        try {
            DB::beginTransaction();

            $cek = Faq::where('id', '!=', $request->id)
                ->where('pertanyaan', $request->pertanyaan)
                ->first();

            if (isset($cek)) {
                return response()->json(['error' => 'Pertanyaan Yang Sama Sudah Ada'], 422);
            }

            $cekUrutan = Faq::where('id', '!=', $request->id)
                ->where('urutan', $request->urutan)
                ->first();

            if (isset($cekUrutan)) {
                return response()->json(['error' => 'Urutan Sudah Ada'], 422);
            }

            $data = Faq::findOrFail($request->id);

            $data->pertanyaan = $request->pertanyaan;
            $data->jawaban = $request->jawaban;
            $data->urutan = $request->urutan;
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
        $data = Faq::findOrFail($id);
        return response(json_encode($data), 200);
    }

    public function delete($id)
    {
        DB::beginTransaction();
        try {
            $data = Faq::findOrFail($id);
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
