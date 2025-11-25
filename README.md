# Sistem Pengaduan Masyarakat (E-Government)

Aplikasi E-Government berbasis web untuk pelaporan aspirasi dan pengaduan masyarakat, dibangun dengan arsitektur Monolith Modern.

![App Screenshot]()

## Tech Stack
- **Backend:** Laravel 12
- **Frontend:** React.js (via Inertia.js)
- **Styling:** Tailwind CSS
- **Database:** MySQL 8
- **Auth:** Laravel Breeze

## Fitur Utama
- 🔐 **Multi-role Authentication:** Warga, Admin, Petugas Lapangan.
- 📝 **Pelaporan:** Upload bukti foto & lokasi.
- 📊 **Tracking:** Status tiket (Pending, Proses, Selesai).
- 📱 **Responsive:** Tampilan mobile-friendly untuk warga.

## Cara Instalasi (Local Development)

1. **Clone Repository**
   ```bash
   git clone [[https://github.com/username/repo-name.git](https://github.com/username/repo-name.git)](https://github.com/rfq-zan/e-lapor_E-Gov.git)
   cd e-lapor_E-Gov
2. **Installing NPM**
   ```bash
   npm i
4. **Installing Laravel ( Needs to be Laravel 12+, choose breeze & react )**
   ```bash
   composer i
   composer require laravel/breeze --dev
   php artisan laravel/breeeze i
5. **Running apps**
a. **Run the npm 1st**
    ```bash
   npm run dev
b. **Then run the php**
```bash
    php artisan serve
