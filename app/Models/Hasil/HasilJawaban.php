<?php

namespace App\Models\Hasil;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HashId;

class HasilJawaban extends Model
{
    use HasFactory;
    use HashId;
    protected $table = 'hasil_jawaban';
    protected $primaryKey = 'id';
}
