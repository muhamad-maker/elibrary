'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Share2 } from 'lucide-react';

export default function Berita() {
  const [news, setNews] = useState<any[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/news');
        setNews(res.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchNews();
  }, []);

  const handleShare = (title: string) => {
    // Simulasi Fitur 10: Integrasi Media Sosial
    if (navigator.share) {
      navigator.share({
        title: title,
        url: window.location.href,
      });
    } else {
      alert(`Berhasil menyalin tautan untuk berita: ${title}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Berita & Acara Perpustakaan</h1>
      
      <div className="grid gap-6">
        {news.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {item.date}</span>
            </div>
            <p className="text-gray-700 mb-6">{item.content}</p>
            
            <button 
              onClick={() => handleShare(item.title)}
              className="flex items-center gap-2 text-blue-600 font-medium hover:text-blue-800 transition"
            >
              <Share2 className="w-4 h-4" /> Bagikan
            </button>
          </div>
        ))}
        {news.length === 0 && <p className="text-gray-500">Memuat berita...</p>}
      </div>
    </div>
  );
}

