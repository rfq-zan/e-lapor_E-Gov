import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

// --- STYLE STATUS (KONSISTEN TEMA MERAH & KOTAK) ---
const STATUS_STYLES = {
    pending:   'bg-yellow-100 text-yellow-800 border-yellow-300',
    process:   'bg-blue-100 text-blue-800 border-blue-300',
    done:      'bg-green-100 text-green-800 border-green-300',
    rejected:  'bg-red-100 text-red-800 border-red-300'
};

const formatStatus = (status) => {
    if (!status) return '-';
    return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function Show({ auth, complaint }) {

    // Fungsi Update Status
    const updateStatus = (newStatus) => {
        if (confirm(`Ubah status laporan ini menjadi ${newStatus.toUpperCase()}?`)) {
            router.patch(route('admin.complaints.update', complaint.id), {
                status: newStatus
            });
        }
    };

    // Fungsi Hapus/Tolak
    const handleReject = () => {
        if (confirm('Hapus laporan ini secara permanen?')) {
            router.patch(route('admin.complaints.update', complaint.id), {
                status: 'rejected'
            });
        }
    };

    // Tentukan arah tombol kembali
    const backRoute = complaint.status === 'done' ? route('admin.logbook') : route('admin.dashboard');
    const backLabel = complaint.status === 'done' ? 'Kembali ke Logbook' : 'Kembali ke Dashboard';

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="text-xl font-bold leading-tight text-gray-800">Detail Laporan</h2>}>
            <Head title={`Laporan #${complaint.id}`} />

            {/* BACKGROUND GRADASI MERAH */}
            <div className="min-h-screen py-12 font-sans bg-gradient-to-br from-red-900 via-red-600 to-red-400">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* --- TOP BAR: NAVIGASI KEMBALI --- */}
                    <div className="flex items-center justify-between mb-6">
                        <Link
                            href={backRoute}
                            className="inline-flex items-center px-4 py-2 font-bold text-white transition-colors rounded-sm hover:text-red-200 bg-white/10 backdrop-blur-sm"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" /></svg>
                            {backLabel}
                        </Link>

                        <div className="px-3 py-1 font-mono text-sm text-red-100 rounded-sm bg-white/10">
                            ID Laporan: #{complaint.id}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                        {/* --- KOLOM KIRI: INFO UTAMA & GAMBAR --- */}
                        <div className="space-y-6 lg:col-span-2">

                            {/* KARTU UTAMA */}
                            <div className="bg-white shadow-2xl border-0 !rounded-none p-8">

                                {/* Header Judul & Status */}
                                <div className="flex items-start justify-between pb-6 mb-6 border-b border-gray-100">
                                    <div>
                                        <h1 className="mb-2 text-2xl font-extrabold leading-tight text-gray-900">
                                            {complaint.title}
                                        </h1>
                                        <div className="flex items-center text-sm text-gray-500">
                                            <span className="flex items-center mr-3">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                {new Date(complaint.created_at).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                            </span>
                                            <span className="flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                {new Date(complaint.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-2 border !rounded-none text-sm font-bold uppercase tracking-wider ${STATUS_STYLES[complaint.status]}`}>
                                        {formatStatus(complaint.status)}
                                    </span>
                                </div>

                                {/* Deskripsi Masalah */}
                                <div className="mb-8">
                                    <h3 className="mb-3 text-sm font-bold tracking-wider text-gray-400 uppercase">Deskripsi Laporan</h3>
                                    <div className="text-lg leading-relaxed text-gray-800 whitespace-pre-line">
                                        {complaint.description}
                                    </div>
                                </div>

                                {/* Lokasi */}
                                {complaint.location && (
                                    <div className="mb-8 p-4 bg-gray-50 border border-gray-200 !rounded-none">
                                        <h3 className="flex items-center mb-2 text-xs font-bold tracking-wider text-gray-400 uppercase">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>
                                            Lokasi Kejadian
                                        </h3>
                                        <p className="font-medium text-gray-900">{complaint.location}</p>
                                    </div>
                                )}

                                {/* Bukti Foto (MULTI FILE FIX) */}
                                <div>
                                    <h3 className="mb-3 text-sm font-bold tracking-wider text-gray-400 uppercase">Bukti Foto</h3>

                                    {complaint.attachments && complaint.attachments.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                            {complaint.attachments.map((file, idx) => (
                                                <div key={idx} className="relative group">
                                                    <img
                                                        src={`/storage/${file.file_path}`}
                                                        alt={`Bukti ${idx + 1}`}
                                                        className="w-full h-auto object-cover border border-gray-200 !rounded-none shadow-sm"
                                                    />
                                                    <a
                                                        href={`/storage/${file.file_path}`}
                                                        target="_blank"
                                                        className="absolute bottom-4 right-4 bg-black/70 text-white px-4 py-2 text-sm font-bold hover:bg-black !rounded-none transition opacity-0 group-hover:opacity-100"
                                                    >
                                                        Lihat Full Size ↗
                                                    </a>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-8 bg-gray-50 border border-dashed border-gray-300 text-center text-gray-400 italic !rounded-none">
                                            Tidak ada bukti foto yang dilampirkan.
                                        </div>
                                    )}
                                </div>

                            </div>
                        </div>

                        {/* --- KOLOM KANAN: INFO PELAPOR & AKSI --- */}
                        <div className="space-y-6">

                            {/* KARTU PELAPOR */}
                            <div className="bg-white shadow-2xl border-0 !rounded-none p-6">
                                <h3 className="pb-2 mb-4 text-sm font-bold text-gray-900 uppercase border-b-2 border-red-600">
                                    Informasi Pelapor
                                </h3>

                                <div className="flex items-center mb-6">
                                    <div className="h-12 w-12 !rounded-none bg-red-600 flex items-center justify-center text-white font-bold text-xl mr-4 shadow-md">
                                        {(complaint.user ? complaint.user.name : (complaint.guest_name || 'G')).charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="text-lg font-bold text-gray-900">
                                            {complaint.user ? complaint.user.name : (complaint.guest_name || 'Guest (Anonim)')}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {complaint.user ? 'Masyarakat Terdaftar' : 'Laporan Tamu'}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div>
                                        <span className="block text-xs text-gray-400 uppercase">Email</span>
                                        <span className="font-medium text-gray-700">{complaint.user ? complaint.user.email : (complaint.guest_email || '-')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* KARTU AKSI ADMIN */}
                            <div className="bg-white shadow-2xl border-0 !rounded-none p-6">
                                <h3 className="pb-2 mb-4 text-sm font-bold text-gray-900 uppercase border-b-2 border-red-600">
                                    Tindakan Admin
                                </h3>

                                <div className="space-y-3">
                                    {complaint.status === 'pending' && (
                                        <button
                                            onClick={() => updateStatus('process')}
                                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md !rounded-none transition-all flex justify-center items-center"
                                        >
                                            PROSES LAPORAN INI
                                        </button>
                                    )}

                                    {complaint.status === 'process' && (
                                        <button
                                            onClick={() => updateStatus('done')}
                                            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold shadow-md !rounded-none transition-all flex justify-center items-center"
                                        >
                                            TANDAI SELESAI (DONE)
                                        </button>
                                    )}

                                    {complaint.status !== 'done' && (
                                        <button
                                            onClick={handleReject}
                                            className="w-full py-3 bg-white border-2 border-red-100 text-red-600 hover:bg-red-50 font-bold !rounded-none transition-all"
                                        >
                                            TOLAK / HAPUS LAPORAN
                                        </button>
                                    )}
                                </div>

                                {complaint.status === 'done' && (
                                    <div className="mt-4 p-4 bg-green-50 text-green-800 text-sm font-bold text-center border border-green-200 !rounded-none flex flex-col items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 mb-2 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        Laporan ini telah diarsipkan (Selesai).
                                        <span className="mt-1 text-xs font-normal text-green-600">Tidak ada tindakan lebih lanjut yang diperlukan.</span>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
