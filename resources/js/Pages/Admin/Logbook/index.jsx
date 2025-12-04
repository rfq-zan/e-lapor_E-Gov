import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

const STATUS_DONE_STYLE = 'bg-green-100 text-green-800 border-green-300';

export default function Index({ auth, logs }) {
    
    const handleUndo = (id) => {
        if(confirm('Kembalikan status laporan ini menjadi PROSES?')) {
            router.patch(route('admin.complaints.update', id), { status: 'process' });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user} header={<h2 className="font-bold text-xl text-gray-800 leading-tight">Arsip Logbook</h2>}>
            <Head title="Arsip Logbook Laporan" />

            {/* BACKGROUND GRADASI MERAH */}
            <div className="py-12 min-h-screen font-sans bg-gradient-to-br from-red-900 via-red-600 to-red-400">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* --- HEADER SECTION --- */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-red-300/30 pb-4">
                        <div>
                            <h2 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                                E-Lapor Logbook
                            </h2>
                            <p className="text-red-100 text-sm mt-1">Arsip laporan yang telah selesai ditangani.</p>
                        </div>
                        
                        {/* NAVIGASI */}
                        <div className="flex mt-4 md:mt-0 bg-white/10 backdrop-blur-sm p-1 border border-white/20 shadow-lg rounded-sm">
                            <Link 
                                href={route('admin.dashboard')} 
                                className="px-6 py-2 text-sm font-bold text-white hover:bg-white/20 !rounded-none transition-all"
                            >
                                ACTIVE JOBS
                            </Link>
                            <Link 
                                href={route('admin.logbook')} 
                                className="px-6 py-2 text-sm font-bold text-red-700 bg-white shadow-sm !rounded-none transition-all cursor-default"
                            >
                                ARSIP LOGBOOK
                            </Link>
                        </div>
                    </div>

                    {/* TABEL DATA LOGBOOK */}
                    <div className="bg-white shadow-2xl border-0 !rounded-none">
                        <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center gap-3">
                            <div className="w-1.5 h-10 bg-green-600"></div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 leading-tight">Riwayat Penyelesaian</h3>
                                <p className="text-xs text-gray-500">Data laporan yang statusnya sudah 'Done'</p>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-white">
                                    <tr className="border-b-2 border-green-600">
                                        <th className="px-6 py-4 text-xs font-extrabold text-green-900 uppercase tracking-wider text-left border-b border-green-100">Waktu Selesai</th>
                                        <th className="px-6 py-4 text-xs font-extrabold text-green-900 uppercase tracking-wider text-left border-b border-green-100">Pelapor</th>
                                        <th className="px-6 py-4 text-xs font-extrabold text-green-900 uppercase tracking-wider text-left w-1/3 border-b border-green-100">Detail Laporan</th>
                                        <th className="px-6 py-4 text-xs font-extrabold text-green-900 uppercase tracking-wider text-left border-b border-green-100">Bukti</th>
                                        <th className="px-6 py-4 text-xs font-extrabold text-green-900 uppercase tracking-wider text-left border-b border-green-100">Status</th>
                                        <th className="px-6 py-4 text-xs font-extrabold text-green-900 uppercase tracking-wider text-right border-b border-green-100">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {logs.map((item) => (
                                        <tr key={item.id} className="hover:bg-green-50/20 transition-colors group">
                                            <td className="px-6 py-5 text-sm whitespace-nowrap align-top">
                                                <div className="font-bold text-gray-800">
                                                    {item.finished_at 
                                                        ? new Date(item.finished_at).toLocaleDateString('id-ID') 
                                                        : (item.updated_at ? new Date(item.updated_at).toLocaleDateString('id-ID') : '-')}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">Dibuat: {new Date(item.created_at).toLocaleDateString('id-ID')}</div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap align-top">
                                                <div className="text-sm font-bold text-gray-900">{item.user ? item.user.name : (item.guest_name || 'Guest')}</div>
                                                <div className="text-xs text-gray-500 font-mono mt-0.5">{item.user ? item.user.email : (item.guest_email || '-')}</div>
                                            </td>
                                            <td className="px-6 py-5 align-top">
                                                <Link href={route('admin.complaints.show', item.id)} className="block group cursor-pointer">
                                                    <div className="text-base font-bold text-gray-800 group-hover:text-green-600 transition-colors mb-1 line-clamp-1">{item.title}</div>
                                                    <div className="text-sm text-gray-600 line-clamp-2 leading-relaxed mb-2">{item.description}</div>
                                                </Link>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap align-top">
                                                {item.image ? (
                                                    <a href={`/storage/${item.image}`} target="_blank" className="group relative block w-16 h-12 bg-gray-100 border border-gray-200 !rounded-none overflow-hidden hover:opacity-90 shadow-sm">
                                                        <img src={`/storage/${item.image}`} alt="Bukti" className="w-full h-full object-cover" />
                                                    </a>
                                                ) : <span className="text-xs text-gray-400 italic">No File</span>}
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap align-top">
                                                <span className={`inline-flex items-center px-3 py-1 border !rounded-none text-xs font-bold uppercase tracking-wider ${STATUS_DONE_STYLE}`}>Selesai</span>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-right align-top">
                                                <div className="flex flex-col gap-2 justify-end items-end">
                                                    {item.can_undo && (
                                                        <button 
                                                            onClick={() => handleUndo(item.id)}
                                                            className="inline-flex items-center px-3 py-1.5 bg-white border border-orange-200 text-orange-600 hover:bg-orange-50 text-xs font-bold !rounded-none transition-all shadow-sm"
                                                        >
                                                            BATALKAN (UNDO)
                                                        </button>
                                                    )}
                                                    <Link href={route('admin.complaints.show', item.id)} className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 !rounded-none shadow-sm">
                                                        DETAIL
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {logs.length === 0 && (
                                <div className="p-16 text-center bg-white">
                                    <h3 className="text-lg font-bold text-gray-900">Arsip Kosong</h3>
                                    <p className="text-gray-500 text-sm mt-1">Belum ada laporan yang diselesaikan.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}