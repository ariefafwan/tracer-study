<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use App\Traits\HashIdWithOrdering;

class MasterPilihanJawaban extends Model
{
    use HasFactory;
    use HashIdWithOrdering;

    protected $table = 'master_pilihan_jawaban';
    protected $primaryKey = 'id';

    public function dataSubPertanyaan()
    {
        return $this->hasMany(MasterSubPertanyaan::class, 'id_pertanyaan', 'id');
    }
}
