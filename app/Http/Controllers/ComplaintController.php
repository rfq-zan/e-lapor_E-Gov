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
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'required|image|max:2048',
            'location' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('complaint_images', 'public');
            $validated['image'] = $path;
        }

        $validated['user_id'] = $request->user()->id;
        Complaint::create($validated);

        return redirect()->back()->with('success', 'Komplain sudah masuk ke dalam data.');
    }
}
