<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HashId;

class MasterDosen extends Model
{
    use HasFactory;
    use HashId;

    protected $table = 'master_dosen';
    protected $primaryKey = 'id';

    public function dataProdi()
    {
        return $this->belongsTo(MasterProgramStudi::class, 'id_program_studi', 'id');
    }

    public function scopeSearch($query, $term)
    {
        $term = "%$term%";

        $query->where(function ($query) use ($term) {
            $query->where('nama', 'like', $term)->orWhere('nidn', 'like', $term);
        });
    }
}
