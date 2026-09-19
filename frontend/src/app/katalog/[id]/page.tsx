'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Book, Play, Download, AlertCircle } from 'lucide-react';

export default function BookDetail({ params }: { params: { id: string } }) {
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/books/${params.id}`);
        setBook(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [params.id]);

  const handlePinjam = async () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
      alert('Anda harus login terlebih dahulu!');
      return;
    }
    
    try {
      await axios.post('http://localhost:3001/api/loans', {
        userId: user.id,
        bookId: book.id,
        days: 7
      });
      alert('Buku berhasil dipinjam!');
      // Refresh book data to update stock
      const res = await axios.get(`http://localhost:3001/api/books/${params.id}`);
      setBook(res.data);
    } catch (err: any) {
      alert(err.response?.data?.error || 'Gagal meminjam buku');
    }
  };

  if (loading) return <div className="p-8 text-center">Memuat detail buku...</div>;
  if (!book) return <div className="p-8 text-center text-red-500">Buku tidak ditemukan!</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-sm border p-6 md:p-8 flex flex-col md:flex-row gap-8">
        
        {/* Cover Placeholder */}
        <div className="w-full md:w-1/3 h-80 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
          <Book className="w-24 h-24" />
        </div>

        {/* Info Detail */}
        <div className="w-full md:w-2/3 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">{book.author}</p>
            
            <div className="flex gap-4 mb-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                {book.resourceType.replace('_', ' ')}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${book.availableStock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Sisa Stok: {book.availableStock}
              </span>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6">
              {book.description || "Deskripsi buku belum tersedia. Buku ini merupakan koleksi unggulan dari E-Library sekolah kita yang wajib Anda baca untuk menambah wawasan."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 pt-4 border-t">
            {book.resourceType === 'PHYSICAL_BOOK' && (
              <button 
                onClick={handlePinjam}
                disabled={book.availableStock <= 0}
                className={`flex-1 py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
                  book.availableStock > 0 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Book className="w-5 h-5" />
                {book.availableStock > 0 ? 'Pinjam Buku Fisik' : 'Stok Habis'}
              </button>
            )}

            {book.resourceType === 'EBOOK' && (
              <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-green-700 transition">
                <Download className="w-5 h-5" /> Baca / Unduh E-Book
              </button>
            )}

            {book.resourceType === 'MULTIMEDIA' && (
              <button className="flex-1 bg-purple-600 text-white py-3 px-6 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-purple-700 transition">
                <Play className="w-5 h-5" /> Putar Video Pembelajaran
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

