<?php

namespace App\Models\Hasil;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HashId;

class HasilLowongan extends Model
{
    use HasFactory;
    use HashId;
    protected $table = 'hasil_lowongan';
    protected $primaryKey = 'id';
}
