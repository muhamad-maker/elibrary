import Link from 'next/link';
import { Search, Book, MonitorPlay, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full bg-blue-600 text-white py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          Selamat Datang di E-Library
        </h1>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Temukan ribuan koleksi buku fisik, jurnal ilmiah, e-book, hingga materi multimedia dari genggaman Anda.
        </p>
        
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/katalog" className="bg-white text-blue-600 font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition">
            <Search className="w-5 h-5" /> Cari Buku Sekarang
          </Link>
          <Link href="/login" className="bg-transparent border border-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition">
            Masuk / Daftar
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Fitur Unggulan</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Katalog Online</h3>
            <p className="text-gray-600 text-sm">Cari buku dengan filter lengkap berdasarkan penulis, judul, dan ISBN.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Book className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">E-Book & Jurnal</h3>
            <p className="text-gray-600 text-sm">Akses dan baca ribuan buku digital kapan saja tanpa harus ke perpustakaan.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <MonitorPlay className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Multimedia</h3>
            <p className="text-gray-600 text-sm">Tonton video edukasi dan dengarkan materi audio pendukung pelajaran.</p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border text-center">
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Tanya Pustakawan</h3>
            <p className="text-gray-600 text-sm">Tanya langsung pada pustakawan jika kesulitan mencari referensi tugas.</p>
          </div>

        </div>
      </section>
    </div>
  );
}
