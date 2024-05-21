<?php

namespace App\Models\Master;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HashId;

class MasterPilihanJawaban extends Model
{
    use HasFactory;
    use HashId;

    protected $table = 'master_pilihan_jawaban';
    protected $primaryKey = 'id';
}
