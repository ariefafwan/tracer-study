<?php

namespace App\Models\Hasil;

use App\Models\Master\MasterAlumni;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HashId;

class HasilKuisioner extends Model
{
    use HasFactory;
    use HashId;
    protected $table = 'hasil_kuisioner';
    protected $primaryKey = 'id';

    public function dataHasilJawaban()
    {
        return $this->hasMany(HasilJawaban::class, 'id_hasil_kuisioner', 'id');
    }

    public function dataAlumni()
    {
        return $this->belongsTo(MasterAlumni::class, 'id_alumni', 'id');
    }

    public function scopeSearch($query, $term)
    {
        $term = "%$term%";

        $query->where(function ($query) use ($term) {
            $query->whereHas('dataAlumni', function ($q) use ($term) {
                $q->where('nama', 'like', $term)
                    ->orWhere('nim', 'like', $term);
            });
        });
    }
}
