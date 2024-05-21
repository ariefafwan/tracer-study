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
        Schema::create('master_pertanyaan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('id_kategori_pertanyaan')->constrained('master_kategori_pertanyaan')->references('id')->onDelete('restrict')->onUpdate('cascade');
            $table->tinyInteger('urutan');
            $table->longText('pertanyaan');
            $table->enum('tipe', ['Pilihan', 'Inputan', 'Pilihan_2_Sisi_Pertanyaan', 'Pilihan_Dengan_SubTopik', 'Pilihan_Dengan_Inputan']);
            $table->enum('status', ['Wajib', 'Optional', 'Nonaktif']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_pertanyaan');
    }
};
