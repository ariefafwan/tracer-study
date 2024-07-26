<?php

namespace App\Models\Hasil;

use App\Models\Master\MasterSubPertanyaan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HashId;

class HasilJawabanSubPertanyaan extends Model
{
    use HasFactory;
    use HashId;
    protected $table = 'hasil_jawaban_sub_pertanyaan';
    protected $primaryKey = 'id';

    public function dataHasilJawaban()
    {
        return $this->belongsTo(HasilJawaban::class, 'id_hasil_jawaban', 'id');
    }

    public function dataMasterSubPertanyaan()
    {
        return $this->belongsTo(MasterSubPertanyaan::class, 'id_sub_pertanyaan', 'id');
    }

    public function dataHasilJawaban2Sisi()
    {
        return $this->hasMany(HasilJawaban2Sisi::class, 'id_jawaban_sub_pertanyaan', 'id');
    }
}
