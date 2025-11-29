import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

const STATUS_COLORS = {
    pending:   'bg-yellow-100 text-yellow-800 border border-yellow-200',
    process:   'bg-blue-100 text-blue-800 border border-blue-200',
    done:      'bg-green-100 text-green-800 border border-green-200',
    rejected:  'bg-red-100 text-red-800 border border-red-200'
};

const formatStatus = (status) => {
    if (!status) return '-';
    return status.charAt(0).toUpperCase() + status.slice(1);
};

export default function Index({ auth, complaints, flash, stats, filters }) {
    // State untuk Search
    const [search, setSearch] = useState(filters?.search || '');

    // Handle Update Status (Proses / Selesai)
    const updateStatus = (id, newStatus) => {
        if (confirm(`Ubah status menjadi ${newStatus.toUpperCase()}?`)) {
            router.patch(route('admin.complaints.update', id), {
                status: newStatus
            });
        }
    };

    // Handle Reject (Tolak Laporan)
    const handleReject = (id) => {
        if (confirm('Yakin tolak laporan? Data akan dihapus permanen dan pelapor dinotifikasi.')) {
            router.patch(route('admin.complaints.update', id), {
                status: 'rejected'
            });
        }
    };

    // Handle Search Submit
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.dashboard'), { search }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard Admin Dinas" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* --- 1. NAVIGASI DASHBOARD VS LOGBOOK --- */}
                    <div className="flex mb-6 space-x-4">
                        <Link href={route('admin.dashboard')} className="px-4 py-2 font-bold text-white bg-indigo-600 rounded shadow">
                            Active Jobs (Pending/Proses)
                        </Link>
                        <Link href={route('admin.logbook')} className="px-4 py-2 font-medium text-gray-700 bg-white border rounded shadow hover:bg-gray-50">
                            Logbook (Arsip Selesai)
                        </Link>
                    </div>

                    {/* NOTIFIKASI SUKSES */}
                    {flash?.message && (
                        <div className="relative px-4 py-3 mb-6 text-green-700 bg-green-100 border border-green-400 rounded">
                            <strong className="font-bold">Berhasil! </strong>
                            <span className="block sm:inline">{flash.message}</span>
                        </div>
                    )}

                    {/* WIDGET STATISTIK */}
                    {stats && (
                        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-4">
                            <div className="p-6 bg-white border-l-4 border-gray-500 rounded-lg shadow">
                                <div className="font-bold text-gray-500">Total</div>
                                <div className="text-2xl font-bold">{stats.total}</div>
                            </div>
                            <div className="p-6 bg-white border-l-4 border-yellow-500 rounded-lg shadow">
                                <div className="font-bold text-yellow-600">Pending</div>
                                <div className="text-2xl font-bold">{stats.pending}</div>
                            </div>
                            <div className="p-6 bg-white border-l-4 border-blue-500 rounded-lg shadow">
                                <div className="font-bold text-blue-600">Proses</div>
                                <div className="text-2xl font-bold">{stats.process}</div>
                            </div>
                            <div className="p-6 bg-white border-l-4 border-green-500 rounded-lg shadow">
                                <div className="font-bold text-green-600">Selesai</div>
                                <div className="text-2xl font-bold">{stats.done}</div>
                            </div>
                        </div>
                    )}

                    {/* TABEL DATA */}
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">

                            {/* HEADER TABEL + SEARCH BAR */}
                            <div className="flex flex-col items-center justify-between gap-4 mb-4 md:flex-row">
                                <h3 className="text-lg font-bold">Daftar Laporan Masuk</h3>

                                <form onSubmit={handleSearch} className="flex w-full gap-2 md:w-auto">
                                    <input
                                        type="text"
                                        className="w-full text-sm border-gray-300 rounded-md md:w-64"
                                        placeholder="Cari Judul Laporan..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <button className="px-4 py-2 text-sm font-bold text-white bg-gray-800 rounded hover:bg-gray-700">
                                        Cari
                                    </button>
                                </form>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Tanggal</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Pelapor</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Judul & Masalah</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Bukti</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Aksi</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {complaints.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                    {new Date(item.created_at).toLocaleDateString('id-ID')}
                                                    <div className="mt-1 text-xs font-bold text-gray-400 uppercase">{item.classification}</div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                    {/* Tampilkan Guest Name jika user null (Anonim) */}
                                                    <div>{item.user ? item.user.name : (item.guest_name || 'Anonymous')}</div>
                                                    <div className="text-xs font-normal text-gray-400">
                                                        {item.user ? item.user.email : (item.guest_email || '-')}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    <Link
                                                        href={route('admin.complaints.show', item.id)}
                                                        className="block mb-1 font-bold text-indigo-600 hover:text-indigo-900 hover:underline"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                    <div className="w-48 text-xs truncate">{item.description}</div>
                                                    <div className="mt-1 text-xs text-blue-500">📍 {item.location || '-'}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {item.attachments && item.attachments.length > 0 ? (
                                                        <a
                                                            href={`/storage/${item.attachments[0].file_path}`}
                                                            target="_blank"
                                                            className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                                                        >
                                                            📷 {item.attachments.length} File
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">No Img</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        STATUS_COLORS[item.status] || 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {formatStatus(item.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 space-x-2 text-sm font-medium whitespace-nowrap">
                                                    {/* TOMBOL UPDATE */}
                                                    {item.status === 'pending' && (
                                                        <button
                                                            onClick={() => updateStatus(item.id, 'process')}
                                                            className="px-3 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700"
                                                        >
                                                            Proses
                                                        </button>
                                                    )}
                                                    {item.status === 'process' && (
                                                        <button
                                                            onClick={() => updateStatus(item.id, 'done')}
                                                            className="px-3 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700"
                                                        >
                                                            Selesai
                                                        </button>
                                                    )}

                                                    {/* TOMBOL TOLAK (REJECT) */}
                                                    <button
                                                        onClick={() => handleReject(item.id)}
                                                        className="px-3 py-1 text-xs text-red-600 bg-red-100 border border-red-200 rounded hover:bg-red-200"
                                                    >
                                                        Tolak
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {complaints.length === 0 && (
                                    <div className="p-10 text-center text-gray-500">
                                        Tidak ada laporan aktif (Pending/Proses).
                                        <br/>
                                        Cek <Link href={route('admin.logbook')} className="text-indigo-600 underline">Logbook</Link> untuk laporan selesai.
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
