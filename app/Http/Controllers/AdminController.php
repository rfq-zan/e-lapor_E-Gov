<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Complaint;
use Inertia\Inertia;

class AdminController extends Controller
{
    // --- 1. DASHBOARD UTAMA (ACTIVE JOBS) ---
    public function index(Request $request)
    {
        // Hapus 'attachments' jika tidak ada relasi di Model, cukup 'user'
        // malah ngapus attachment ( gambar gaakan keluar )
        // $query = Complaint::with('user')
        //     ->whereIn('status', ['pending', 'process']);
        $query = Complaint::with('user', 'attachments') // <- WAJIB
        ->whereIn('status', ['pending', 'process']);

        // Fitur Search
        if ($request->search) {
            $query->where('title', 'like', '%' . $request->search . '%');
        }

        // Gunakan get() agar data dikirim sebagai Array
        $complaints = $query->latest()->get();

        // Statistik Global
        $stats = [
            'total'   => Complaint::count(),
            'pending' => Complaint::where('status', 'pending')->count(),
            'process' => Complaint::where('status', 'process')->count(),
            'done'    => Complaint::where('status', 'done')->count(),
        ];

        // PERHATIKAN DISINI: Gunakan 'Admin/Dashboard/Index' (Huruf Besar I)
        return Inertia::render('Admin/Dashboard/index', [
            'complaints' => $complaints,
            'stats'      => $stats,
            'filters'    => $request->only(['search'])
        ]);
    }

    // --- 2. HALAMAN LOGBOOK (ARCHIVE) ---
    public function logbook()
    {
        $logs = Complaint::with('user')
            ->where('status', 'done')
            ->latest()
            ->get();

        // PERHATIKAN DISINI: Gunakan 'Admin/Logbook/Index' (Huruf Besar I)
        return Inertia::render('Admin/Logbook/index', [
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

        // Skenario Reject
        if ($newStatus === 'rejected') {
            $complaint->delete();
            return redirect()->route('admin.dashboard')->with('message', 'Laporan ditolak.');
        }

        // Skenario Selesai / Proses
        $complaint->status = $newStatus;

        // Opsional: Simpan waktu selesai jika ada kolom finished_at
        // if ($newStatus === 'done') $complaint->finished_at = now();

        $complaint->save();

        return redirect()->back()->with('message', 'Status diperbarui.');
    }

    // --- 4. DETAIL PAGE ---
    public function show($id)
    {
        $complaint = Complaint::with('user')->findOrFail($id);

        return Inertia::render('Admin/Show', [
            'complaint' => $complaint
        ]);
    }
}
