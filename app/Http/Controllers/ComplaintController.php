<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Complaint;
use Inertia\Inertia;
use Illuminate\support\Facades\Storage;

class ComplaintController extends Controller
{
    public function index()
    {
        $complaints = Complaint::with('user')->get();
        return Inertia::render('Complaints/Index', ['complaints' => $complaints]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'classification' => 'required|string',
            'title'          => 'required|string|max:255',
            'description'    => 'required|string',
            'date'           => 'required|date',
            'location'       => 'required|string',
            'instansi'       => 'required|string',
            'category'       => 'required|string',
            'privacy'        => 'required|in:normal,anonim',
            'image'          => 'required|image|mimes:jpeg,png,jpg|max:5120',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('complaints', 'public');
        }
        Complaint::create([
            'user_id'        => $request->user()->id,
            'classification' => $request->classification,
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

        return redirect()->route('complaints.index')->with('message', 'Laporan berhasil dikirim!');
    }
}
