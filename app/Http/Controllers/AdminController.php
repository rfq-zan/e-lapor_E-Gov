<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Complaint;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function index()
    {
        $complaints = Complaint::with('user')->latest()->get();

        $stats = [
            'total'   => Complaint::count(),
            'pending' => Complaint::where('status', 'pending')->count(),
            'process' => Complaint::where('status', 'process')->count(),
            'done'    => Complaint::where('status', 'done')->count(),
        ];

        return Inertia::render('Admin/Dashboard/index', [
            'complaints' => $complaints,
            'stats'      => $stats
        ]);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,process,done,rejected',
        ]);

        $complaint = Complaint::findOrFail($id);
        $complaint->status = $request->input('status');
        $complaint->save();

        return redirect()->back()->with('message', 'Status komplain berhasil diperbarui.');
    }

    public function show($id)
    {
        $complaint = Complaint::with('user')->findOrFail($id);

        // Pastikan file ini ada di: resources/js/Pages/Admin/Show.jsx
        return Inertia::render('Admin/Show', [
            'complaint' => $complaint
        ]);
    }
}
