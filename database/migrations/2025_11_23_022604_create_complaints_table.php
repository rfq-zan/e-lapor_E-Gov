<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('complaints', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');

                // --- KOLOM BARU SESUAI REACT ANDA ---
                $table->string('classification'); // pengaduan, aspirasi, permintaan
                $table->string('title');
                $table->text('description');
                $table->date('date');             // Tanggal kejadian
                $table->string('location');
                $table->string('instansi');       // Dinas tujuan
                $table->string('category');       // Sampah, Lingkungan, dll
                $table->enum('privacy', ['normal', 'anonim'])->default('normal');
                $table->string('image')->nullable();

                // Status tetap kita butuhkan untuk Admin
                $table->enum('status', ['pending', 'process', 'done', 'rejected'])->default('pending');
                $table->timestamps();
            });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
