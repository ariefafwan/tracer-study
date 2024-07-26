<?php

namespace App\Models\Master;

use App\Models\Hasil\HasilJawaban;
use App\Models\Hasil\HasilKuisioner;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HashId;

class MasterAlumni extends Model
{
    use HasFactory;
    use HashId;

    protected $table = 'master_alumni';
    protected $primaryKey = 'id';

    public function dataProdi()
    {
        return $this->belongsTo(MasterProgramStudi::class, 'id_program_studi', 'id');
    }

    public function scopeSearch($query, $term)
    {
        $term = "%$term%";

        $query->where(function ($query) use ($term) {
            $query->where('nama', 'like', $term)
                ->orWhere('nim', 'like', $term);
        });
    }

    public function dataHasilKuisioner()
    {
        return $this->hasMany(HasilKuisioner::class, 'id_alumni', 'id');
    }
}
