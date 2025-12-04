import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';

export default function Authenticated({ user, children }) {

    const [showNavbar, setShowNavbar] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                const currentScrollY = window.scrollY;

                if (currentScrollY > lastScrollY && currentScrollY > 80) {
                    setShowNavbar(false);
                } else {
                    setShowNavbar(true);
                }
                setLastScrollY(currentScrollY);
            }
        };

        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [lastScrollY]);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">

            {/* =========================== */}
            {/* 1. NAVBAR (ANIMATED)        */}
            {/* =========================== */}
            <nav
                className={`fixed top-0 w-full bg-white border-b border-gray-200 shadow-md z-50 transition-transform duration-300 ease-in-out ${
                    showNavbar ? 'translate-y-0' : '-translate-y-full'
                }`}
            >
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">

                        {/* KIRI: LOGO & LABEL */}
                        <div className="flex">
                            <div className="flex items-center shrink-0">
                                {/* Link Logo mengarah ke Dashboard Admin jika user adalah admin, atau Home jika bukan */}
                                <Link href={user?.role === 'admin' ? route('admin.dashboard') : route('complaints.index')}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-red-600 !rounded-none shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                                                <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
                                                <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <span className="block text-xl font-extrabold leading-none tracking-tight text-gray-900">E-LAPOR</span>
                                            {user?.role === 'admin' ? (
                                                <span className="block text-[10px] font-bold text-red-600 tracking-widest uppercase">Admin Panel</span>
                                            ) : (
                                                <span className="block text-[10px] font-bold text-red-600 tracking-widest uppercase">SOEMENEPZ</span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>

                        {/* KANAN: USER INFO & LOGOUT */}
                        <div className="flex items-center gap-6">

                            {/* Informasi User (Data Asli dari Database) */}
                            <div className="hidden text-right sm:block">
                                <div className="text-sm font-bold text-gray-900 uppercase">
                                    {user?.name || 'Pengguna'} {/* Tanda tanya (?) mencegah error jika data belum load */}
                                </div>
                                <div className="font-mono text-xs text-gray-500">
                                    {user?.email || ''}
                                </div>
                            </div>

                            <div className="hidden w-px h-8 bg-gray-300 sm:block"></div>

                            {/* TOMBOL LOGOUT (YANG SUDAH DIPERBAIKI) */}
                            <Link
                                href={route('logout')}
                                method="post" // <--- INI KUNCINYA AGAR LOGOUT BERHASIL
                                as="button"
                                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider !rounded-none shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                <span className="hidden sm:inline">KELUAR</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- 3. KONTEN UTAMA --- */}
            <main className="flex-grow pt-24 pb-8">
                {children}
            </main>

            {/* =========================== */}
            {/* 4. FOOTER                   */}
            {/* =========================== */}
            <footer className="w-full bg-white border-t-4 border-red-600 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10 mt-auto">
                <div className="flex flex-col items-center justify-between gap-2 px-4 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8 md:flex-row">
                    <div className="text-center md:text-left">
                        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                            <span>&copy; 2025 Pemerintah Kabupaten SOEMENEPZ.</span>
                        </div>
                    </div>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-500 hover:text-red-600 text-[10px] font-bold uppercase tracking-wider transition-colors">Bantuan</a>
                        <a href="#" className="text-gray-500 hover:text-red-600 text-[10px] font-bold uppercase tracking-wider transition-colors">Privasi</a>
                        <a href="#" className="text-gray-500 hover:text-red-600 text-[10px] font-bold uppercase tracking-wider transition-colors">Syarat & Ketentuan</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
