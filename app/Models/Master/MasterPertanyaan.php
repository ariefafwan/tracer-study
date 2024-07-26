<?php

namespace App\Models\Master;

use App\Models\Hasil\HasilJawaban;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HashIdWithOrdering;

class MasterPertanyaan extends Model
{
    use HasFactory;
    use HashIdWithOrdering;

    protected $table = 'master_pertanyaan';
    protected $primaryKey = 'id';

    public function scopeSearch($query, $term)
    {
        $term = "%$term%";

        $query->where(function ($query) use ($term) {
            $query->where('nama', 'like', $term);
        });
    }

    public function dataPilihanJawaban()
    {
        return $this->hasMany(MasterPilihanJawaban::class, 'id_pertanyaan', 'id');
    }

    public function dataSubPertanyaan()
    {
        return $this->hasMany(MasterSubPertanyaan::class, 'id_pertanyaan', 'id');
    }

    public function dataSubTopikPertanyaan()
    {
        return $this->hasMany(MasterSubTopikPertanyaan::class, 'id_pertanyaan', 'id');
    }

    public function dataKategoriPertanyaan()
    {
        return $this->belongsTo(MasterKategoriPertanyaan::class, 'id_kategori_pertanyaan', 'id');
    }

    public function dataParent()
    {
        return $this->belongsTo(self::class, 'id_parent', 'id');
    }

    public function dataChildren()
    {
        return $this->hasMany(self::class, 'id_parent', 'id');
    }

    public function dataHasilJawaban()
    {
        return $this->hasMany(HasilJawaban::class, 'id_pertanyaan', 'id');
    }

    // protected static function boot()
    // {
    //     parent::boot();
    //     static::addGlobalScope('order', function (Builder $builder) {
    //         $builder->orderBy('urutan', 'asc');
    //     });
    // }
}
