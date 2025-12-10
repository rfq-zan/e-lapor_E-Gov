import React, { useState, useEffect } from "react";
import { Head, useForm, Link, router } from "@inertiajs/react";

export default function Index({ auth, complaints }) {
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [showGuideModal, setShowGuideModal] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editingComplaint, setEditingComplaint] = useState(null);

    // Scroll Navbar Effect
    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                if (window.scrollY > lastScrollY && window.scrollY > 100) {
                    setShowNavbar(false);
                } else {
                    setShowNavbar(true);
                }
                setLastScrollY(window.scrollY);
            }
        };
        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [lastScrollY]);

    // 2. Setup Form State
    const { data, setData, post, processing, reset, errors } = useForm({
        classification: "pengaduan",
        title: "",
        description: "",
        date: "",
        location: "",
        instansi: "",
        category: "",
        privacy: auth.user ? "normal" : "anonim",
        images: [],
    });

    // --- FORM STATE (EDIT) ---
    const editForm = useForm({
        classification: "pengaduan",
        title: "",
        description: "",
        date: "",
        location: "",
        instansi: "",
        category: "",
        privacy: "normal",
        new_images: [],
        images_to_delete: [],
        _method: 'PATCH',
    });

    // Submit Create
    const submit = (e) => {
        e.preventDefault();
        post(route("complaints.store"), {
            onSuccess: () => reset(),
        });
    };

    const handleLogout = () => {
        router.post(route('logout'));
    };

    // --- LOGIKA EDIT ---
    const canEdit = (createdAt) => {
        const created = new Date(createdAt);
        const now = new Date();
        return (now - created) / 1000 / 60 <= 5;
    };

    const handleEditClick = (complaint) => {
        setEditingComplaint(complaint);

        editForm.setData({
            classification: complaint.classification,
            title: complaint.title,
            description: complaint.description,
            date: complaint.date,
            location: complaint.location,
            instansi: complaint.instansi,
            category: complaint.category,
            privacy: complaint.privacy,
            new_images: [],
            images_to_delete: [],
            _method: 'PATCH',
        });

        setShowEditModal(true);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        editForm.post(route("complaints.update", editingComplaint.id), {
            onSuccess: () => {
                setShowEditModal(false);
                setEditingComplaint(null);
                editForm.reset();
            },
        });
    };

    const getGuideContent = () => {
        switch (data.classification) {
            case 'aspirasi': return { text: "Perhatikan Cara Menyampaikan Aspirasi Yang Baik dan Benar", imgUrl: "https://i.pinimg.com/originals/a1/d9/8d/a1d98ddc03faeccba6dfb0f57245a537.jpg", title: "Panduan Pengisian Aspirasi" };
            case 'permintaan': return { text: "Perhatikan Cara Menyampaikan Permintaan Informasi Yang Baik dan Benar", imgUrl: "https://i.pinimg.com/736x/17/46/da/1746da90dec3916df6cfb05a3857badd.jpg", title: "Panduan Pengisian Permintaan Informasi" };
            default: return { text: "Perhatikan Cara Menyampaikan Pengaduan Yang Baik dan Benar", imgUrl: "https://preview.redd.it/just-some-waguri-images-from-my-gallery-v0-79drcbu7prnf1.jpg?width=640&crop=smart&auto=webp&s=3d740705df77ecea3b0ee11f8cdf41bf0627bf24", title: "Panduan Pengisian Pengaduan" };
        }
    };
    const guideContent = getGuideContent();

    const [tick, setTick] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => setTick(t => t + 1), 60000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col min-h-screen font-sans bg-gray-50">
            <Head title="Lapor Keluhan" />

            {/* --- NAVBAR --- */}
            <nav className={`fixed top-0 w-full bg-white border-b border-gray-200 shadow-md z-50 transition-transform duration-300 ease-in-out ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        <div className="flex">
                            <div className="flex items-center gap-3 shrink-0">
                                <div className="p-2 bg-red-600 !rounded-none shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white"><path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" /></svg>
                                </div>
                                <div>
                                    <span className="block text-xl font-extrabold leading-none tracking-tight text-gray-900">E-LAPOR</span>
                                    <span className="block text-[10px] font-bold text-red-600 tracking-widest uppercase">SOEMENEPZ</span>
                                </div>
                            </div>
                        </div>
                        <div className="hidden gap-6 sm:flex sm:items-center sm:ms-6">
                            {auth.user ? (
                                <>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-gray-900 uppercase">{auth.user.name}</div>
                                        <div className="font-mono text-xs text-gray-500">Pelapor</div>
                                    </div>
                                    <div className="w-px h-8 bg-gray-300"></div>
                                    {auth.user.role === 'admin' && (
                                        <Link href={route('admin.dashboard')} className="px-4 py-2 text-xs font-bold text-white uppercase transition-colors bg-gray-800 rounded hover:bg-gray-900">ADMIN PANEL</Link>
                                    )}
                                    <button onClick={handleLogout} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider !rounded-none shadow-sm transition-all">KELUAR</button>
                                </>
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-sm font-bold tracking-wide text-gray-600 uppercase hover:text-red-600">Masuk</Link>
                                    <Link href={route('register')} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider !rounded-none shadow-sm transition-all">Daftar</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-grow w-full pt-20">
                {/* HERO */}
                <div className="pt-16 pb-24 bg-red-700">
                    <div className="px-4 mx-auto mt-5 text-center text-white max-w-7xl sm:px-6 lg:px-8">
                        <h1 className="mb-4 text-3xl font-extrabold tracking-tight md:text-5xl">Layanan Aspirasi & Pengaduan</h1>
                        <p className="max-w-2xl mx-auto text-lg text-red-100">Sampaikan laporan Anda langsung kepada instansi pemerintah berwenang.</p>
                    </div>
                </div>

                <div className="relative z-10 max-w-4xl px-4 pb-20 mx-auto -mt-16 space-y-12 sm:px-6 lg:px-8">

                    {/* --- BAGIAN 1: FORM LAPORAN (CREATE) --- */}
                    <div className="p-8 bg-white shadow-2xl !rounded-none border-t-4 border-red-600">
                        <div className="pb-6 mb-6 border-b border-gray-100">
                            <h2 className="text-2xl font-extrabold text-gray-900">Sampaikan Laporan</h2>
                            <p className="mt-1 text-sm text-gray-500">Silakan isi formulir di bawah ini dengan data yang valid.</p>
                        </div>

                        {/* PILIH KLASIFIKASI */}
                        <div className="flex flex-wrap gap-0 mb-6">
                            {["pengaduan", "aspirasi", "permintaan"].map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    className={`flex-1 px-4 py-3 text-sm font-bold uppercase tracking-wide transition-all border-y border-r first:border-l ${
                                        data.classification === item ? "bg-red-600 text-white border-red-600" : "bg-white text-gray-500 border-gray-300 hover:bg-red-50"
                                    }`}
                                    onClick={() => setData("classification", item)}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>

                        {/* TOMBOL PANDUAN */}
                        <div className="flex items-center justify-center gap-3 p-3 mb-8 border border-gray-200 rounded bg-gray-50">
                            <span className="text-sm font-semibold text-center text-gray-700">{guideContent.text}</span>
                            <button type="button" onClick={() => setShowGuideModal(true)} className="relative flex items-center justify-center flex-shrink-0 w-6 h-6 text-xs font-bold text-red-600 transition-colors bg-white border border-red-600 rounded hover:bg-red-600 hover:text-white" title="Lihat Panduan">
                                ?
                                <span className="absolute w-2 h-2 bg-red-600 rounded-full -top-1 -right-1 animate-ping"></span>
                            </button>
                        </div>

                        {/* INPUT FORM CREATE */}
                        <form onSubmit={submit} encType="multipart/form-data" className="space-y-6">
                            <div>
                                <label className="block mb-1 text-xs font-bold text-gray-700 uppercase">Judul Laporan</label>
                                <input type="text" className="w-full p-3 text-sm border-gray-300 focus:ring-red-600 focus:border-red-600 !rounded-none shadow-sm" placeholder="Ketik Judul Laporan Anda *" value={data.title} onChange={(e) => setData("title", e.target.value)} />
                                {errors.title && <div className="mt-1 text-xs font-bold text-red-600">{errors.title}</div>}
                            </div>

                            <div>
                                <label className="block mb-1 text-xs font-bold text-gray-700 uppercase">Isi Laporan</label>
                                <textarea rows={5} className="w-full p-3 text-sm border-gray-300 focus:ring-red-600 focus:border-red-600 !rounded-none shadow-sm" placeholder="Ceritakan detail kejadian *" value={data.description} onChange={(e) => setData("description", e.target.value)}></textarea>
                                {errors.description && <div className="mt-1 text-xs font-bold text-red-600">{errors.description}</div>}
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block mb-1 text-xs font-bold text-gray-700 uppercase">Tanggal Kejadian</label>
                                    <input type="date" className="w-full p-3 text-sm border-gray-300 focus:ring-red-600 focus:border-red-600 !rounded-none shadow-sm" value={data.date} onChange={(e) => setData("date", e.target.value)} />
                                    {errors.date && <div className="mt-1 text-xs font-bold text-red-600">{errors.date}</div>}
                                </div>
                                <div>
                                    <label className="block mb-1 text-xs font-bold text-gray-700 uppercase">Lokasi Kejadian</label>
                                    <input type="text" className="w-full p-3 text-sm border-gray-300 focus:ring-red-600 focus:border-red-600 !rounded-none shadow-sm" placeholder="Nama Jalan / Gedung" value={data.location} onChange={(e) => setData("location", e.target.value)} />
                                    {errors.location && <div className="mt-1 text-xs font-bold text-red-600">{errors.location}</div>}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block mb-1 text-xs font-bold text-gray-700 uppercase">Instansi Tujuan</label>
                                    <select className="w-full p-3 text-sm text-gray-700 border-gray-300 focus:ring-red-600 focus:border-red-600 !rounded-none shadow-sm" value={data.instansi} onChange={(e) => setData("instansi", e.target.value)}>
                                        <option value="">-- Pilih Instansi --</option>
                                        <option>DLH SOEMENEPZ</option>
                                        <option>Dinas Pendidikan SOEMENEPZ</option>
                                        <option>Dinas Kesehatan SOEMENEPZ</option>
                                        <option>Dinas PU SOEMENEPZ</option>
                                        <option>Dinas Sosial SOEMENEPZ</option>
                                        <option>Dishub SOEMENEPZ</option>
                                        <option>Polres SOEMENEPZ</option>
                                    </select>
                                    {errors.instansi && <div className="mt-1 text-xs font-bold text-red-600">{errors.instansi}</div>}
                                </div>
                                <div>
                                    <label className="block mb-1 text-xs font-bold text-gray-700 uppercase">Kategori Laporan</label>
                                    <select className="w-full p-3 text-sm text-gray-700 border-gray-300 focus:ring-red-600 focus:border-red-600 !rounded-none shadow-sm" value={data.category} onChange={(e) => setData("category", e.target.value)}>
                                        <option value="">-- Pilih Kategori --</option>
                                        <option>Sampah</option>
                                        <option>Infrastruktur</option>
                                        <option>Lingkungan</option>
                                        <option>Pelayanan Publik</option>
                                        <option>Kesehatan</option>
                                        <option>Pendidikan</option>
                                        <option>Keamanan</option>
                                        <option>Lainnya</option>
                                    </select>
                                    {errors.category && <div className="mt-1 text-xs font-bold text-red-600">{errors.category}</div>}
                                </div>
                            </div>

                            <div className="p-6 transition-colors border-2 border-gray-300 border-dashed bg-gray-50 hover:bg-gray-100">
                                <label className="block mb-2 text-sm font-bold text-gray-700">Upload Lampiran (Opsional)</label>
                                <input type="file" multiple className="block w-full text-sm text-gray-500 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white hover:file:bg-red-700" onChange={(e) => setData("images", Array.from(e.target.files))} />
                                <p className="mt-2 text-xs text-gray-500">Format: JPG, PNG. Maksimal 5 foto.</p>
                                {errors.images && <div className="mt-1 text-xs font-bold text-red-600">{errors.images}</div>}
                            </div>

                            {/* --- BAGIAN PRIVASI CREATE (UPDATED) --- */}
                            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                                <label className="block mb-3 text-xs font-bold text-blue-800 uppercase">Opsi Privasi</label>
                                <div className="flex flex-col gap-3 md:flex-row md:gap-6">

                                    {/* Opsi 1: Normal (Hanya muncul jika Login) */}
                                    {auth.user && (
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="privacy" value="normal" checked={data.privacy === 'normal'} onChange={(e) => setData("privacy", e.target.value)} className="w-4 h-4 text-red-600 focus:ring-red-600" />
                                            <span className="text-sm font-medium text-gray-700">Tampilkan Nama (Publik)</span>
                                        </label>
                                    )}

                                    {/* Opsi 2: Anonim */}
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="privacy" value="anonim" checked={data.privacy === 'anonim'} onChange={(e) => setData("privacy", e.target.value)} className="w-4 h-4 text-red-600 focus:ring-red-600" />
                                        <span className="text-sm font-medium text-gray-700">Samarkan Nama (Anonim)</span>
                                    </label>

                                    {/* Opsi 3: Rahasia (Baru) */}
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="privacy" value="rahasia" checked={data.privacy === 'rahasia'} onChange={(e) => setData("privacy", e.target.value)} className="w-4 h-4 text-red-600 focus:ring-red-600" />
                                        <span className="text-sm font-medium text-gray-700">Rahasia (Tidak Tampil Publik)</span>
                                    </label>

                                </div>
                                <p className="mt-2 text-xs italic text-gray-500">
                                    * Laporan <b>Rahasia</b> tidak akan muncul di timeline publik, hanya diketahui oleh Anda dan Petugas.
                                </p>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <button disabled={processing} className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-lg tracking-wide !rounded-none shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                    {processing ? "SEDANG MENGIRIM..." : "KIRIM LAPORAN SEKARANG"}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* --- BAGIAN 2: RIWAYAT LAPORAN --- */}
                    <div className="p-8 bg-white shadow-2xl !rounded-none border-t-4 border-gray-800">
                        <div className="pb-6 mb-8 border-b border-gray-100">
                            <h2 className="text-2xl font-extrabold text-gray-900">Riwayat Laporan Terbaru</h2>
                            <p className="mt-1 text-sm text-gray-500">Pantau status laporan masyarakat secara real-time.</p>
                        </div>

                        {complaints.length === 0 ? (
                            <div className="py-12 text-center">
                                <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                <p className="mt-4 text-gray-500">Belum ada laporan masuk. Jadilah yang pertama melapor!</p>
                            </div>
                        ) : (
                            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
                                {complaints.map((item) => (
                                    <div key={item.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                                        {/* ICON STATUS (DOT) */}
                                        <div className="z-10 flex items-center justify-center w-10 h-10 bg-gray-200 border-4 border-white rounded-full shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                            {item.status === 'done' ? <span className="w-3 h-3 bg-green-500 rounded-full"></span> :
                                             item.status === 'process' ? <span className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></span> :
                                             item.status === 'rejected' ? <span className="w-3 h-3 bg-red-500 rounded-full"></span> :
                                             <span className="w-3 h-3 bg-yellow-400 rounded-full"></span>}
                                        </div>

                                        {/* CARD KONTEN */}
                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 bg-white border border-gray-100 rounded shadow-md hover:shadow-lg transition-all relative">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white !rounded-none ${
                                                        item.classification === 'pengaduan' ? 'bg-red-600' : 'bg-blue-600'
                                                    }`}>
                                                        {item.classification}
                                                    </span>
                                                    <span className="font-mono text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString('id-ID')}</span>
                                                </div>
                                                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${
                                                    item.status === 'done' ? 'bg-green-50 text-green-700 border-green-200' :
                                                    item.status === 'process' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                                                }`}>
                                                    {item.status}
                                                </span>
                                            </div>

                                            <h3 className="mb-2 text-lg font-bold text-gray-800">{item.title}</h3>
                                            <p className="mb-4 text-sm text-gray-600 line-clamp-3">{item.description}</p>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                                    {item.location}
                                                </div>

                                                {/* TOMBOL EDIT (Muncul jika Pending & < 5 Menit) */}
                                                {canEdit(item.created_at) && item.status === 'pending' && (
                                                    <button
                                                        onClick={() => handleEditClick(item)}
                                                        className="ml-auto text-xs font-bold text-blue-600 underline hover:text-blue-800"
                                                    >
                                                        Ubah Laporan (5 Menit)
                                                    </button>
                                                )}

                                                {item.attachments && item.attachments.length > 0 && !canEdit(item.created_at) && (
                                                    <span className="flex items-center gap-1 ml-auto text-xs font-bold text-blue-600">
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                        {item.attachments.length} Lampiran
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                </div>
            </main>

            {/* MODAL PANDUAN */}
            {showGuideModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-2xl overflow-hidden bg-white rounded-lg shadow-2xl">
                        <div className="flex justify-between p-4 border-b bg-gray-50">
                            <h3 className="font-bold text-gray-800">{guideContent.title}</h3>
                            <button onClick={() => setShowGuideModal(false)} className="text-gray-400 hover:text-red-600">✕</button>
                        </div>
                        <div>
                            <img src={guideContent.imgUrl} alt="Panduan" className="w-full h-auto object-contain max-h-[60vh]" />
                        </div>
                        <div className="p-4 text-right bg-gray-50">
                            <button onClick={() => setShowGuideModal(false)} className="px-4 py-2 font-bold text-white bg-red-600 rounded hover:bg-red-700">Tutup</button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL EDIT */}
            {showEditModal && editingComplaint && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
                    <div className="w-full max-w-4xl bg-white shadow-2xl rounded-lg overflow-hidden max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between p-6 border-b bg-gray-50">
                            <h3 className="text-xl font-bold text-gray-800">Ubah Laporan Anda</h3>
                            <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-red-600">✕</button>
                        </div>

                        <div className="p-8">
                            <form onSubmit={submitEdit} className="space-y-6">
                                {/* Form Edit */}
                                <div>
                                    <label className="block mb-1 text-xs font-bold text-gray-700 uppercase">Judul Laporan</label>
                                    <input type="text" className="w-full p-3 text-sm border-gray-300 focus:ring-blue-600 focus:border-blue-600 !rounded-none shadow-sm" value={editForm.data.title} onChange={(e) => editForm.setData("title", e.target.value)} />
                                    {editForm.errors.title && <div className="mt-1 text-xs font-bold text-red-600">{editForm.errors.title}</div>}
                                </div>

                                <div>
                                    <label className="block mb-1 text-xs font-bold text-gray-700 uppercase">Isi Laporan</label>
                                    <textarea rows={5} className="w-full p-3 text-sm border-gray-300 focus:ring-blue-600 focus:border-blue-600 !rounded-none shadow-sm" value={editForm.data.description} onChange={(e) => editForm.setData("description", e.target.value)}></textarea>
                                    {editForm.errors.description && <div className="mt-1 text-xs font-bold text-red-600">{editForm.errors.description}</div>}
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="block mb-1 text-xs font-bold text-gray-700 uppercase">Tanggal Kejadian</label>
                                        <input type="date" className="w-full p-3 text-sm border-gray-300 focus:ring-blue-600 focus:border-blue-600 !rounded-none shadow-sm" value={editForm.data.date} onChange={(e) => editForm.setData("date", e.target.value)} />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-xs font-bold text-gray-700 uppercase">Lokasi Kejadian</label>
                                        <input type="text" className="w-full p-3 text-sm border-gray-300 focus:ring-blue-600 focus:border-blue-600 !rounded-none shadow-sm" value={editForm.data.location} onChange={(e) => editForm.setData("location", e.target.value)} />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    <div>
                                        <label className="block mb-1 text-xs font-bold text-gray-700 uppercase">Instansi Tujuan</label>
                                        <select className="w-full p-3 text-sm text-gray-700 border-gray-300 focus:ring-blue-600 focus:border-blue-600 !rounded-none shadow-sm" value={editForm.data.instansi} onChange={(e) => editForm.setData("instansi", e.target.value)}>
                                            <option value="">-- Pilih Instansi --</option>
                                            <option>DLH SOEMENEPZ</option>
                                            <option>Dinas Pendidikan SOEMENEPZ</option>
                                            <option>Dinas Kesehatan SOEMENEPZ</option>
                                            <option>Dinas PU SOEMENEPZ</option>
                                            <option>Dinas Sosial SOEMENEPZ</option>
                                            <option>Dishub SOEMENEPZ</option>
                                            <option>Polres SOEMENEPZ</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-xs font-bold text-gray-700 uppercase">Kategori Laporan</label>
                                        <select className="w-full p-3 text-sm text-gray-700 border-gray-300 focus:ring-blue-600 focus:border-blue-600 !rounded-none shadow-sm" value={editForm.data.category} onChange={(e) => editForm.setData("category", e.target.value)}>
                                            <option value="">-- Pilih Kategori --</option>
                                            <option>Sampah</option>
                                            <option>Infrastruktur</option>
                                            <option>Lingkungan</option>
                                            <option>Pelayanan Publik</option>
                                            <option>Kesehatan</option>
                                            <option>Pendidikan</option>
                                            <option>Keamanan</option>
                                            <option>Lainnya</option>
                                        </select>
                                    </div>
                                </div>

                                {/* --- AREA GAMBAR LAMA (HAPUS) --- */}
                                {editingComplaint.attachments && editingComplaint.attachments.length > 0 && (
                                    <div className="p-4 border-2 border-red-300 border-dashed bg-red-50">
                                        <label className="block mb-2 text-sm font-bold text-red-800">Hapus Gambar Lama (Opsional)</label>
                                        <div className="flex flex-wrap gap-3">
                                            {editingComplaint.attachments.map((img) => (
                                                <div key={img.id} className="relative w-20 h-20 group">
                                                    <img src={`/storage/${img.file_path}`} alt="Lama" className="object-cover w-full h-full bg-gray-200 rounded shadow-sm" />

                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const isMarked = editForm.data.images_to_delete.includes(img.id);
                                                            editForm.setData(
                                                                'images_to_delete',
                                                                isMarked
                                                                    ? editForm.data.images_to_delete.filter(id => id !== img.id)
                                                                    : [...editForm.data.images_to_delete, img.id]
                                                            );
                                                        }}
                                                        className={`absolute -top-2 -right-2 w-6 h-6 rounded-full text-white text-xs font-bold flex items-center justify-center transition-all ${
                                                            editForm.data.images_to_delete.includes(img.id) ? 'bg-black opacity-100 ring-2 ring-red-500' : 'bg-red-600 opacity-0 group-hover:opacity-100'
                                                        }`}
                                                        title={editForm.data.images_to_delete.includes(img.id) ? 'Batal Hapus' : 'Tandai untuk Dihapus'}
                                                    >
                                                        {editForm.data.images_to_delete.includes(img.id) ? '↩' : 'X'}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <p className="mt-2 text-xs italic font-medium text-red-700">
                                            {editForm.data.images_to_delete.length > 0
                                                ? `(${editForm.data.images_to_delete.length} gambar ditandai untuk DIHAPUS)`
                                                : 'Klik "X" pada gambar jika ingin menghapusnya.'}
                                        </p>
                                    </div>
                                )}

                                {/* --- AREA GAMBAR BARU (UPLOAD) --- */}
                                <div className="p-4 transition-colors border-2 border-gray-300 border-dashed bg-gray-50 hover:bg-gray-100">
                                    <label className="block mb-2 text-sm font-bold text-gray-700">Upload Lampiran Baru (Tambahan)</label>
                                    <input
                                        type="file"
                                        multiple
                                        className="block w-full text-sm text-gray-500 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                                        onChange={(e) => editForm.setData("new_images", Array.from(e.target.files))}
                                    />
                                    {editForm.data.new_images.length > 0 && <p className="mt-2 text-xs font-medium text-gray-500">({editForm.data.new_images.length} file baru siap diunggah.)</p>}
                                </div>

                                {/* PRIVASI DI EDIT FORM */}
                                <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
                                    <label className="block mb-3 text-xs font-bold text-blue-800 uppercase">Opsi Privasi</label>
                                    <div className="flex flex-col gap-3 md:flex-row md:gap-6">
                                        {auth.user && (
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input type="radio" name="edit_privacy" value="normal" checked={editForm.data.privacy === 'normal'} onChange={(e) => editForm.setData("privacy", e.target.value)} className="w-4 h-4 text-blue-600" />
                                                <span className="text-sm">Tampilkan Nama</span>
                                            </label>
                                        )}
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="edit_privacy" value="anonim" checked={editForm.data.privacy === 'anonim'} onChange={(e) => editForm.setData("privacy", e.target.value)} className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm">Anonim</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="radio" name="edit_privacy" value="rahasia" checked={editForm.data.privacy === 'rahasia'} onChange={(e) => editForm.setData("privacy", e.target.value)} className="w-4 h-4 text-blue-600" />
                                            <span className="text-sm">Rahasia</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                                    <button type="button" onClick={() => setShowEditModal(false)} className="px-6 py-3 text-sm font-bold tracking-wide text-gray-800 transition-all bg-gray-200 rounded-sm hover:bg-gray-300">BATAL</button>
                                    <button disabled={editForm.processing} className="px-6 py-3 text-sm font-bold tracking-wide text-white transition-all bg-blue-600 rounded-sm shadow-lg hover:bg-blue-700 disabled:opacity-50">
                                        {editForm.processing ? "MENYIMPAN..." : "SIMPAN PERUBAHAN"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* FOOTER */}
            <footer className="py-6 mt-auto text-sm font-bold text-center text-gray-600 bg-white border-t-4 border-red-600 shadow-inner">
                &copy; 2025 Pemerintah Kabupaten SOEMENEPZ.
            </footer>
        </div>
    );
}
