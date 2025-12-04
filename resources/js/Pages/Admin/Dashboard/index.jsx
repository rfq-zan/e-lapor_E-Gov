import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

// --- STYLE STATUS BADGE ---
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

export default function Index({ auth, complaints, flash, stats, filters }) {
    const [search, setSearch] = useState(filters?.search || '');

    const updateStatus = (id, newStatus) => {
        if (confirm(`Ubah status menjadi ${newStatus.toUpperCase()}?`)) {
            router.patch(route('admin.complaints.update', id), {
                status: newStatus
            });
        }
    };

    const handleReject = (id) => {
        if (confirm('Yakin tolak laporan? Data akan dihapus permanen.')) {
            router.patch(route('admin.complaints.update', id), {
                status: 'rejected'
            });
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.dashboard'), { search }, { preserveState: true });
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="text-xl font-bold leading-tight text-gray-800">Dashboard Admin Dinas</h2>}>
            <Head title="Dashboard Admin Dinas" />

            {/* BACKGROUND GRADASI MERAH */}
            <div className="min-h-screen py-12 font-sans bg-gradient-to-br from-red-900 via-red-600 to-red-400">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* --- HEADER SECTION --- */}
                    <div className="flex flex-col items-end justify-between pb-4 mb-8 border-b md:flex-row border-red-300/30">
                        <div>
                            <h2 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
                                E-Lapor Dashboard
                            </h2>
                            <p className="mt-1 text-sm text-red-100">Kelola aspirasi dan pengaduan masyarakat.</p>
                        </div>

                        {/* Tab Navigasi */}
                        <div className="flex p-1 mt-4 border rounded-sm shadow-lg md:mt-0 bg-white/10 backdrop-blur-sm border-white/20">
                            <Link
                                href={route('admin.dashboard')}
                                className="px-6 py-2 text-sm font-bold text-red-700 bg-white shadow-sm !rounded-none transition-all cursor-default"
                            >
                                ACTIVE JOBS
                            </Link>
                            <Link
                                href={route('admin.logbook')}
                                className="px-6 py-2 text-sm font-bold text-white hover:bg-white/20 !rounded-none transition-all"
                            >
                                ARSIP LOGBOOK
                            </Link>
                        </div>
                    </div>

                    {/* NOTIFIKASI */}
                    {flash?.message && (
                        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-600 text-green-800 shadow-lg !rounded-none flex items-center">
                            <span className="font-bold">Berhasil!</span> <span className="ml-2">{flash.message}</span>
                        </div>
                    )}

                    {/* STATISTIK */}
                    {stats && (
                        <div className="grid grid-cols-1 gap-6 mb-10 md:grid-cols-4">
                            <div className="bg-white p-6 shadow-xl border-t-4 border-gray-600 !rounded-none transform hover:-translate-y-1 transition-all">
                                <p className="mb-1 text-xs font-bold tracking-wider text-gray-500 uppercase">Total Laporan</p>
                                <h3 className="text-4xl font-extrabold text-gray-800">{stats.total}</h3>
                            </div>
                            <div className="bg-white p-6 shadow-xl border-t-4 border-yellow-500 !rounded-none transform hover:-translate-y-1 transition-all">
                                <p className="mb-1 text-xs font-bold tracking-wider text-yellow-600 uppercase">Menunggu</p>
                                <h3 className="text-4xl font-extrabold text-gray-800">{stats.pending}</h3>
                            </div>
                            <div className="bg-white p-6 shadow-xl border-t-4 border-blue-500 !rounded-none transform hover:-translate-y-1 transition-all">
                                <p className="mb-1 text-xs font-bold tracking-wider text-blue-600 uppercase">Diproses</p>
                                <h3 className="text-4xl font-extrabold text-gray-800">{stats.process}</h3>
                            </div>
                            <div className="bg-white p-6 shadow-xl border-t-4 border-green-500 !rounded-none transform hover:-translate-y-1 transition-all">
                                <p className="mb-1 text-xs font-bold tracking-wider text-green-600 uppercase">Selesai</p>
                                <h3 className="text-4xl font-extrabold text-gray-800">{stats.done}</h3>
                            </div>
                        </div>
                    )}

                    {/* TABEL DATA */}
                    <div className="bg-white shadow-2xl border-0 !rounded-none">

                        {/* Toolbar */}
                        <div className="flex flex-col items-center justify-between gap-4 p-6 border-b border-gray-100 md:flex-row bg-gray-50">
                            <div className="flex items-center w-full gap-3 md:w-auto">
                                <div className="w-1.5 h-10 bg-red-600"></div>
                                <div>
                                    <h3 className="text-lg font-bold leading-tight text-gray-900">Laporan Masuk</h3>
                                    <p className="text-xs text-gray-500">Status Pending & Proses</p>
                                </div>
                            </div>

                            <form onSubmit={handleSearch} className="relative flex w-full md:w-auto">
                                <input
                                    type="text"
                                    className="w-full md:w-72 pl-4 pr-4 py-2 text-sm border-gray-300 focus:border-red-600 focus:ring-red-600 !rounded-none shadow-sm placeholder-gray-400"
                                    placeholder="Cari Judul..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                                <button className="px-6 py-2 text-sm font-bold text-white bg-red-800 hover:bg-red-900 !rounded-none shadow-sm transition-colors hidden md:block">
                                    CARI
                                </button>
                            </form>
                        </div>

                        {/* Table */}
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-white">
                                    <tr className="border-b-2 border-red-600">
                                        <th className="px-6 py-4 text-xs font-extrabold tracking-wider text-left text-gray-600 uppercase">Tanggal</th>
                                        <th className="px-6 py-4 text-xs font-extrabold tracking-wider text-left text-gray-600 uppercase">Pelapor</th>
                                        <th className="w-1/3 px-6 py-4 text-xs font-extrabold tracking-wider text-left text-gray-600 uppercase">Detail Laporan</th>
                                        <th className="px-6 py-4 text-xs font-extrabold tracking-wider text-left text-gray-600 uppercase">Bukti</th>
                                        <th className="px-6 py-4 text-xs font-extrabold tracking-wider text-left text-gray-600 uppercase">Status</th>
                                        <th className="px-6 py-4 text-xs font-extrabold tracking-wider text-right text-gray-600 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {complaints.map((item) => (
                                        <tr key={item.id} className="transition-colors hover:bg-red-50/20 group">
                                            <td className="px-6 py-5 text-sm align-top whitespace-nowrap">
                                                <div className="font-bold text-gray-800">{new Date(item.created_at).toLocaleDateString('id-ID')}</div>
                                                <div className="mt-1 text-xs text-gray-400">{new Date(item.created_at).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}</div>
                                                {item.classification && (
                                                    <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200 !rounded-none uppercase">
                                                        {item.classification}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 align-top whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">
                                                    {/* Perbaikan: Handle User Login vs Anonim */}
                                                    {item.user ? item.user.name : (item.guest_name || 'Guest')}
                                                </div>
                                                <div className="text-xs text-gray-500 font-mono mt-0.5">
                                                    {item.user ? item.user.email : (item.guest_email || '-')}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 align-top">
                                                <Link href={route('admin.complaints.show', item.id)} className="block cursor-pointer group">
                                                    <div className="mb-1 text-base font-bold text-gray-800 transition-colors group-hover:text-red-600 line-clamp-1">{item.title}</div>
                                                    <div className="mb-2 text-sm leading-relaxed text-gray-600 line-clamp-2">{item.description}</div>
                                                    {item.location && <div className="flex items-center gap-1 text-xs font-medium text-gray-500">📍 {item.location}</div>}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-5 align-top whitespace-nowrap">
                                                {item.attachments && item.attachments.length > 0 ? (
                                                    <div className="relative z-0 flex -space-x-3 transition-all duration-300 hover:space-x-1 hover:z-10">
                                                        {item.attachments.slice(0, 3).map((file, idx) => (
                                                            <a
                                                                key={file.id}
                                                                href={`/storage/${file.file_path}`}
                                                                target="_blank"
                                                                className={`relative z-${30 - idx * 10} inline-block h-12 w-12 rounded-lg ring-2 ring-white shadow-sm overflow-hidden hover:scale-110 hover:z-50 transition-transform bg-gray-100`}
                                                                title="Klik untuk memperbesar"
                                                            >
                                                                <img
                                                                    src={`/storage/${file.file_path}`}
                                                                    alt={`Bukti ${idx}`}
                                                                    className="object-cover w-full h-full"
                                                                />
                                                            </a>
                                                        ))}
                                                        {item.attachments.length > 3 && (
                                                            <Link
                                                                href={route('admin.complaints.show', item.id)}
                                                                className="relative z-0 inline-flex items-center justify-center w-12 h-12 text-xs font-bold text-white transition-colors bg-red-600 rounded-lg ring-2 ring-white hover:bg-red-700"
                                                            >
                                                                +{item.attachments.length - 3}
                                                            </Link>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="text-xs italic text-gray-400">No File</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 align-top whitespace-nowrap">
                                                <span className={`inline-flex items-center px-3 py-1 border !rounded-none text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[item.status]}`}>
                                                    {formatStatus(item.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 text-right align-top whitespace-nowrap">
                                                <div className="flex flex-col items-end justify-end gap-2">
                                                    {item.status === 'pending' && <button onClick={() => updateStatus(item.id, 'process')} className="w-24 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold !rounded-none shadow-sm">PROSES</button>}
                                                    {item.status === 'process' && <button onClick={() => updateStatus(item.id, 'done')} className="w-24 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold !rounded-none shadow-sm">SELESAI</button>}
                                                    <button onClick={() => handleReject(item.id)} className="w-24 px-3 py-1.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold !rounded-none transition-colors">TOLAK</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {complaints.length === 0 && (
                                <div className="p-16 text-center bg-white">
                                    <h3 className="text-lg font-bold text-gray-900">Belum Ada Laporan Aktif</h3>
                                    <p className="mt-1 mb-4 text-sm text-gray-500">Semua laporan berstatus Pending atau Proses akan muncul di sini.</p>
                                    <Link href={route('admin.logbook')} className="text-red-600 hover:text-red-800 text-sm font-bold border-b border-red-600 pb-0.5">Lihat Arsip Logbook &rarr;</Link>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
