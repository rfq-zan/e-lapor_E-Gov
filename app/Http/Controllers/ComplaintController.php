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
        $request->validate([
            'classification' => 'required|string',
            'title'          => 'required|string|max:255',
            'description'    => 'required|string',
            'date'           => 'required|date',
            'location'       => 'required|string',
            'instansi'       => 'required|string',
            'category'       => 'required|string',
            'privacy'        => 'required|in:normal,anonim',
            'images.'         => 'required|image|mimes:jpeg,png,jpg|max:5120',
            'images'         => 'max:5',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('complaints', 'public');
        }

        $user = $request->user();

        $complaint = Complaint::create([
            'user_id'        => $user ? $user->id : null,
            'classification' => $request->classification,
            'guest_name'     => $user ? $user->name : 'Anonymous',
            'guest_email'    => $user ? $user->email : $request->guest_email,
            'title'          => $request->title,
            'description'    => $request->description,
            'date'           => $request->date,
            'location'       => $request->location,
            'instansi'       => $request->instansi,
            'category'       => $request->category,
            'privacy'        => $request->privacy,
            'image'          => $imagePath,
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

        return redirect()->route('complaints.index')->with('message', 'Laporan berhasil dikirim!');
    }
}
