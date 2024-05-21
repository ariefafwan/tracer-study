<?php

namespace App\Models\Hasil;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HashId;

class HasilLowonganKualifikasiStudi extends Model
{
    use HasFactory;
    use HashId;
    protected $table = 'hasil_lowongan_kualifikasi_studi';
    protected $primaryKey = 'id';
}
