<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HashId;

class MasterFakultas extends Model
{
    use HasFactory;
    use HashId;

    protected $table = 'master_fakultas';
    protected $primaryKey = 'id';

    public function dataProdi()
    {
        return $this->hasMany(MasterProgramStudi::class, 'id_fakultas', 'id');
    }

    public function scopeSearch($query, $term)
    {
        $term = "%$term%";

        $query->where(function ($query) use ($term) {
            $query->where('nama', 'like', $term);
        });
    }
}
