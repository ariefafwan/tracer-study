<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HashId;

class MasterSubTopikPertanyaan extends Model
{
    use HasFactory;
    use HashId;

    protected $table = 'master_sub_topik_pertanyaan';
    protected $primaryKey = 'id';
}
