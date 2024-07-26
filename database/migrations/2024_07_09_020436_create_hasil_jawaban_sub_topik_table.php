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
        Schema::create('hasil_jawaban_sub_topik', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('id_hasil_jawaban')->constrained('hasil_jawaban')->references('id')->onDelete('restrict')->onUpdate('cascade');
            $table->foreignUuid('id_sub_topik')->constrained('master_sub_topik_pertanyaan')->references('id')->onDelete('restrict')->onUpdate('cascade');
            $table->text('jawaban');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hasil_jawaban_sub_topik');
    }
};
