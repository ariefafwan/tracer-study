<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HashId;

class Konten extends Model
{
    use HasFactory;
    use HashId;
    protected $table = 'konten';
    protected $primaryKey = 'id';
}
