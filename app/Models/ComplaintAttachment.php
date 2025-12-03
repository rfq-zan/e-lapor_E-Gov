<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ComplaintAttachment extends Model
{
    use HasFactory;

    // Izinkan kolom ini diisi
    protected $fillable = ['complaint_id', 'file_path', 'file_type'];

    // Relasi balik ke Complaint (Opsional, tapi bagus ada)
    public function complaint()
    {
        return $this->belongsTo(Complaint::class);
    }
}
