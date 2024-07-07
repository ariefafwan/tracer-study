<?php

namespace App\Models\Hasil;

use App\Models\Master\MasterAlumni;
use App\Models\Master\MasterDosen;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HashId;
use Cviebrock\EloquentSluggable\Sluggable;


class HasilLowongan extends Model
{
    use HasFactory;
    use HashId;
    use Sluggable;

    protected $table = 'hasil_lowongan';
    protected $primaryKey = 'id';

    public function dataDosen()
    {
        return $this->belongsTo(MasterDosen::class, 'id_dosen', 'id');
    }

    public function dataAlumni()
    {
        return $this->belongsTo(MasterAlumni::class, 'id_alumni', 'id');
    }

    public function dataKualifikasiProdi()
    {
        return $this->hasMany(HasilLowonganKualifikasiStudi::class, 'id_hasil_lowongan', 'id');
    }

    public function dataKualifikasiUmum()
    {
        return $this->hasMany(HasilLowonganKualifikasiUmum::class, 'id_hasil_lowongan', 'id');
    }

    public function scopeSearch($query, $term)
    {
        $term = "%$term%";

        $query->where(function ($query) use ($term) {
            $query->where('judul_lowongan', 'like', $term);
        });
    }

    public function sluggable(): array
    {
        return [
            'slug' => [
                'source' => 'judul_lowongan',
                'onUpdate' => true,
            ]
        ];
    }
}
