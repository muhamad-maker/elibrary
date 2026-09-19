'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

const initialForm = {
  title: '',
  author: '',
  isbn: '',
  stock: '1',
  resourceType: 'PHYSICAL_BOOK',
  description: '',
};

export default function AdminPage() {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user?.role !== 'ADMIN' && user?.role !== 'LIBRARIAN') router.replace('/login');
    } catch {
      router.replace('/login');
    } finally {
      setChecking(false);
    }
  }, [router]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      await api.post('/api/books', { ...form, stock: Number(form.stock) });
      setForm(initialForm);
      setMessage('Buku berhasil ditambahkan ke katalog.');
    } catch (requestError: any) {
      setError(requestError.response?.data?.error || 'Buku gagal ditambahkan.');
    }
  };

  if (checking) return <p className="p-8 text-center">Memeriksa akses...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Administrasi Katalog</h1>
      <p className="text-gray-600 mb-8">Tambahkan koleksi baru ke perpustakaan.</p>
      <form onSubmit={submit} className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
        {message && <p className="bg-green-50 text-green-700 p-3 rounded">{message}</p>}
        {error && <p className="bg-red-50 text-red-700 p-3 rounded">{error}</p>}
        <input required placeholder="Judul buku" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full border rounded px-3 py-2" />
        <input required placeholder="Penulis" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full border rounded px-3 py-2" />
        <div className="grid sm:grid-cols-3 gap-4">
          <input placeholder="ISBN" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} className="border rounded px-3 py-2" />
          <input required type="number" min="0" placeholder="Stok" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="border rounded px-3 py-2" />
          <select value={form.resourceType} onChange={(e) => setForm({ ...form, resourceType: e.target.value })} className="border rounded px-3 py-2">
            <option value="PHYSICAL_BOOK">Buku fisik</option>
            <option value="EBOOK">E-book</option>
            <option value="JOURNAL">Jurnal</option>
            <option value="MULTIMEDIA">Multimedia</option>
          </select>
        </div>
        <textarea placeholder="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border rounded px-3 py-2 min-h-28" />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded font-medium">Tambah buku</button>
      </form>
    </div>
  );
}