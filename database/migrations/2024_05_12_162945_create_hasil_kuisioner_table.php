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
        Schema::create('hasil_kuisioner', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('id_alumni')->constrained('master_alumni')->references('id')->onDelete('restrict')->onUpdate('cascade');
            $table->date('tanggal_pengisian');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hasil_kuisioner');
    }
};
