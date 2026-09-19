import Link from 'next/link';
import { BookOpen, User, Search } from 'lucide-react';

export default function Navbar() {
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
            <Link href="/login" className="text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md font-medium flex items-center gap-2">
              <User className="w-4 h-4" /> Masuk
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

