import React from "react";
// HAPUS AuthenticatedLayout, kita pakai Link & router manual
import { Head, useForm, Link, router } from "@inertiajs/react";

export default function Index({ auth, complaints }) {
    // 1. Setup Form State
    const { data, setData, post, processing, reset, errors } = useForm({
        classification: "pengaduan",
        title: "",
        description: "",
        date: "",
        location: "",
        instansi: "",
        category: "",
        privacy: "normal",
        images: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("complaints.store"), {
            onSuccess: () => reset(),
        });
    };

    // Fungsi Logout manual
    const handleLogout = () => {
        router.post(route('logout'));
    };

    return (
        // GANTI AuthenticatedLayout DENGAN DIV BIASA
        <div className="min-h-screen bg-gray-50">
            <Head title="Lapor Keluhan" />

            {/* --- NAVBAR CUSTOM (HYBRID) --- */}
            {/* Navbar ini aman untuk Guest karena kita cek 'auth.user' dulu */}
            <nav className="text-white bg-red-700 shadow-md">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Kiri: Logo */}
                        <div className="flex items-center gap-2">
                            <div className="p-1 bg-white rounded">
                                <svg className="w-8 h-8 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                            </div>
                            <span className="text-xl font-bold tracking-wider">E-LAPOR!</span>
                        </div>

                        {/* Kanan: Menu Login/User */}
                        <div className="flex items-center gap-4">
                            {auth.user ? (
                                // JIKA SUDAH LOGIN
                                <>
                                    <div className="hidden text-right md:block">
                                        <div className="text-sm font-bold">{auth.user.name}</div>
                                    </div>
                                    {auth.user.role === 'admin' && (
                                        <Link href={route('admin.dashboard')} className="px-3 py-1 text-sm font-bold text-red-700 bg-white rounded hover:bg-gray-100">
                                            Dashboard
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="px-3 py-1 text-sm transition border border-white rounded hover:bg-red-800"
                                    >
                                        Keluar
                                    </button>
                                </>
                            ) : (
                                // JIKA TAMU (ANONIM)
                                <>
                                    <Link href={route('login')} className="text-sm font-bold hover:text-red-200">
                                        MASUK
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-4 py-2 text-sm font-bold transition border border-white rounded hover:bg-white hover:text-red-700"
                                    >
                                        DAFTAR
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION (Merah) --- */}
            <div className="pt-10 pb-32 bg-red-700">
                <div className="px-4 mx-auto text-center text-white max-w-7xl sm:px-6 lg:px-8">
                    <h1 className="mb-4 text-3xl font-extrabold md:text-4xl">Layanan Aspirasi dan Pengaduan Online Rakyat</h1>
                    <p className="max-w-2xl mx-auto text-lg text-red-100">
                        Sampaikan laporan Anda langsung kepada instansi pemerintah berwenang.
                    </p>
                </div>
            </div>

            {/* --- CONTENT CONTAINER (Form & List) --- */}
            <div className="max-w-5xl px-4 pb-12 mx-auto -mt-24 sm:px-6 lg:px-8">

                {/* BAGIAN 1: FORM INPUT */}
                <div className="p-6 mb-12 bg-white rounded-lg shadow-xl">
                    <div className="pb-4 mb-6 border-b">
                        <h2 className="text-2xl font-bold text-gray-800">Sampaikan Laporan Anda</h2>
                    </div>

                    {/* PILIH KLASIFIKASI */}
                    <div className="flex flex-wrap gap-3 mb-6">
                        {["pengaduan", "aspirasi", "permintaan"].map((item) => (
                            <button
                                key={item}
                                type="button"
                                className={`px-5 py-2 rounded-full font-bold text-sm transition-all border-2 ${
                                    data.classification === item
                                        ? "bg-red-50 border-red-600 text-red-600"
                                        : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"
                                }`}
                                onClick={() => setData("classification", item)}
                            >
                                {item.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={submit} encType="multipart/form-data" className="space-y-5">

                        {/* Judul */}
                        <div>
                            <input
                                type="text"
                                className="w-full py-3 mt-1 border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                placeholder="Ketik Judul Laporan Anda *"
                                value={data.title}
                                onChange={(e) => setData("title", e.target.value)}
                            />
                            {errors.title && <div className="mt-1 text-xs text-red-500">{errors.title}</div>}
                        </div>

                        {/* Isi Laporan */}
                        <div>
                            <textarea
                                rows={5}
                                className="w-full py-3 mt-1 border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                placeholder="Ketik Isi Laporan Anda *"
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                            ></textarea>
                            {errors.description && <div className="mt-1 text-xs text-red-500">{errors.description}</div>}
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {/* Tanggal */}
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Tanggal Kejadian</label>
                                <input
                                    type="date"
                                    className="w-full border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                    value={data.date}
                                    onChange={(e) => setData("date", e.target.value)}
                                />
                                {errors.date && <div className="mt-1 text-xs text-red-500">{errors.date}</div>}
                            </div>

                            {/* Lokasi */}
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700">Lokasi Kejadian</label>
                                <input
                                    type="text"
                                    className="w-full border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                    placeholder="Ketik Lokasi Kejadian *"
                                    value={data.location}
                                    onChange={(e) => setData("location", e.target.value)}
                                />
                                {errors.location && <div className="mt-1 text-xs text-red-500">{errors.location}</div>}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            {/* Instansi */}
                            <div>
                                <select
                                    className="w-full mt-1 text-gray-600 border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                    value={data.instansi}
                                    onChange={(e) => setData("instansi", e.target.value)}
                                >
                                    <option value="">Pilih Instansi Tujuan</option>
                                    <option>DLH SOEMENEPZ</option>
                                    <option>Dinas Pendidikan SOEMENEPZ</option>
                                    <option>Dinas Kesehatan SOEMENEPZ</option>
                                    <option>Dinas PU SOEMENEPZ</option>
                                    <option>Dinas Sosial SOEMENEPZ</option>
                                    <option>Dishub SOEMENEPZ</option>
                                    <option>Polres SOEMENEPZ</option>
                                </select>
                                {errors.instansi && <div className="mt-1 text-xs text-red-500">{errors.instansi}</div>}
                            </div>

                            {/* Kategori */}
                            <div>
                                <select
                                    className="w-full mt-1 text-gray-600 border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                                    value={data.category}
                                    onChange={(e) => setData("category", e.target.value)}
                                >
                                    <option value="">Pilih Kategori Laporan</option>
                                    <option>Sampah</option>
                                    <option>Infrastruktur</option>
                                    <option>Lingkungan</option>
                                    <option>Pelayanan Publik</option>
                                    <option>Kesehatan</option>
                                    <option>Pendidikan</option>
                                    <option>Keamanan</option>
                                    <option>Lainnya</option>
                                </select>
                                {errors.category && <div className="mt-1 text-xs text-red-500">{errors.category}</div>}
                            </div>
                        </div>

                        {/* Upload Multi File */}
                        <div className="p-4 border border-gray-300 border-dashed rounded-lg bg-gray-50">
                            <label className="block mb-2 text-sm font-medium text-gray-700">Upload Lampiran (Bisa lebih dari satu)</label>
                            <input
                                type="file"
                                multiple
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                                onChange={(e) => setData("images", Array.from(e.target.files))}
                            />
                            <p className="mt-1 text-xs text-gray-500">Maksimal 5 foto (JPG, PNG). Maks 5MB total.</p>
                            {errors.images && <div className="mt-1 text-xs text-red-500">{errors.images}</div>}
                        </div>

                        {/* PRIVACY */}
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700">Opsi Privasi</label>
                            <div className="flex gap-6">
                                {[
                                    { label: "Tampilkan Nama (Publik)", value: "normal" },
                                    { label: "Samarkan Nama (Anonim)", value: "anonim" },
                                ].map((item) => (
                                    <label key={item.value} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="privacy"
                                            value={item.value}
                                            checked={data.privacy === item.value}
                                            onChange={(e) => setData("privacy", e.target.value)}
                                            className="text-red-600 focus:ring-red-500"
                                        />
                                        <span className="text-sm text-gray-700">{item.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* SUBMIT BUTTON */}
                        <div className="flex justify-end pt-4">
                            <button
                                disabled={processing}
                                className="w-full px-8 py-3 font-bold text-white transition-all bg-red-600 rounded-lg shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed md:w-auto"
                            >
                                {processing ? "SEDANG MENGIRIM..." : "LAPOR!"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* --- BAGIAN 2: LIST LAPORAN (TIMELINE STYLE) --- */}
                <div className="p-8 bg-white rounded-lg shadow-lg">
                    <h2 className="pb-4 mb-8 text-2xl font-bold text-gray-800 border-b">Riwayat Laporan Terbaru</h2>

                    {complaints.length === 0 ? (
                        <div className="py-12 text-center">
                            <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-500">Belum ada laporan masuk.</p>
                        </div>
                    ) : (
                        <div className="relative ml-4 space-y-10 border-l-2 border-indigo-100">
                            {complaints.map((item) => (
                                <div key={item.id} className="relative ml-8">

                                    {/* 1. DOT INDIKATOR */}
                                    <span className={`absolute -left-12 top-0 flex items-center justify-center w-8 h-8 rounded-full ring-4 ring-white ${
                                        item.status === 'done' ? 'bg-green-500' :
                                        item.status === 'process' ? 'bg-blue-500' :
                                        item.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-400'
                                    }`}>
                                        {/* Icon SVG */}
                                        {item.status === 'done' ? (
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                        ) : (
                                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        )}
                                    </span>

                                    {/* 2. CARD CONTENT */}
                                    <div className="p-6 transition-shadow duration-300 bg-white border border-gray-200 rounded-xl hover:shadow-lg">
                                        <div className="flex flex-col mb-4 md:flex-row md:justify-between md:items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase ${
                                                        item.classification === 'pengaduan' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                                                    }`}>
                                                        {item.classification}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(item.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                                            </div>
                                            <span className={`mt-2 md:mt-0 px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide inline-block text-center ${
                                                item.status === 'done' ? 'bg-green-100 text-green-800' :
                                                item.status === 'process' ? 'bg-blue-100 text-blue-800' :
                                                item.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </div>

                                        <p className="mb-4 text-gray-600 whitespace-pre-wrap">{item.description}</p>

                                        {/* INFO TAMBAHAN */}
                                        <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-gray-500">
                                            <span className="flex items-center gap-1 font-semibold text-gray-700">
                                                👤 {item.user ? item.user.name : (item.guest_name || 'Anonim')}
                                            </span>
                                            <span className="flex items-center gap-1">📍 {item.location}</span>
                                            <span className="flex items-center gap-1">🏢 {item.instansi}</span>
                                        </div>

                                        {/* 3. MULTI FILE GALLERY */}
                                        {item.attachments && item.attachments.length > 0 && (
                                            <div className="grid grid-cols-2 gap-3 pt-4 mt-4 border-t border-gray-100 md:grid-cols-4">
                                                {item.attachments.map((file, index) => (
                                                    <a
                                                        key={index}
                                                        href={`/storage/${file.file_path}`}
                                                        target="_blank"
                                                        className="relative block overflow-hidden bg-gray-100 border rounded-lg group aspect-square"
                                                    >
                                                        <img
                                                            src={`/storage/${file.file_path}`}
                                                            alt="Lampiran"
                                                            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center transition-all bg-black bg-opacity-0 group-hover:bg-opacity-20">
                                                            <span className="px-2 py-1 text-xs font-bold text-white bg-black bg-opacity-50 rounded opacity-0 group-hover:opacity-100">Lihat</span>
                                                        </div>
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
