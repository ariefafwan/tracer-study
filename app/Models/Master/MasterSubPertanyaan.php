<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use App\Traits\HashIdWithOrdering;

class MasterSubPertanyaan extends Model
{
    use HasFactory;
    use HashIdWithOrdering;

    protected $table = 'master_sub_pertanyaan';
    protected $primaryKey = 'id';

    public function dataPilihanJawaban()
    {
        return $this->belongsTo(MasterPilihanJawaban::class, 'id_pilihan_jawaban', 'id');
    }
}
