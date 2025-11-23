import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ auth, complaints }) {
    // Inisiasi Inetria.js useform
    const { data, setData, post, processing, reset, errors } = useForm({
        title: '',
        description: '',
        location: '',
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('complaints.store'), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Lapor Keluhan" />

            <div className="py-12">
                <div className="mx-auto space-y-6 max-w-7xl sm:px-6 lg:px-8">

                    {/* FORM INPUT */}
                    <div className="p-4 bg-white shadow sm:p-8 sm:rounded-lg">
                        <h2 className="mb-4 text-lg font-medium text-gray-900">Buat Laporan Baru</h2>

                        <form onSubmit={submit} encType="multipart/form-data" className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Judul Laporan</label>
                                <input
                                    type="text"
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                />
                                <span className="text-sm text-red-500">{errors.title}</span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Lokasi</label>
                                <input
                                    type="text"
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Deskripsi Masalah</label>
                                <textarea
                                    className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows="3"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                ></textarea>
                                <span className="text-sm text-red-500">{errors.description}</span>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Bukti Foto</label>
                                <input
                                    type="file"
                                    className="block w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    onChange={(e) => setData('image', e.target.files[0])}
                                />
                                <span className="text-sm text-red-500">{errors.image}</span>
                            </div>

                            <button
                                disabled={processing}
                                className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none"
                            >
                                {processing ? 'Mengirim...' : 'Kirim Laporan'}
                            </button>
                        </form>
                    </div>

                    {/* LIST LAPORAN */}
                    <div className="p-4 bg-white shadow sm:p-8 sm:rounded-lg">
                        <h2 className="mb-4 text-lg font-medium text-gray-900">Riwayat Laporan Saya</h2>
                        <div className="grid gap-4 md:grid-cols-2">
                            {complaints.map((item) => (
                                <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                                    {/* Display img */}
                                    <img
                                        src={`/storage/${item.image}`}
                                        alt="Bukti"
                                        className="object-cover w-24 h-24 rounded"
                                    />
                                    <div>
                                        <h3 className="font-bold text-gray-800">{item.title}</h3>
                                        <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                                        <div className="mt-2">
                                            <span className={`px-2 py-1 text-xs rounded-full ${
                                                item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                item.status === 'done' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                                            }`}>
                                                {item.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {complaints.length === 0 && <p className="text-gray-500">Belum ada laporan.</p>}
                        </div>
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
