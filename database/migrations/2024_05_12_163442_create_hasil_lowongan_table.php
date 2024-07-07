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
        Schema::create('hasil_lowongan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('id_alumni')->nullable()->constrained('master_alumni')->references('id')->onDelete('restrict')->onUpdate('cascade');
            $table->foreignUuid('id_dosen')->nullable()->constrained('master_dosen')->references('id')->onDelete('restrict')->onUpdate('cascade');
            $table->string('kota');
            $table->string('nama_perusahaan');
            $table->string('logo_perusahaan');
            $table->string('bidang_usaha');
            $table->string('link_lowongan');
            $table->string('judul_lowongan');
            $table->string('slug');
            $table->longText('desk');
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hasil_lowongan');
    }
};
