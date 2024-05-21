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
        Schema::create('master_program_studi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('id_fakultas')->constrained('master_fakultas')->references('id')->onDelete('restrict')->onUpdate('cascade');
            $table->string('nama');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_program_studi');
    }
};
