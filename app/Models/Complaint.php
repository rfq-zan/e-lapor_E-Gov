<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    protected $fillable = [
        'user_id',
        'guest_name',
        'guest_email',
        'classification',
        'title',
        'description',
        'date',
        'location',
        'instansi',
        'category',
        'privacy',
        'status',
        'finished_at'
    ];

    protected $casts = [
        'finished_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // --- BAGIAN INI YANG HILANG DAN BIKIN ERROR ---
    public function attachments()
    {
        return $this->hasMany(ComplaintAttachment::class);
    }
    // ----------------------------------------------
}
