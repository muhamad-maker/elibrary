'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { BookOpen, User, Search } from 'lucide-react';

export default function Navbar() {
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      setRole(user?.role || null);
    } catch {
      setRole(null);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="text-blue-600 w-8 h-8" />
            <Link href="/" className="font-bold text-xl text-gray-900">E-Library</Link>
          </div>
          <div className="hidden md:flex space-x-8">
            <Link href="/katalog" className="text-gray-600 hover:text-blue-600 flex items-center gap-1">
              <Search className="w-4 h-4" /> Katalog
            </Link>
            <Link href="/berita" className="text-gray-600 hover:text-blue-600 flex items-center gap-1">
              Berita
            </Link>
            {(role === 'ADMIN' || role === 'LIBRARIAN') && (
              <Link href="/admin" className="text-gray-600 hover:text-blue-600">Administrasi</Link>
            )}
            {role ? (
              <button onClick={logout} className="text-white bg-gray-700 hover:bg-gray-800 px-4 py-2 rounded-md font-medium">Keluar</button>
            ) : (
              <Link href="/login" className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium flex items-center gap-2">
                <User className="w-4 h-4" /> Masuk
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

