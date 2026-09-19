'use client';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Search, Book as BookIcon } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  stock: number;
  resourceType: string;
}

export default function Katalog() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/books', { params: { search } });
      setBooks(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchBooks();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Katalog Buku</h1>
      
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-8">
        <input 
          type="text" 
          placeholder="Cari judul atau penulis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
          <Search className="w-4 h-4" /> Cari
        </button>
      </form>

      {/* Book Grid */}
      {loading ? (
        <p className="text-center text-gray-500 py-10">Memuat katalog...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.length > 0 ? books.map(book => (
            <div key={book.id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
              <div className="h-48 bg-gray-200 flex items-center justify-center text-gray-400">
                <BookIcon className="w-12 h-12" />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-lg mb-1 truncate">{book.title}</h3>
                <p className="text-gray-600 text-sm mb-3 truncate">{book.author}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium">
                    {book.resourceType.replace('_', ' ')}
                  </span>
                  <span className={`text-xs font-bold ${book.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    Stok: {book.stock}
                  </span>
                </div>
              </div>
            </div>
          )) : (
            <p className="text-gray-500 col-span-full text-center py-10">Tidak ada buku yang ditemukan.</p>
          )}
        </div>
      )}
    </div>
  );
}

