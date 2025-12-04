import { useState } from 'react';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';

export default function UserLayout({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            
            {/* =========================== */}
            {/* 1. NAVBAR USER (FIXED TOP)  */}
            {/* =========================== */}
            <nav className="fixed top-0 w-full bg-white border-b border-gray-200 shadow-md z-50 transition-all duration-300 ease-in-out">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        
                        {/* KIRI: LOGO & MENU */}
                        <div className="flex">
                            {/* Logo Area */}
                            <div className="shrink-0 flex items-center">
                                <Link href={route('dashboard')}>
                                    <div className="flex items-center gap-3">
                                        {/* Ikon User/Masyarakat (Merah agar senada) */}
                                        <div className="p-2 bg-red-600 !rounded-none shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        {/* Teks Logo */}
                                        <div>
                                            <span className="block text-xl font-extrabold text-gray-900 tracking-tight leading-none">E-LAPOR</span>
                                            <span className="block text-[10px] font-bold text-red-600 tracking-widest uppercase">Layanan Aspirasi</span>
                                        </div>
                                    </div>
                                </Link>
                            </div>

                            {/* Desktop Menu Links (Khusus User) */}
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink 
                                    href={route('dashboard')} 
                                    active={route().current('dashboard')}
                                    className="text-gray-600 hover:text-red-600 border-b-2 border-transparent hover:border-red-600 focus:border-red-600 text-sm font-bold uppercase tracking-wide transition-colors"
                                >
                                    Dashboard Saya
                                </NavLink>
                                
                                {/* Menu Tambahan (Opsional) */}
                                <a 
                                    href="#" 
                                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-bold uppercase tracking-wide text-gray-600 hover:text-red-600 hover:border-red-600 transition-colors"
                                >
                                    Panduan
                                </a>
                            </div>
                        </div>

                        {/* KANAN: USER INFO & LOGOUT */}
                        <div className="hidden sm:flex sm:items-center sm:ms-6 gap-6">
                            
                            {/* User Info */}
                            <div className="text-right">
                                <div className="text-sm font-bold text-gray-900 uppercase">{user.name}</div>
                                <div className="text-xs text-gray-500 font-mono">Masyarakat Pelapor</div>
                            </div>

                            <div className="h-8 w-px bg-gray-300"></div>

                            {/* Tombol Logout (Merah Kotak) */}
                            <Link
                                method="post"
                                href={route('logout')}
                                as="button"
                                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider !rounded-none shadow-sm hover:shadow-md transition-all flex items-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                KELUAR
                            </Link>
                        </div>

                        {/* Hamburger (Mobile) */}
                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown((previousState) => !previousState)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150"
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

                {/* Responsive Menu */}
                <div className={(showingNavigationDropdown ? 'block' : 'hidden') + ' sm:hidden border-t border-gray-100 bg-white'}>
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink href={route('dashboard')} active={route().current('dashboard')}>
                            Dashboard Saya
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200 bg-gray-50">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800">{user.name}</div>
                            <div className="font-medium text-sm text-gray-500">{user.email}</div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route('profile.edit')}>Profile</ResponsiveNavLink>
                            <ResponsiveNavLink method="post" href={route('logout')} as="button" className="text-red-600 font-bold">
                                Keluar
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {/* --- 2. MAIN CONTENT --- */}
            {/* pt-20: Jarak untuk navbar fixed */}
            {/* pb-24: Jarak untuk footer fixed */}
            <main className="flex-grow pt-20 pb-24 w-full">
                {children}
            </main>

            {/* =========================== */}
            {/* 3. FOOTER (FIXED BOTTOM)    */}
            {/* =========================== */}
            <footer className="fixed bottom-0 w-full bg-white border-t-4 border-red-600 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-40">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-2">
                    
                    <div className="text-center md:text-left">
                        <div className="font-bold text-gray-900 text-sm flex items-center gap-2">
                            <span>&copy; 2025 Pemerintah Kabupaten SOEMENEPZ.</span>
                        </div>
                    </div>

                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-red-600 text-[10px] font-bold uppercase tracking-wider transition-colors">
                            Bantuan
                        </a>
                        <a href="#" className="text-gray-400 hover:text-red-600 text-[10px] font-bold uppercase tracking-wider transition-colors">
                            Kebijakan Privasi
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}