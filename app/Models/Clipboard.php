<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Clipboard extends Model
{
    use HasFactory;
    protected $fillable = [
        'id',
        'column_name',
        'column_number'
    ];
}
