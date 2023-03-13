<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'furi',
        'en_name',
        'category_id',
        'url',
        'contact_url',
        'zip',
        'pref',
        'address',
        'tel',
        'dainame',
        'corporate_number',
        'established',
        'capital',
        'earnings',
        'employees',
        'category_txt',
        'houjin_flg',
        'session_status',
        'status',
        'created',
        'modified'
    ];
}
