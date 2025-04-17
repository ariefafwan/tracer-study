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
        Schema::create('hasil_lowongan_kualifikasi_studi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('id_hasil_lowongan')->constrained('hasil_lowongan')->references('id')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignUuid('id_program_studi')->nullable()->constrained('master_program_studi')->references('id')->onDelete('restrict')->onUpdate('cascade');
            $table->string('lainnya')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.`
     */
    public function down(): void
    {
        Schema::dropIfExists('hasil_lowongan_kualifikasi_studi');
    }
};
