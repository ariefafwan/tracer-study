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
        Schema::create('master_dosen', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignId('id_user')->constrained('users')->references('id')->onDelete('restrict')->onUpdate('cascade');
            $table->foreignUuid('id_program_studi')->constrained('master_program_studi')->references('id')->onDelete('restrict')->onUpdate('cascade');
            $table->string('nama');
            $table->enum('jenis_kelamin', ['Laki-Laki', 'Perempuan']);
            $table->bigInteger('nidn')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('master_dosen');
    }
};
