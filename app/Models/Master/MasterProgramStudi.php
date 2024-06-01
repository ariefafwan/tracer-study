<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HashId;

class MasterProgramStudi extends Model
{
    use HasFactory;
    use HashId;

    protected $table = 'master_program_studi';
    protected $primaryKey = 'id';

    public function dataFakultas()
    {
        return $this->belongsTo(MasterFakultas::class, 'id_fakultas', 'id');
    }

    public function dataAlumni()
    {
        return $this->hasMany(MasterAlumni::class, 'id_program_studi', 'id');
    }

    public function dataDosen()
    {
        return $this->hasMany(MasterDosen::class, 'id_program_studi', 'id');
    }

    public function scopeSearch($query, $term)
    {
        $term = "%$term%";

        $query->where(function ($query) use ($term) {
            $query->where('nama', 'like', $term)
                ->orWhereHas('dataFakultas', function ($q) use ($term) {
                    $q->where('nama', 'like', $term);
                });
        });
    }
}
