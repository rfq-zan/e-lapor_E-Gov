<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Complaint;
use Inertia\Inertia;
use Illuminate\support\Facades\Auth;

class ComplaintController extends Controller
{
    public function index()
    {
        $complaints = Complaint::with('user')->get();
        return Inertia::render('Complaints/Index', ['complaints' => $complaints]);
    }

public function store(Request $request)
    {
        // --- LANGKAH 1: CEK VALIDASI ---
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
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

        // JIKA VALIDASI GAGAL, MATIKAN PROGRAM & TAMPILKAN ERRORNYA
        if ($validator->fails()) {
            dd([
                'STATUS' => 'VALIDASI GAGAL',
                'ERROR' => $validator->errors()->all()
            ]);
        }

        // --- LANGKAH 2: CEK PENYIMPANAN DATABASE ---
        $user = $request->user();

        try {
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

            // JIKA BERHASIL CREATE DATA UTAMA
            // dd('BERHASIL CREATE DATA UTAMA! ID: ' . $complaint->id);

        } catch (\Exception $e) {
            // JIKA GAGAL CREATE, TAMPILKAN PESAN ERROR DATABASE
            dd([
                'STATUS' => 'DATABASE ERROR (Gagal Simpan)',
                'PESAN' => $e->getMessage()
            ]);
        }

        // --- LANGKAH 3: SIMPAN GAMBAR ---
        if ($request->hasFile('images')) {
            try {
                foreach ($request->file('images') as $file) {
                    $path = $file->store('attachments', 'public');
                    $complaint->attachments()->create([
                        'file_path' => $path,
                        'file_type' => $file->getClientMimeType()
                    ]);
                }
            } catch (\Exception $e) {
                dd('GAGAL UPLOAD GAMBAR: ' . $e->getMessage());
            }
        }

        return redirect()->back()->with('message', 'Laporan berhasil dikirim!');
    }
}
