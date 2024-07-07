<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use App\Traits\HashIdWithOrdering;

class MasterSubTopikPertanyaan extends Model
{
    use HasFactory;
    use HashIdWithOrdering;

    protected $table = 'master_sub_topik_pertanyaan';
    protected $primaryKey = 'id';
}
