import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';

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

export default function Index({ auth, complaints, flash, stats }) {

    const updateStatus = (id, newStatus) => {
        if (confirm(`Apakah Anda yakin ingin mengubah status menjadi ${newStatus.toUpperCase()}?`)) {
            router.patch(route('admin.complaints.update', id), {
                status: newStatus
            });
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Dashboard Admin Dinas" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* NOTIFIKASI SUKSES*/}
                    {flash?.message && (
                        <div className="relative px-4 py-3 mb-6 text-green-700 bg-green-100 border border-green-400 rounded">
                            <strong className="font-bold">Berhasil! </strong>
                            <span className="block sm:inline">{flash.message}</span>
                        </div>
                    )}

                    {/* WIDGET STATISTIK*/}
                    {stats && (
                        <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-4">
                            <div className="p-6 bg-white border-l-4 border-gray-500 rounded-lg shadow">
                                <div className="font-bold text-gray-500">Total Laporan</div>
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
                            <h3 className="mb-4 text-lg font-bold">Daftar Laporan Masuk</h3>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Tanggal</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Pelapor</th>
                                            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Masalah</th>
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
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                    {item.user.name}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-500">
                                                    <Link
                                                        href={route('admin.complaints.show', item.id)}
                                                        className="text-sm font-bold text-indigo-600 hover:text-indigo-900 hover:underline"
                                                    >
                                                        {item.title}
                                                    </Link>
                                                    <div className="w-48 text-xs text-gray-500 truncate">{item.description}</div>
                                                    <div className="flex items-center mt-1 text-xs text-blue-500">
                                                        📍 {item.location || '-'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <a
                                                        href={`/storage/${item.image}`}
                                                        target="_blank"
                                                        className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                                    >
                                                        📷 Lihat Foto
                                                    </a>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        STATUS_COLORS[item.status] || 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {formatStatus(item.status)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 space-x-2 text-sm font-medium whitespace-nowrap">
                                                    {item.status === 'pending' && (
                                                        <button
                                                            onClick={() => updateStatus(item.id, 'process')}
                                                            className="font-bold text-blue-600 hover:text-blue-900"
                                                        >
                                                            Proses
                                                        </button>
                                                    )}
                                                    {item.status === 'process' && (
                                                        <button
                                                            onClick={() => updateStatus(item.id, 'done')}
                                                            className="font-bold text-green-600 hover:text-green-900"
                                                        >
                                                            Selesai
                                                        </button>
                                                    )}
                                                    {item.status === 'done' && (
                                                        <span className="italic text-gray-400">Tuntas</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {complaints.length === 0 && (
                                    <div className="p-4 text-center text-gray-500">Tidak ada data laporan.</div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
