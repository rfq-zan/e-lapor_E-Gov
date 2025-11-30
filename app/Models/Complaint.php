<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
protected $fillable = [
        'user_id',
        'classification',
        'title',
        'description',
        'date',
        'location',
        'instansi',
        'category',
        'privacy',
        'image',
        'status',
        'finished_at',
    ];
    protected $casts = [
        'finished_at' => 'datetime',
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
