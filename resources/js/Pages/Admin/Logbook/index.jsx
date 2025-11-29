import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Logbook({ auth, logs }) {

    // Fungsi Undo / Restore (Mengembalikan ke status Proses)
    const handleUndo = (id) => {
        if(confirm('Kembalikan status laporan ini menjadi PROSES?')) {
            router.patch(route('admin.complaints.update', id), { status: 'process' });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Logbook Arsip" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* NAVIGASI */}
                    <div className="flex space-x-4 mb-6">
                        <Link href={route('admin.dashboard')} className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 rounded shadow font-medium">
                            Active Jobs
                        </Link>
                        <Link href={route('admin.logbook')} className="px-4 py-2 bg-indigo-600 text-white rounded font-bold">
                            Logbook (Arsip Selesai)
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-bold mb-4">Logbook Penyelesaian</h3>

                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu Selesai</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((item) => (
                                        <tr key={item.id} className="border-b">
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(item.updated_at).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-800">{item.title}</div>
                                                <div className="text-xs text-green-600">Selesai</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {/* LOGIKA UNDO 5 MENIT */}
                                                {item.can_undo ? (
                                                    <button
                                                        onClick={() => handleUndo(item.id)}
                                                        className="text-orange-600 text-xs font-bold hover:underline flex items-center gap-1"
                                                    >
                                                        ↩ Undo (Restore)
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">Permanen</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {logs.length === 0 && <div className="p-4 text-center text-gray-500">Belum ada laporan selesai.</div>}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Logbook({ auth, logs }) {

    // Fungsi Undo / Restore (Mengembalikan ke status Proses)
    const handleUndo = (id) => {
        if(confirm('Kembalikan status laporan ini menjadi PROSES?')) {
            router.patch(route('admin.complaints.update', id), { status: 'process' });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Logbook Arsip" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* NAVIGASI */}
                    <div className="flex space-x-4 mb-6">
                        <Link href={route('admin.dashboard')} className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 rounded shadow font-medium">
                            Active Jobs
                        </Link>
                        <Link href={route('admin.logbook')} className="px-4 py-2 bg-indigo-600 text-white rounded font-bold">
                            Logbook (Arsip Selesai)
                        </Link>
                    </div>

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-lg font-bold mb-4">Logbook Penyelesaian</h3>

                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu Selesai</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Judul</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {logs.map((item) => (
                                        <tr key={item.id} className="border-b">
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {new Date(item.updated_at).toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-800">{item.title}</div>
                                                <div className="text-xs text-green-600">Selesai</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {/* LOGIKA UNDO 5 MENIT */}
                                                {item.can_undo ? (
                                                    <button
                                                        onClick={() => handleUndo(item.id)}
                                                        className="text-orange-600 text-xs font-bold hover:underline flex items-center gap-1"
                                                    >
                                                        ↩ Undo (Restore)
                                                    </button>
                                                ) : (
                                                    <span className="text-gray-400 text-xs">Permanen</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {logs.length === 0 && <div className="p-4 text-center text-gray-500">Belum ada laporan selesai.</div>}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
