import React, { useState, useEffect } from "react";
import { Head, useForm, Link, router } from "@inertiajs/react";
import ResponsiveNavLink from '@/Components/ResponsiveNavLink'; 

export default function Index({ auth }) {
    // 1. State untuk Navbar Mobile (Hamburger)
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // State untuk Animasi Navbar Scroll
    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    // State untuk Modal Panduan (Popup)
    const [showGuideModal, setShowGuideModal] = useState(false);

    // Logika Scroll Navbar
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

        return () => {
            window.removeEventListener('scroll', controlNavbar);
        };
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
        privacy: "normal",
        images: [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("complaints.store"), {
            onSuccess: () => reset(),
        });
    };

    const handleLogout = () => {
        router.post(route('logout'));
    };

    // --- LOGIKA KONTEN PANDUAN DINAMIS ---
    // Anda bisa mengganti URL gambar ('imgUrl') dengan path gambar aset lokal Anda nantinya
    const getGuideContent = () => {
        switch (data.classification) {
            case 'aspirasi':
                return {
                    text: "Perhatikan Cara Menyampaikan Aspirasi Yang Baik dan Benar",
                    imgUrl: "https://i.pinimg.com/originals/a1/d9/8d/a1d98ddc03faeccba6dfb0f57245a537.jpg", 
                    title: "Panduan Pengisian Aspirasi"
                };
            case 'permintaan':
                return {
                    text: "Perhatikan Cara Menyampaikan Permintaan Informasi Yang Baik dan Benar",
                    imgUrl: "https://i.pinimg.com/736x/17/46/da/1746da90dec3916df6cfb05a3857badd.jpg", 
                    title: "Panduan Pengisian Permintaan Informasi"
                };
            default: // pengaduan
                return {
                    text: "Perhatikan Cara Menyampaikan Pengaduan Yang Baik dan Benar",
                    imgUrl: "https://preview.redd.it/just-some-waguri-images-from-my-gallery-v0-79drcbu7prnf1.jpg?width=640&crop=smart&auto=webp&s=3d740705df77ecea3b0ee11f8cdf41bf0627bf24", 
                    title: "Panduan Pengisian Pengaduan"
                };
        }
    };

    const guideContent = getGuideContent();

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Head title="Lapor Keluhan" />

            {/* =========================== */}
            {/* 1. HEADER / NAVBAR DINAMIS  */}
            {/* =========================== */}
            <nav className={`fixed top-0 w-full bg-white border-b border-gray-200 shadow-md z-50 transition-transform duration-300 ease-in-out ${showNavbar ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        
                        {/* KIRI: LOGO */}
                        <div className="flex">
                            <div className="shrink-0 flex items-center gap-3">
                                {/* Ikon Merah */}
                                <div className="p-2 bg-red-600 !rounded-none shadow-sm">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                                        <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div>
                                    <span className="block text-xl font-extrabold text-gray-900 tracking-tight leading-none">E-LAPOR</span>
                                    <span className="block text-[10px] font-bold text-red-600 tracking-widest uppercase">SOEMENEPZ</span>
                                </div>
                            </div>
                        </div>

                        {/* KANAN: MENU DESKTOP */}
                        <div className="hidden sm:flex sm:items-center sm:ms-6 gap-6">
                            {auth.user ? (
                                <>
                                    <div className="text-right">
                                        <div className="text-sm font-bold text-gray-900 uppercase">{auth.user.name}</div>
                                        <div className="text-xs text-gray-500 font-mono">Pelapor</div>
                                    </div>
                                    <div className="h-8 w-px bg-gray-300"></div>
                                    
                                    {auth.user.role === 'admin' && (
                                        <Link href={route('admin.dashboard')} className="text-sm font-bold text-red-600 hover:underline">
                                            Ke Admin Panel
                                        </Link>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider !rounded-none shadow-sm transition-all flex items-center gap-2"
                                    >
                                            KELUAR
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href={route('login')} className="text-sm font-bold text-gray-600 hover:text-red-600 uppercase tracking-wide">
                                        Masuk
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider !rounded-none shadow-sm transition-all"
                                    >
                                        Daftar
                                    </Link>
                                </>
                            )}
                        </div>

                        {/* TOMBOL HAMBURGER (MOBILE) */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none"
                            >
                                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                    <path
                                        className={!showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={showingNavigationDropdown ? 'inline-flex' : 'hidden'}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* MOBILE MENU */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden border-t border-gray-100 bg-white'}>
                    <div className="pt-4 pb-1 border-t border-gray-200 bg-gray-50">
                        {auth.user ? (
                            <div className="px-4 space-y-3 pb-3">
                                <div className="font-medium text-base text-gray-800">{auth.user.name}</div>
                                <div className="font-medium text-sm text-gray-500">{auth.user.email}</div>
                                <button onClick={handleLogout} className="text-red-600 font-bold text-sm w-full text-left">Keluar</button>
                            </div>
                        ) : (
                            <div className="px-4 space-y-3 pb-3">
                                <Link href={route('login')} className="block font-medium text-gray-600">Masuk</Link>
                                <Link href={route('register')} className="block font-bold text-red-600">Daftar Akun</Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* =========================== */}
            {/* 2. KONTEN HALAMAN           */}
            {/* =========================== */}
            <main className="flex-grow pt-20 w-full">
                
                {/* HERO SECTION */}
                <div className="bg-red-700 pt-16 pb-24">
                    <div className="px-4 mx-auto text-center text-white max-w-7xl sm:px-6 lg:px-8 mt-5">
                        <h1 className="mb-4 text-3xl font-extrabold md:text-5xl tracking-tight">
                            Layanan Aspirasi & Pengaduan
                        </h1>
                        <p className="max-w-2xl mx-auto text-lg text-red-100">
                            Sampaikan laporan Anda langsung kepada instansi pemerintah berwenang dengan mudah, cepat, dan transparan.
                        </p>
                    </div>
                </div>

                {/* FORM SECTION */}
                <div className="max-w-4xl px-4 mx-auto -mt-16 sm:px-6 lg:px-8 relative z-10 mb-16">
                    <div className="p-8 bg-white shadow-2xl !rounded-none border-t-4 border-red-600">
                        
                        <div className="pb-6 mb-6 border-b border-gray-100">
                            <h2 className="text-2xl font-extrabold text-gray-900">Sampaikan Laporan</h2>
                            <p className="text-gray-500 text-sm mt-1">Silakan isi formulir di bawah ini dengan data yang valid.</p>
                        </div>

                        {/* PILIH KLASIFIKASI */}
                        <div className="flex flex-wrap gap-0 mb-6">
                            {["pengaduan", "aspirasi", "permintaan"].map((item) => (
                                <button
                                    key={item}
                                    type="button"
                                    className={`flex-1 px-4 py-3 text-sm font-bold uppercase tracking-wide transition-all border-y border-r first:border-l ${
                                        data.classification === item
                                            ? "bg-red-600 text-white border-red-600"
                                            : "bg-white text-gray-500 border-gray-300 hover:bg-red-50"
                                    }`}
                                    onClick={() => setData("classification", item)}
                                >
                                    {item}
                                </button>
                            ))}
                        </div>

                        {/* >>>>> BAGIAN BARU: TEXT PANDUAN & TOMBOL TANYA <<<<< */}
                        <div className="flex items-center justify-center gap-3 mb-8 bg-gray-50 p-3 rounded border border-gray-200">
                            <span className="text-sm font-semibold text-gray-700 text-center">
                                {guideContent.text}
                            </span>
                            <button
                                type="button"
                                onClick={() => setShowGuideModal(true)}
                                className="flex-shrink-0 w-6 h-6 flex items-center justify-center border border-red-600 text-red-600 text-xs font-bold rounded bg-white hover:bg-red-600 hover:text-white transition-colors relative"
                                title="Lihat Panduan"
                            >
                                ?
                                {/* Optional: Indikator notifikasi kecil seperti di gambar user */}
                                <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
                            </button>
                        </div>
                        {/* >>>>> AKHIR BAGIAN BARU <<<<< */}

                        <form onSubmit={submit} encType="multipart/form-data" className="space-y-6">

                            {/* Judul */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Judul Laporan</label>
                                <input
                                    type="text"
                                    className="w-full p-3 text-sm border-gray-300 focus:ring-red-600 focus:border-red-600 !rounded-none shadow-sm"
                                    placeholder="Ketik Judul Laporan Anda *"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                />
                                {errors.title && <div className="mt-1 text-xs text-red-600 font-bold">{errors.title}</div>}
                            </div>

                            {/* Isi Laporan */}
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Isi Laporan</label>
                                <textarea
                                    rows={5}
                                    className="w-full p-3 text-sm border-gray-300 focus:ring-red-600 focus:border-red-600 !rounded-none shadow-sm"
                                    placeholder="Ceritakan detail kejadian atau aspirasi Anda *"
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                ></textarea>
                                {errors.description && <div className="mt-1 text-xs text-red-600 font-bold">{errors.description}</div>}
                            </div>

                            {/* Grid Tanggal & Lokasi */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Tanggal Kejadian</label>
                                    <input
                                        type="date"
                                        className="w-full p-3 text-sm border-gray-300 focus:ring-red-600 focus:border-red-600 !rounded-none shadow-sm"
                                        value={data.date}
                                        onChange={(e) => setData("date", e.target.value)}
                                    />
                                    {errors.date && <div className="mt-1 text-xs text-red-600 font-bold">{errors.date}</div>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Lokasi Kejadian</label>
                                    <input
                                        type="text"
                                        className="w-full p-3 text-sm border-gray-300 focus:ring-red-600 focus:border-red-600 !rounded-none shadow-sm"
                                        placeholder="Nama Jalan / Gedung / Daerah"
                                        value={data.location}
                                        onChange={(e) => setData("location", e.target.value)}
                                    />
                                    {errors.location && <div className="mt-1 text-xs text-red-600 font-bold">{errors.location}</div>}
                                </div>
                            </div>

                            {/* Grid Instansi & Kategori */}
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Instansi Tujuan</label>
                                    <select
                                        className="w-full p-3 text-sm text-gray-700 border-gray-300 focus:ring-red-600 focus:border-red-600 !rounded-none shadow-sm"
                                        value={data.instansi}
                                        onChange={(e) => setData("instansi", e.target.value)}
                                    >
                                        <option value="">-- Pilih Instansi --</option>
                                        <option>DLH SOEMENEPZ</option>
                                        <option>Dinas Pendidikan SOEMENEPZ</option>
                                        <option>Dinas Kesehatan SOEMENEPZ</option>
                                        <option>Dinas PU SOEMENEPZ</option>
                                        <option>Dinas Sosial SOEMENEPZ</option>
                                        <option>Dishub SOEMENEPZ</option>
                                        <option>Polres SOEMENEPZ</option>
                                    </select>
                                    {errors.instansi && <div className="mt-1 text-xs text-red-600 font-bold">{errors.instansi}</div>}
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Kategori Laporan</label>
                                    <select
                                        className="w-full p-3 text-sm text-gray-700 border-gray-300 focus:ring-red-600 focus:border-red-600 !rounded-none shadow-sm"
                                        value={data.category}
                                        onChange={(e) => setData("category", e.target.value)}
                                    >
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
                                    {errors.category && <div className="mt-1 text-xs text-red-600 font-bold">{errors.category}</div>}
                                </div>
                            </div>

                            {/* Upload File */}
                            <div className="p-6 border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors">
                                <label className="block mb-2 text-sm font-bold text-gray-700">Upload Lampiran (Opsional)</label>
                                <input
                                    type="file"
                                    multiple
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-xs file:font-bold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
                                    onChange={(e) => setData("images", Array.from(e.target.files))}
                                />
                                <p className="mt-2 text-xs text-gray-500">Format: JPG, PNG. Maksimal 5 foto (Total 5MB).</p>
                                {errors.images && <div className="mt-1 text-xs text-red-600 font-bold">{errors.images}</div>}
                            </div>

                            {/* Opsi Privasi */}
                            <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
                                <label className="block mb-3 text-xs font-bold text-blue-800 uppercase">Opsi Privasi Laporan</label>
                                <div className="flex flex-wrap gap-6">
                                    {[
                                        { label: "Tampilkan Nama (Publik)", value: "normal" },
                                        { label: "Samarkan Nama (Anonim)", value: "anonim" },
                                    ].map((item) => (
                                        <label key={item.value} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="privacy"
                                                value={item.value}
                                                checked={data.privacy === item.value}
                                                onChange={(e) => setData("privacy", e.target.value)}
                                                className="text-red-600 focus:ring-red-600 w-4 h-4"
                                            />
                                            <span className="text-sm text-gray-700 font-medium">{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Tombol Submit */}
                            <div className="pt-4 border-t border-gray-100">
                                <button
                                    disabled={processing}
                                    className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-lg tracking-wide !rounded-none shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? "SEDANG MENGIRIM..." : "KIRIM LAPORAN SEKARANG"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </main>

            {/* =========================== */}
            {/* 3. FOOTER MANUAL            */}
            {/* =========================== */}
            <footer className="bg-white border-t-4 border-red-600 shadow-inner mt-auto">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-2">
                    <div className="text-center md:text-left">
                        <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                            <span>&copy; 2025 Pemerintah Kabupaten SOEMENEPZ.</span>
                        </div>
                    </div>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-red-600 text-[10px] font-bold uppercase tracking-wider transition-colors">Bantuan</a>
                        <a href="#" className="text-gray-400 hover:text-red-600 text-[10px] font-bold uppercase tracking-wider transition-colors">Privasi</a>
                    </div>
                </div>
            </footer>

            {/* =========================== */}
            {/* 4. MODAL POPUP PANDUAN      */}
            {/* =========================== */}
            {showGuideModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4 transition-opacity">
                    <div className="bg-white w-full max-w-2xl rounded-lg shadow-2xl overflow-hidden animate-fade-in-up">
                        {/* Header Modal */}
                        <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-gray-50">
                            <h3 className="text-lg font-bold text-gray-800">{guideContent.title}</h3>
                            <button 
                                onClick={() => setShowGuideModal(false)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* Body Modal (Gambar) */}
                        <div className="p-0">
                            <img 
                                src={guideContent.imgUrl} 
                                alt={guideContent.title} 
                                className="w-full h-auto object-contain max-h-[60vh]"
                            />
                        </div>

                        {/* Footer Modal */}
                        <div className="p-4 bg-gray-50 border-t border-gray-100 text-right">
                             <button 
                                onClick={() => setShowGuideModal(false)}
                                className="px-4 py-2 bg-red-600 text-white text-sm font-bold rounded hover:bg-red-700 transition-colors"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}