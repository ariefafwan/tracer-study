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
        Schema::create('master_sub_pertanyaan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('id_pertanyaan')->constrained('master_pertanyaan')->references('id')->onDelete('cascade')->onUpdate('cascade');
            $table->foreignUuid('id_pilihan_jawaban')->nullable()->constrained('master_pilihan_jawaban')->references('id')->onDelete('cascade')->onUpdate('cascade');
            $table->tinyInteger('urutan');
            $table->enum('jenis_subpertanyaan', ['Pilihan', 'Inputan_Angka', 'Inputan_Text', 'Inputan_Tanggal'])->nullable();
            $table->longText('sub_pertanyaan');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_sub_pertanyaan');
    }
};
