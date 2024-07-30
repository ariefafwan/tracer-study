<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Biodata;
use App\Models\Konten;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // \App\Models\User::factory(10)->create();

        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);

        User::Create([
            'name' => 'admin',
            'email' => 'admin@admin.com',
            'password' => Hash::make('password'),
        ]);

        Biodata::Create([
            'id' => '9c7899de-22f9-40e6-8e1d-76ac8785336c',
            'nama' => 'Universitas Cerdas Cermat',
            'alamat' => 'Massachusetts Hall, Cambridge, MA 02138, Amerika Serikat',
            'logo' => 'pngtree-university-logo-png-png-image_6855396.png',
            'no_telp' => '16174951000',
            'email' => 'university@gmail.com',
        ]);

        Konten::Create([
            'id' => '49fc8a0d-6b4c-4222-9d71-4dda48e9f758',
            'nama' => 'Lowongan Pekerjaan',
            'konten' => 'Maksimalkan pencarian kerja dengan rekomendasi loker khusus dari alumni ataupun dosesn lainnya hanya untukmu.',
            'tipe_konten' => 'Text',
        ]);

        Konten::Create([
            'id' => '6caadded-ec90-4b95-a920-f594578d6bae',
            'nama' => 'Header',
            'konten' => 'Selamat datang di Laman Tracer Study Universitas XX. Sesuai dengan Direktorat Pemebelajaran dan Kemahasiswaan, juga Direktorat Jenderal Pendidikan Tinggi, laman ini diperuntukkan untuk mengelola data hasil tracer study yang dilaksanakan oleh Universitas XX.',
            'tipe_konten' => 'Text',
        ]);

        Konten::Create([
            'id' => 'bd40e3b4-35bb-4ae5-b935-e8ae5ca3f74f',
            'nama' => 'FAQ',
            'konten' => 'Yang Sering Kali Ditanyakan',
            'tipe_konten' => 'Text',
        ]);

        Konten::Create([
            'id' => 'c3c50fb7-6e96-4234-9449-78aab957b89b',
            'nama' => 'Tentang Tracer Study',
            'konten' => 'Dikti saat ini sedang melaksanakan upaya untuk merintis kompilasi data tracer study nasional khususnya mengenai transisi dan posisi pekerjaan lulusan PT di Indonesia. Untuk itu sejak tahun 2011, telah dikembangkan suatu sistem online yang dapat digunakan oleh Perguruan Tinggi untuk melacak aktivitas para lulusannya setelah masa pendidikan tinggi, baik masa transisi maupun pergerakan mereka di dunia kerja sampai. Tracer study dinilai penting karena menjadi alat evaluasi kinerja PT dan sekarang telah dijadikan salah satu syarat kelengkapan akreditasi oleh Badan Akreditasi Nasional Perguruan Tinggi (BAN-PT), sebagai kelengkapan dalam dokumen Evaluasi Diri yang diperlukan dalam pengajuan proposal melalui Kemdikbud. Tracer study online Dikti ditujukan untuk melacak jejak lulusan/alumni yang dilakukan 2 tahun setelah lulus dan bertujuan untuk mengetahui:\r\n\r\nOutcome pendidikan dalam bentuk transisi dari dunia pendidikan tinggi ke dunia kerja (termasuk masa tunggu kerja dan proses pencarian kerja pertama), situasi kerja terakhir, dan aplikasi kompetensi di dunia kerja.\r\nOutput pendidikan yaitu penilaian diri terhadap penguasaan dan pemerolehan kompetensi.\r\nProses pendidikan berupa evaluasi proses pembelajaran dan kontribusi pendidikan tinggi terhadap pemerolehan kompetensi. Hasil tracer study akan membantu PT dalam mengetahui posisi lulusan yang telah terserap dalam dunia kerja serta menyiapkan lulusan sesuai dengan kompetansi yang diperlukan di dunia kerja. Hasil tracer study yang kemudian dilaporkan ke Dikti akan membantu program Pemerintah dalam rangka memetakan kebutuhan dunia kerja dengan pembangunan pendidikan di Indonesia.',
            'tipe_konten' => 'Text',
        ]);

        Konten::Create([
            'id' => 'e2d4b2b3-2387-49ca-bd90-ecbe7d947b68',
            'nama' => 'Gambar Header',
            'gambar' => 'Happy cartoon college or university students holding diplomas.jpg',
            'tipe_konten' => 'Gambar',
        ]);
    }
}
