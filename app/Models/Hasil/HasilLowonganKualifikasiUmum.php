<?php

namespace App\Models\Hasil;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HashId;

class HasilLowonganKualifikasiUmum extends Model
{
    use HasFactory;
    use HashId;
    protected $table = 'hasil_lowongan_kualifikasi_umum';
    protected $primaryKey = 'id';
}
