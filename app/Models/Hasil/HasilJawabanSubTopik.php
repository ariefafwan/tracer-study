<?php

namespace App\Models\Hasil;

use App\Models\Master\MasterSubTopikPertanyaan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HashId;

class HasilJawabanSubTopik extends Model
{
    use HasFactory;
    use HashId;
    protected $table = 'hasil_jawaban_sub_topik';
    protected $primaryKey = 'id';

    public function dataMasterSubTopikPertanyaan()
    {
        return $this->belongsTo(MasterSubTopikPertanyaan::class, 'id_sub_topik', 'id');
    }

    public function dataHasilJawaban()
    {
        return $this->belongsTo(HasilJawaban::class, 'id_hasil_jawaban', 'id');
    }
}
