import { Link, Head, router } from '@inertiajs/react';

export default function Welcome({ auth }) {

    const handleLogout = (e) => {
        e.preventDefault();
        router.post(route('logout'));
    };

    return (
        <>
            <Head title="E-Lapor Pemerintah Daerah" />
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-gray-100">

                <div className="w-full max-w-lg p-8 bg-white shadow-xl rounded-2xl">
                    <div className="flex justify-center mb-6">
                        <div className="p-4 bg-indigo-100 rounded-full">
                            <svg className="w-12 h-12 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
                            </svg>
                        </div>
                    </div>

                    <h1 className="mb-2 text-3xl font-extrabold text-gray-900">Layanan Aspirasi Warga</h1>

                    {auth.user && (
                        <p className="mb-2 font-medium text-green-600">
                            Halo, {auth.user.name} ({auth.user.role})
                        </p>
                    )}

                    <p className="mb-8 text-gray-600">
                        Sampaikan laporan Anda langsung kepada instansi pemerintah terkait.
                    </p>

                    <div className="space-y-4">
                        {auth.user ? (
                            <>
                                <Link
                                    href={auth.user.role === 'admin' ? route('admin.dashboard') : route('complaints.index')}
                                    className="block w-full px-4 py-3 font-bold text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
                                >
                                    Masuk ke Dashboard
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="block w-full px-4 py-3 font-bold text-red-700 transition bg-red-100 rounded-lg hover:bg-red-200"
                                >
                                    Logout (Keluar)
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={route('login')}
                                    className="block w-full px-4 py-3 font-bold text-white transition bg-indigo-600 rounded-lg hover:bg-indigo-700"
                                >
                                    Login
                                </Link>
                                <Link
                                    href={route('register')}
                                    className="block w-full px-4 py-3 font-bold text-gray-700 transition bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Daftar Akun Baru
                                </Link>
                            </>
                        )}
                    </div>

                    <div className="mt-8 text-xs text-gray-400">
                        &copy; 2025 Pemerintah Kabupaten SOEMENEPZ.
                    </div>
                </div>
            </div>
        </>
    );
}
