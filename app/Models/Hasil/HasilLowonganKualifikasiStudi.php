<?php

namespace App\Models\Hasil;

use App\Models\Master\MasterProgramStudi;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HashId;

class HasilLowonganKualifikasiStudi extends Model
{
    use HasFactory;
    use HashId;
    protected $table = 'hasil_lowongan_kualifikasi_studi';
    protected $primaryKey = 'id';

    public function dataProdi()
    {
        return $this->belongsTo(MasterProgramStudi::class, 'id_program_studi', 'id');
    }
}
