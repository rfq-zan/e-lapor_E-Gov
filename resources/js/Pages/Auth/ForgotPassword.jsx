import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm, Link } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    // UBAH FOKUS RING JADI MERAH
    const inputClasses = "mt-1 block w-full !bg-white !text-black !border-black focus:!border-red-700 focus:!ring-red-700 !rounded-none shadow-sm placeholder-gray-500 p-2.5";
    const labelClasses = "!text-black font-bold mb-1";

    return (
        // UBAH BACKGROUND GRADASI JADI MERAH
        <div className="min-h-screen flex flex-col justify-center items-center pt-6 sm:pt-0 bg-gradient-to-br from-red-900 via-red-600 to-red-200 px-4">
            <Head title="Lupa Password" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-200 bg-green-900/50 p-3 rounded border border-green-400 w-full sm:max-w-lg">
                    {status}
                </div>
            )}

            <div className="w-full sm:max-w-lg mt-6 px-8 py-10 bg-white shadow-2xl overflow-hidden">
                
                <div className="mb-8 text-center">
                    <div className="flex justify-center mb-4">
                        {/* UBAH BG ICONS JADI MERAH MUDA */}
                        <div className="p-3 bg-red-100 rounded-full">
                            {/* UBAH WARNA SVG JADI MERAH */}
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-red-600">
                                <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H8.25z" clipRule="evenodd" />
                                <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-2xl font-extrabold text-gray-900">Lupa Password?</h2>
                </div>

                <form onSubmit={submit} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="email" value="Email" className={labelClasses} />
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className={inputClasses}
                            isFocused={true}
                            onChange={(e) => setData('email', e.target.value)}
                            placeholder="Masukkan email Anda"
                        />
                        <InputError message={errors.email} className="mt-2" />
                    </div>

                    <div className="flex flex-col items-center gap-4">
                         {/* UBAH WARNA TOMBOL DAN SHADOW JADI MERAH */}
                        <PrimaryButton 
                            className="w-full flex justify-center py-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold text-lg !rounded-none transition ease-in-out duration-150 shadow-lg shadow-red-500/30" 
                            disabled={processing}
                        >
                            KIRIM TAUTAN RESET
                        </PrimaryButton>
                        
                        {/* UBAH WARNA HOVER LINK JADI MERAH */}
                        <Link 
                            href={route('login')}
                            className="text-sm font-semibold text-gray-600 hover:text-red-600 hover:underline"
                        >
                            &larr; Kembali ke Login
                        </Link>
                    </div>
                </form>

                <div className="mt-8 text-center text-xs text-gray-400 border-t pt-4">
                    &copy; 2025 Pemerintah Kabupaten SOEMENEPZ.
                </div>
            </div>
        </div>
    );
}