import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ auth, complaint }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title={`Detail Laporan #${complaint.id}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    {/* TOMBOL KEMBALI */}
                    <Link
                        href={route('admin.dashboard')}
                        className="inline-flex items-center mb-4 text-sm text-gray-600 hover:text-gray-900"
                    >
                        &larr; Kembali ke Dashboard
                    </Link>

                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3">

                            {/* KOLOM KIRI: FOTO BUKTI */}
                            <div className="p-6 bg-gray-50 md:col-span-1">
                                <h3 className="mb-4 text-lg font-bold text-gray-900">Bukti Lampiran</h3>
                                <div className="overflow-hidden border rounded-lg shadow-sm">
                                    <img
                                        src={`/storage/${complaint.image}`}
                                        alt="Bukti Laporan"
                                        className="object-cover w-full h-auto"
                                    />
                                </div>
                                <div className="mt-4 text-xs text-center text-gray-500">
                                    Klik kanan gambar untuk melihat ukuran penuh.
                                </div>
                            </div>

                            {/* KOLOM KANAN: DETAIL DATA */}
                            <div className="p-6 md:col-span-2">
                                <div className="flex items-start justify-between mb-6">
                                    <div>
                                        <span className={`px-2 py-1 text-xs font-bold rounded uppercase tracking-wide ${
                                            complaint.classification === 'pengaduan' ? 'bg-red-100 text-red-800' :
                                            complaint.classification === 'aspirasi' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'
                                        }`}>
                                            {complaint.classification}
                                        </span>
                                        <h2 className="mt-2 text-2xl font-bold text-gray-900">{complaint.title}</h2>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-sm font-bold border ${
                                        complaint.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                        complaint.status === 'process' ? 'bg-blue-100 text-blue-800 border-blue-200' :
                                        'bg-green-100 text-green-800 border-green-200'
                                    }`}>
                                        {complaint.status.toUpperCase()}
                                    </div>
                                </div>

                                {/* INFORMASI PELAPOR */}
                                <div className="p-4 mb-6 border border-indigo-100 rounded-lg bg-indigo-50">
                                    <h4 className="mb-2 text-sm font-bold text-indigo-900 uppercase">Identitas Pelapor</h4>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="block text-gray-500">Nama:</span>
                                            {complaint.privacy === 'anonim' ? (
                                                <span className="italic font-bold text-red-600">Disamarkan (Anonim)</span>
                                            ) : (
                                                <span className="font-bold text-gray-900">{complaint.user.name}</span>
                                            )}
                                        </div>
                                        <div>
                                            <span className="block text-gray-500">Privasi:</span>
                                            <span className="font-medium text-gray-900 capitalize">{complaint.privacy}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* DETAIL KEJADIAN */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase">Deskripsi Lengkap</label>
                                        <p className="mt-1 text-gray-900 whitespace-pre-wrap">{complaint.description}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase">Instansi Tujuan</label>
                                            <p className="font-medium text-gray-900">{complaint.instansi}</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase">Kategori</label>
                                            <p className="font-medium text-gray-900">{complaint.category}</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase">Lokasi</label>
                                            <p className="font-medium text-gray-900">{complaint.location}</p>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase">Tanggal Kejadian</label>
                                            <p className="font-medium text-gray-900">
                                                {new Date(complaint.date).toLocaleDateString('id-ID', {
                                                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
