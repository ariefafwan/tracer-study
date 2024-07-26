<?php

namespace App\Models\Hasil;

use App\Models\Master\MasterPilihanJawaban;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HashId;

class HasilJawabanPilihan extends Model
{
    use HasFactory;
    use HashId;
    protected $table = 'hasil_jawaban_pilihan';
    protected $primaryKey = 'id';

    public function dataHasilJawaban()
    {
        return $this->belongsTo(HasilJawaban::class, 'id_hasil_jawaban', 'id');
    }

    public function dataMasterPilihanJawaban()
    {
        return $this->belongsTo(MasterPilihanJawaban::class, 'id_pilihan_jawaban', 'id');
    }
}
