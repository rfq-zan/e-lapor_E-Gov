import { useState, useEffect } from 'react';

// MOCK COMPONENT: Link (Pengganti @inertiajs/react Link untuk preview)
const Link = ({ href, children, as = 'a', ...props }) => {
    const Component = as;
    return <Component href={href} {...props}>{children}</Component>;
};

// MOCK FUNCTION: route (Pengganti Ziggy/Laravel route)
const route = (name) => '#';

export default function Authenticated({ user = { name: "Admin User", email: "admin@example.com" }, children }) {
    // State untuk menyimpan status visibilitas navbar
    const [showNavbar, setShowNavbar] = useState(true);
    // State untuk menyimpan posisi scroll terakhir
    const [lastScrollY, setLastScrollY] = useState(0);

    // Effect untuk mengatur logika scroll
    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                const currentScrollY = window.scrollY;

                // Jika scroll ke bawah DAN sudah melewati 80px (biar gak sensitif banget di paling atas)
                if (currentScrollY > lastScrollY && currentScrollY > 80) {
                    setShowNavbar(false);
                } else {
                    // Jika scroll ke atas
                    setShowNavbar(true);
                }

                // Update posisi scroll terakhir
                setLastScrollY(currentScrollY);
            }
        };

        window.addEventListener('scroll', controlNavbar);

        // Cleanup listener saat component di-unmount
        return () => {
            window.removeEventListener('scroll', controlNavbar);
        };
    }, [lastScrollY]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            
            {/* =========================== */}
            {/* 1. NAVBAR (ANIMATED)        */}
            {/* =========================== */}
            {/* - 'fixed top-0': Tetap menempel di viewport agar animasi transform bekerja terhadap viewport.
                - 'transition-transform duration-300': Membuat animasi halus.
                - Logika class: Jika showNavbar true -> translate-y-0 (posisi normal).
                                Jika showNavbar false -> -translate-y-full (geser ke atas sampai hilang).
            */}
            <nav 
                className={`fixed top-0 w-full bg-white border-b border-gray-200 shadow-md z-50 transition-transform duration-300 ease-in-out ${
                    showNavbar ? 'translate-y-0' : '-translate-y-full'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        
                        {/* KIRI: LOGO & LABEL ADMIN */}
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href={route('admin.dashboard')}>
                                    <div className="flex items-center gap-3">
                                        {/* Ikon Laporan (Merah Kotak) */}
                                        <div className="p-2 bg-red-600 !rounded-none shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                                                <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
                                                <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                                            </svg>
                                        </div>
                                        {/* Teks Logo */}
                                        <div>
                                            <span className="block text-xl font-extrabold text-gray-900 tracking-tight leading-none">E-LAPOR</span>
                                            <span className="block text-[10px] font-bold text-red-600 tracking-widest uppercase">Admin Panel</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* KANAN: USER INFO & TOMBOL LOGOUT LANGSUNG */}
                        <div className="flex items-center gap-6">
                            
                            {/* Informasi User (Hidden di HP biar rapi) */}
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-bold text-gray-900 uppercase">{user.name}</div>
                                <div className="text-xs text-gray-500 font-mono">{user.email}</div>
                            </div>

                            {/* Garis Pemisah Kecil */}
                            <div className="h-8 w-px bg-gray-300 hidden sm:block"></div>

                            {/* TOMBOL LOGOUT (MERAH & KOTAK) */}
                            <Link
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider !rounded-none shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="hidden sm:inline">KELUAR</span>
                                <span className="sm:hidden">LOGOUT</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- 3. KONTEN UTAMA --- */}
            {/* pt-24: Tetap dibutuhkan karena Navbar posisinya 'fixed', jadi konten harus didorong ke bawah agar tidak tertutup navbar saat awal load */}
            {/* pb-8: Padding bawah biasa, tidak perlu besar karena footer tidak lagi fixed */}
            <main className="flex-grow pt-24 pb-8">
                {children || (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg p-6 text-gray-900">
                             <h3 className="text-lg font-bold mb-4">Konten Demo</h3>
                             <p className="mb-4">Scroll ke bawah untuk melihat efek navbar menghilang. Scroll ke atas untuk memunculkannya kembali.</p>
                             {[...Array(20)].map((_, i) => (
                                <p key={i} className="mb-4 text-gray-600">
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </p>
                             ))}
                        </div>
                    </div>
                )}
            </main>

            {/* =========================== */}
            {/* 4. FOOTER (STATIC / FLOW)   */}
            {/* =========================== */}
            {/* 'fixed bottom-0' DIHAPUS. */}
            {/* Footer sekarang mengikuti flow dokumen. Karena <main> pakai 'flex-grow', footer akan otomatis di bawah. */}
            <footer className="w-full bg-white border-t-4 border-red-600 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10 mt-auto">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-2">
                    
                    {/* Copyright Kiri */}
                    <div className="text-center md:text-left">
                        <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                            <span>&copy; 2025 Pemerintah Kabupaten SOEMENEPZ.</span>
                        </div>
                    </div>

                    {/* Links Kanan */}
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-500 hover:text-red-600 text-[10px] font-bold uppercase tracking-wider transition-colors">
                            Bantuan
                        </a>
                        <a href="#" className="text-gray-500 hover:text-red-600 text-[10px] font-bold uppercase tracking-wider transition-colors">
                            Privasi
                        </a>
                        <a href="#" className="text-gray-500 hover:text-red-600 text-[10px] font-bold uppercase tracking-wider transition-colors">
                            Syarat & Ketentuan
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}