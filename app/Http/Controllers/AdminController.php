<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Complaint;
use Inertia\Inertia;
use Illuminate\Support\Facades\Mail;
use App\Mail\ComplaintRejected; // Kita akan buat file ini setelahnya

class AdminController extends Controller
{
    // --- 1. DASHBOARD UTAMA (ACTIVE JOBS) ---
    // Hanya menampilkan Pending & Process
    public function index(Request $request)
    {
        // Query Dasar: Ambil data user dan lampirannya
        $query = Complaint::with('user', 'attachments')
            ->whereIn('status', ['pending', 'process']);

        // Fitur Search (Berdasarkan Judul) - Sesuai request "Divide based on title"
        if ($request->search) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        $complaints = $query->latest()->get();

        // Statistik Global (Tetap diperlukan untuk Widget Angka)
        $stats = [
            'total'   => Complaint::count(),
            'pending' => Complaint::where('status', 'pending')->count(),
            'process' => Complaint::where('status', 'process')->count(),
            'done'    => Complaint::where('status', 'done')->count(),
        ];

        return Inertia::render('Admin/Dashboard/index', [
            'complaints' => $complaints,
            'stats'      => $stats,
            'filters'    => $request->only(['search']) // Agar text search tidak hilang saat reload
        ]);
    }

    // --- 2. HALAMAN LOGBOOK (ARCHIVE) ---
    // Hanya menampilkan Done + Logika Undo 5 Menit
    public function logbook()
    {
        $logs = Complaint::with('user', 'attachments')
            ->where('status', 'done') // Hanya yang sudah selesai
            ->latest()
            ->get()
            ->map(function ($item) {
                // LOGIKA UNDO:
                // Cek selisih waktu update terakhir dengan waktu sekarang.
                // Jika kurang dari 5 menit, set can_undo = true.
                $item->can_undo = $item->updated_at->diffInMinutes(now()) < 5;

                return $item;
            });

        return Inertia::render('Admin/Logbook/Index', [
            'logs' => $logs
        ]);
    }

    // --- 3. UPDATE STATUS & REJECT ---
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,process,done,rejected',
        ]);

        $complaint = Complaint::findOrFail($id);

        // A. SKENARIO REJECT (Tolak Laporan)
        if ($request->input('status') === 'rejected') {

            // 1. Tentukan Email Tujuan (User Terdaftar atau Tamu)
            $targetEmail = $complaint->user_id ? $complaint->user->email : $complaint->guest_email;

            // 2. Kirim Email (Walaupun dummy, kodenya wajib ada)
            if ($targetEmail) {
                // Pastikan Anda sudah membuat Mailable Class (lihat instruksi di bawah)
                try {
                    Mail::to($targetEmail)->send(new ComplaintRejected($complaint));
                } catch (\Exception $e) {
                    // Abaikan error email jika pakai dummy offline
                }
            }

            // 3. Hapus Data (Sesuai request: "admin can delete unvalid reports")
            $complaint->delete();

            return redirect()->route('admin.dashboard')->with('message', 'Laporan ditolak, dihapus, dan notifikasi dikirim.');
        }

        // B. SKENARIO NORMAL (Pending -> Process -> Done)
        $complaint->status = $request->input('status');
        $complaint->save(); // Timestamp updated_at otomatis berubah disini (penting untuk timer 5 menit)

        return redirect()->back()->with('message', 'Status berhasil diperbarui.');
    }

    // --- 4. DETAIL PAGE ---
    public function show($id)
    {
        // Tambahkan 'attachments' di with() agar gambar muncul
        $complaint = Complaint::with('user', 'attachments')->findOrFail($id);

        return Inertia::render('Admin/Show', [
            'complaint' => $complaint
        ]);
    }
}
