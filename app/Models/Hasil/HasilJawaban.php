<?php

namespace App\Models\Hasil;

use App\Models\Master\MasterAlumni;
use App\Models\Master\MasterPertanyaan;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HashId;

class HasilJawaban extends Model
{
    use HasFactory;
    use HashId;
    protected $table = 'hasil_jawaban';
    protected $primaryKey = 'id';

    public function dataPertanyaan()
    {
        return $this->belongsTo(MasterPertanyaan::class, 'id_pertanyaan', 'id');
    }

    public function dataHasilKuisioner()
    {
        return $this->belongsTo(HasilKuisioner::class, 'id_hasil_kuisioner', 'id');
    }

    public function dataHasilJawabanPilihan()
    {
        return $this->hasMany(HasilJawabanPilihan::class, 'id_hasil_jawaban', 'id');
    }

    public function dataHasilJawabanSubPertanyaan()
    {
        return $this->hasMany(HasilJawabanSubPertanyaan::class, 'id_hasil_jawaban', 'id');
    }

    public function dataHasilJawabanSubTopik()
    {
        return $this->hasMany(HasilJawabanSubTopik::class, 'id_hasil_jawaban', 'id');
    }
}
