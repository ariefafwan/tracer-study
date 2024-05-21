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
        Schema::create('master_pilihan_jawaban', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('id_pertanyaan')->constrained('master_pertanyaan')->references('id')->onDelete('restrict')->onUpdate('cascade');
            $table->string('nama_pilihan')->nullable();
            $table->enum('pilihan_lainnya', ['Ya', 'Tidak']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_pilihan_jawaban');
    }
};
