<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HashId;

class MasterSubPertanyaan extends Model
{
    use HasFactory;
    use HashId;

    protected $table = 'master_sub_pertanyaan';
    protected $primaryKey = 'id';
}
