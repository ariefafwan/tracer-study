<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\HashId;

class Biodata extends Model
{
    use HasFactory;
    use HashId;
    protected $table = 'biodata';
    protected $primaryKey = 'id';
}
