import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";

export default function Index({ auth, complaints }) {
    const { data, setData, post, processing, reset, errors } = useForm({
        classification: "pengaduan",
        title: "",
        description: "",
        date: "",
        location: "",
        instansi: "",
        category: "",
        privacy: "normal",
        image: null,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("complaints.store"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Lapor Keluhan" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto space-y-6 sm:px-6 lg:px-8">

                    {/* FORM */}
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="mb-4 text-xl font-bold">Sampaikan Laporan Anda</h2>

                        {/* PILIH KLASIFIKASI */}
                        <div className="flex gap-4 mb-4">
                            {["pengaduan", "aspirasi", "permintaan"].map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    className={`px-4 py-2 rounded border font-medium ${
                                        data.classification === item
                                            ? "bg-red-600 text-white"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                                    onClick={() => setData("classification", item)}
                                >
                                    {item.toUpperCase()}
                                </button>
                            ))}
                        </div>

                        <form
                            onSubmit={submit}
                            encType="multipart/form-data"
                            className="space-y-4"
                        >
                            {/* Judul */}
                            <div>
                                <label className="font-medium">Ketik Judul Laporan Anda *</label>
                                <input
                                    type="text"
                                    className="w-full mt-1 border-gray-300 rounded-md"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                />
                            </div>

                            {/* Isi */}
                            <div>
                                <label className="font-medium">Ketik Isi Laporan Anda *</label>
                                <textarea
                                    rows={4}
                                    className="w-full mt-1 border-gray-300 rounded-md"
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                ></textarea>
                            </div>

                            {/* Tanggal */}
                            <div>
                                <label className="font-medium">Pilih Tanggal Kejadian *</label>
                                <input
                                    type="date"
                                    className="w-full mt-1 border-gray-300 rounded-md"
                                    value={data.date}
                                    onChange={(e) => setData("date", e.target.value)}
                                />
                            </div>

                            {/* Lokasi */}
                            <div>
                                <label className="font-medium">Ketik Lokasi Kejadian *</label>
                                <input
                                    type="text"
                                    className="w-full mt-1 border-gray-300 rounded-md"
                                    value={data.location}
                                    onChange={(e) => setData("location", e.target.value)}
                                />
                            </div>

                            {/* Instansi */}
                            <div>
                                <label className="font-medium">Ketik Instansi Tujuan</label>
                                <select
                                    className="w-full mt-1 border-gray-300 rounded-md"
                                    value={data.instansi}
                                    onChange={(e) => setData("instansi", e.target.value)}
                                >
                                    <option value="">Pilih Instansi</option>
                                    <option>DLH Bangkalan</option>
                                    <option>Kecamatan Kamal</option>
                                    <option>Polsek</option>
                                    <option>Dinas Pendidikan</option>
                                </select>
                            </div>

                            {/* Kategori */}
                            <div>
                                <label className="font-medium">
                                    Pilih Kategori Laporan Anda
                                </label>
                                <select
                                    className="w-full mt-1 border-gray-300 rounded-md"
                                    value={data.category}
                                    onChange={(e) => setData("category", e.target.value)}
                                >
                                    <option value="">Pilih Kategori</option>
                                    <option>Sampah</option>
                                    <option>Infrastruktur</option>
                                    <option>Lingkungan</option>
                                    <option>Pelayanan Publik</option>
                                </select>
                            </div>

                            {/* Upload */}
                            <div>
                                <label className="font-medium">Upload Lampiran</label>
                                <input
                                    type="file"
                                    className="w-full mt-1 text-sm text-gray-600"
                                    onChange={(e) => setData("image", e.target.files[0])}
                                />
                            </div>

                            {/* PRIVACY */}
                            <div className="flex gap-6 mt-3">
                                {[
                                    { label: "Normal", value: "normal" },
                                    { label: "Anomin", value: "anonim" },
                                ].map((item) => (
                                    <label
                                        key={item.value}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            type="radio"
                                            name="privacy"
                                            value={item.value}
                                            checked={data.privacy === item.value}
                                            onChange={(e) =>
                                                setData("privacy", e.target.value)
                                            }
                                        />
                                        {item.label}
                                    </label>
                                ))}
                            </div>

                            {/* SUBMIT */}
                            <div className="flex justify-end pt-2">
                                <button
                                    disabled={processing}
                                    className="inline-flex items-center px-6 py-2 text-sm font-semibold text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-60"
                                >
                                    {processing ? "Mengirim..." : "KIRIM"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* LIST LAPORAN */}
                    <div className="p-6 bg-white rounded-lg shadow">
                        <h2 className="mb-3 text-lg font-bold">Riwayat Laporan</h2>

                        <div className="grid gap-4 md:grid-cols-2">
                            {complaints.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex gap-4 p-4 border rounded-md"
                                >
                                    <img
                                        src={`/storage/${item.image}`}
                                        className="object-cover w-24 h-24 rounded"
                                    />
                                    <div>
                                        <h3 className="font-bold">{item.title}</h3>
                                        <p className="text-sm text-gray-600">
                                            {item.description}
                                        </p>
                                        <span
                                            className={`px-2 py-1 text-xs rounded mt-2 inline-block ${
                                                item.status === "pending"
                                                    ? "bg-yellow-200 text-yellow-800"
                                                    : item.status === "done"
                                                    ? "bg-green-200 text-green-800"
                                                    : "bg-gray-200"
                                            }`}
                                        >
                                            {item.status.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {complaints.length === 0 && (
                                <p className="text-gray-500">Belum ada laporan.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
