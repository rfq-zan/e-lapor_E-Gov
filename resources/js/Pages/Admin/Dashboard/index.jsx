import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

// --- STYLE STATUS BADGE ---
const STATUS_STYLES = {
    pending:  'bg-yellow-100 text-yellow-800 border-yellow-300',
    process:  'bg-blue-100 text-blue-800 border-blue-300',
    done:     'bg-green-100 text-green-800 border-green-300',
    rejected: 'bg-red-100 text-red-800 border-red-300'
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
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-bold text-xl text-gray-800 leading-tight">Dashboard Admin Dinas</h2>}>
            <Head title="Dashboard Admin Dinas" />

            {/* BACKGROUND GRADASI MERAH */}
            <div className="py-12 min-h-screen font-sans bg-gradient-to-br from-red-900 via-red-600 to-red-400">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* --- HEADER SECTION --- */}
                    {/* Teks diubah jadi Putih agar terbaca */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-red-300/30 pb-4">
                        <div>
                            <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                                E-Lapor Dashboard
                            </h2>
                            <p className="text-red-100 text-sm mt-1">Kelola aspirasi dan pengaduan masyarakat.</p>
                        </div>
                        
                        {/* Tab Navigasi */}
                        <div className="flex mt-4 md:mt-0 bg-white/10 backdrop-blur-sm p-1 border border-white/20 shadow-lg rounded-sm">
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
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                            <div className="bg-white p-6 shadow-xl border-t-4 border-gray-600 !rounded-none transform hover:-translate-y-1 transition-all">
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Total Laporan</p>
                                <h3 className="text-4xl font-extrabold text-gray-800">{stats.total}</h3>
                            </div>
                            <div className="bg-white p-6 shadow-xl border-t-4 border-yellow-500 !rounded-none transform hover:-translate-y-1 transition-all">
                                <p className="text-yellow-600 text-xs font-bold uppercase tracking-wider mb-1">Menunggu</p>
                                <h3 className="text-4xl font-extrabold text-gray-800">{stats.pending}</h3>
                            </div>
                            <div className="bg-white p-6 shadow-xl border-t-4 border-blue-500 !rounded-none transform hover:-translate-y-1 transition-all">
                                <p className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-1">Diproses</p>
                                <h3 className="text-4xl font-extrabold text-gray-800">{stats.process}</h3>
                            </div>
                            <div className="bg-white p-6 shadow-xl border-t-4 border-green-500 !rounded-none transform hover:-translate-y-1 transition-all">
                                <p className="text-green-600 text-xs font-bold uppercase tracking-wider mb-1">Selesai</p>
                                <h3 className="text-4xl font-extrabold text-gray-800">{stats.done}</h3>
                            </div>
                        </div>
                    )}

                    {/* TABEL DATA */}
                    <div className="bg-white shadow-2xl border-0 !rounded-none">
                        
                        {/* Toolbar */}
                        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-gray-50">
                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <div className="w-1.5 h-10 bg-red-600"></div>
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 leading-tight">Laporan Masuk</h3>
                                    <p className="text-xs text-gray-500">Status Pending & Proses</p>
                                </div>
                            </div>

                            <form onSubmit={handleSearch} className="flex w-full md:w-auto relative">
                                <input
                                    type="text"
                                    className="w-full md:w-72 pl-10 pr-4 py-2 text-sm border-gray-300 focus:border-red-600 focus:ring-red-600 !rounded-none shadow-sm placeholder-gray-400"
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
                                        <th className="px-6 py-4 text-xs font-extrabold text-gray-600 uppercase tracking-wider text-left">Tanggal</th>
                                        <th className="px-6 py-4 text-xs font-extrabold text-gray-600 uppercase tracking-wider text-left">Pelapor</th>
                                        <th className="px-6 py-4 text-xs font-extrabold text-gray-600 uppercase tracking-wider text-left w-1/3">Detail Laporan</th>
                                        <th className="px-6 py-4 text-xs font-extrabold text-gray-600 uppercase tracking-wider text-left">Bukti</th>
                                        <th className="px-6 py-4 text-xs font-extrabold text-gray-600 uppercase tracking-wider text-left">Status</th>
                                        <th className="px-6 py-4 text-xs font-extrabold text-gray-600 uppercase tracking-wider text-right">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {complaints.map((item) => (
                                        <tr key={item.id} className="hover:bg-red-50/20 transition-colors group">
                                            <td className="px-6 py-5 text-sm whitespace-nowrap align-top">
                                                <div className="font-bold text-gray-800">{new Date(item.created_at).toLocaleDateString('id-ID')}</div>
                                                <div className="text-xs text-gray-400 mt-1">{new Date(item.created_at).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}</div>
                                                {item.classification && (
                                                    <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200 !rounded-none">
                                                        {item.classification}
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap align-top">
                                                <div className="text-sm font-bold text-gray-900">{item.user ? item.user.name : (item.guest_name || 'Guest')}</div>
                                                <div className="text-xs text-gray-500 font-mono mt-0.5">{item.user ? item.user.email : (item.guest_email || '-')}</div>
                                            </td>
                                            <td className="px-6 py-5 align-top">
                                                <Link href={route('admin.complaints.show', item.id)} className="block group cursor-pointer">
                                                    <div className="text-base font-bold text-gray-800 group-hover:text-red-600 transition-colors mb-1 line-clamp-1">{item.title}</div>
                                                    <div className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-2">{item.description}</div>
                                                    {item.location && <div className="text-xs text-gray-500 font-medium flex items-center gap-1">📍 {item.location}</div>}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap align-top">
                                                {item.image ? (
                                                    <a href={`/storage/${item.image}`} target="_blank" className="group relative block w-16 h-12 bg-gray-100 border border-gray-200 !rounded-none overflow-hidden hover:opacity-75 shadow-sm">
                                                        <img src={`/storage/${item.image}`} alt="Bukti" className="w-full h-full object-cover" />
                                                    </a>
                                                ) : <span className="text-xs text-gray-400 italic">No File</span>}
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap align-top">
                                                <span className={`inline-flex items-center px-3 py-1 border !rounded-none text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[item.status]}`}>
                                                    {formatStatus(item.status)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-right align-top">
                                                <div className="flex flex-col gap-2 justify-end items-end">
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
                                    <p className="text-gray-500 text-sm mt-1 mb-4">Semua laporan berstatus Pending atau Proses akan muncul di sini.</p>
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