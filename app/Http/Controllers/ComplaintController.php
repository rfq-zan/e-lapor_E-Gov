<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Models\ComplaintAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    public function index()
    {
        // Load data dengan relasi attachments agar gambar muncul
        $complaints = Complaint::with('user', 'attachments')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('Complaints/Index', ['complaints' => $complaints]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'classification' => 'required|string',
            'title'          => 'required|string|max:255',
            'description'    => 'required|string',
            'date'           => 'required|date',
            'location'       => 'required|string',
            'instansi'       => 'required|string',
            'category'       => 'required|string',
            'privacy'        => 'required|in:normal,anonim',
            'images'         => 'array|max:5',
            'images.*'       => 'image|mimes:jpeg,png,jpg|max:5120',
        ]);

        $user = $request->user();

        $complaint = Complaint::create([
            'user_id'        => $user ? $user->id : null,
            'classification' => $request->classification,
            'guest_name'     => $user ? $user->name : 'Anonymous',
            'guest_email'    => $user ? $user->email : null,
            'title'          => $request->title,
            'description'    => $request->description,
            'date'           => $request->date,
            'location'       => $request->location,
            'instansi'       => $request->instansi,
            'category'       => $request->category,
            'privacy'        => $request->privacy,
            'status'         => 'pending'
        ]);

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $path = $file->store('attachments', 'public');

                $complaint->attachments()->create([
                    'file_path' => $path,
                    'file_type' => $file->getClientMimeType()
                ]);
            }
        }

        return redirect()->back()->with('message', 'Laporan berhasil dikirim!');
    }

    /**
     * Update laporan lengkap (Teks + Gambar)
     * Batas waktu: 5 Menit sejak dibuat.
     */
    public function update(Request $request, $id)
    {
        $complaint = Complaint::with('attachments')->findOrFail($id);

        if ($complaint->status !== 'pending') {
            return redirect()->back()->withErrors(['message' => 'Laporan sudah diproses admin, tidak bisa diedit lagi.']);
        }

        $diffInMinutes = Carbon::parse($complaint->created_at)->diffInMinutes(now());
        if ($diffInMinutes > 5) {
            return redirect()->back()->withErrors(['message' => 'Batas waktu pengeditan (5 menit) telah habis.']);
        }

        $request->validate([
            'classification' => 'required|string',
            'title'          => 'required|string|max:255',
            'description'    => 'required|string',
            'date'           => 'required|date',
            'location'       => 'required|string',
            'instansi'       => 'required|string',
            'category'       => 'required|string',
            'privacy'        => 'required|in:normal,anonim,rahasia',

            'new_images'     => 'array|max:5',
            'new_images.*'   => 'image|mimes:jpeg,png,jpg|max:5120',

            'images_to_delete'   => 'array',
            'images_to_delete.*' => 'integer|exists:complaint_attachments,id',
        ]);

        $complaint->update([
            'classification' => $request->classification,
            'title'          => $request->title,
            'description'    => $request->description,
            'date'           => $request->date,
            'location'       => $request->location,
            'instansi'       => $request->instansi,
            'category'       => $request->category,
            'privacy'        => $request->privacy,
        ]);

        // 5. HAPUS GAMBAR LAMA
        if ($request->has('images_to_delete') && !empty($request->images_to_delete)) {
            $attachmentsToDelete = $complaint->attachments()
                                             ->whereIn('id', $request->images_to_delete)
                                             ->get();

            foreach ($attachmentsToDelete as $attachment) {
                if (Storage::disk('public')->exists($attachment->file_path)) {
                    Storage::disk('public')->delete($attachment->file_path);
                }
                $attachment->delete();
            }
        }

        if ($request->hasFile('new_images')) {
            foreach ($request->file('new_images') as $file) {
                $path = $file->store('attachments', 'public');

                $complaint->attachments()->create([
                    'file_path' => $path,
                    'file_type' => $file->getClientMimeType()
                ]);
            }
        }

        return redirect()->back()->with('message', 'Perubahan laporan berhasil disimpan!');
    }
}
