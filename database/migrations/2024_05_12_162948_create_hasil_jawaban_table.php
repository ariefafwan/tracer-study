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
        Schema::create('hasil_jawaban', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('id_alumni')->constrained('master_alumni')->references('id')->onDelete('restrict')->onUpdate('cascade');
            $table->foreignUuid('id_pertanyaan')->constrained('master_pertanyaan')->references('id')->onDelete('restrict')->onUpdate('cascade');
            $table->foreignUuid('id_sub_pertanyaan')->nullable()->constrained('master_sub_pertanyaan')->references('id')->onDelete('restrict')->onUpdate('cascade');
            $table->foreignUuid('id_sub_topik_pertanyaan')->nullable()->constrained('master_sub_topik_pertanyaan')->references('id')->onDelete('restrict')->onUpdate('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hasil_jawaban');
    }
};
