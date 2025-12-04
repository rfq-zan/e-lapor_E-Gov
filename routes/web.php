<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ComplaintController;
use App\Http\Controllers\AdminController;
use App\Http\Middleware\IsAdmin;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| 1. AREA PUBLIK (Anonim / Tamu)
|--------------------------------------------------------------------------
*/
// Halaman Utama langsung menampilkan Form Laporan
Route::get('/', [ComplaintController::class, 'index'])->name('complaints.index');

// Proses Kirim Laporan (Wajib di luar Auth agar tamu bisa lapor)
Route::post('/complaints', [ComplaintController::class, 'store'])->name('complaints.store');



/*
|--------------------------------------------------------------------------
| 2. AREA MEMBER (User Login)
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


/*
|--------------------------------------------------------------------------
| 3. AREA ADMIN (Khusus Admin Dinas)
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', IsAdmin::class])->group(function () {
    Route::get('/admin/dashboard', [AdminController::class, 'index'])->name('admin.dashboard');
    Route::get('/admin/logbook', [AdminController::class, 'logbook'])->name('admin.logbook');
    // Route::post('/auth/login', [AdminController::class, 'logout'])->name('logout');
    Route::get('/admin/complaints/{id}', [AdminController::class, 'show'])->name('admin.complaints.show');
    Route::patch('/admin/complaints/{id}', [AdminController::class, 'updateStatus'])->name('admin.complaints.update');
});

require __DIR__.'/auth.php';
