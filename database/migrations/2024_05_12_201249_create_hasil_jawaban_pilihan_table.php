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
        Schema::create('hasil_jawaban_pilihan', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('id_hasil_jawaban')->constrained('hasil_jawaban')->references('id')->onDelete('restrict')->onUpdate('cascade');
            $table->foreignUuid('id_pilihan_jawaban')->nullable()->constrained('master_pilihan_jawaban')->references('id')->onDelete('restrict')->onUpdate('cascade');
            $table->text('jawaban_input')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hasil_jawaban_pilihan');
    }
};
