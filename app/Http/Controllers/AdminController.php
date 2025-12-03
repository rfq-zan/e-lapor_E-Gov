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
    public function logbook()
    {
        $logs = Complaint::with('user', 'attachments')
            ->where('status', 'done')
            ->orderBy('finished_at', 'desc') // <--- GUNAKAN KOLOM BARU INI
            ->get()
            ->map(function ($item) {
                // Logika Undo 5 Menit (Tetap pakai updated_at untuk batas edit, atau finished_at juga bisa)
                // Kita pakai finished_at agar konsisten
                $item->can_undo = $item->finished_at && $item->finished_at->diffInMinutes(now()) < 5;

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
        $newStatus = $request->input('status');

        // A. SKENARIO REJECT
        if ($newStatus === 'rejected') {
            $complaint->delete();
            return redirect()->route('admin.dashboard')->with('message', 'Laporan ditolak.');
        }

        // B. SKENARIO SELESAI (DONE)
        if ($newStatus === 'done') {
            $complaint->status = 'done';
            $complaint->finished_at = now();
        }
        // C. SKENARIO UNDO / PROSES (Balik ke Process)
        else {
            $complaint->status = $newStatus;
            $complaint->finished_at = null;
        }

        $complaint->save();

        return redirect()->back()->with('message', 'Status diperbarui.');
    }

    // --- 4. DETAIL PAGE ---
    public function show($id)
    {
        $complaint = Complaint::with('user', 'attachments')->findOrFail($id);

        return Inertia::render('Admin/Show', [
            'complaint' => $complaint
        ]);
    }
}
