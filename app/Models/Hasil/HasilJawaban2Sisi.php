<?php

namespace App\Models\Hasil;

use App\Models\Master\MasterSubTopikPertanyaan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HashId;


class HasilJawaban2Sisi extends Model
{
    use HasFactory;
    use HashId;
    protected $table = 'hasil_jawaban_2_sisi';
    protected $primaryKey = 'id';

    public function dataMasterSubTopikPertanyaan()
    {
        return $this->belongsTo(MasterSubTopikPertanyaan::class, 'id_sub_topik', 'id');
    }

    public function dataHasilJawabanSubPertanyaan()
    {
        return $this->belongsTo(HasilJawabanSubPertanyaan::class, 'id_jawaban_sub_pertanyaan', 'id');
    }
}
