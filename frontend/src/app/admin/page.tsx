'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

type Tab = 'overview' | 'books' | 'users' | 'loans';
type Book = { id: string; title: string; author: string; isbn?: string; stock: number; availableStock: number; resourceType: string; description?: string };
type User = { id: string; name: string; email: string; role: string; isActive: boolean };
type Loan = { id: string; status: string; dueDate: string; user: { name: string; email: string }; book: { title: string } };
type Summary = { books: number; users: number; activeLoans: number; overdueLoans: number; availableCopies: number };

const emptyBook = { title: '', author: '', isbn: '', stock: '1', resourceType: 'PHYSICAL_BOOK', description: '' };

export default function AdminPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('overview');
  const [summary, setSummary] = useState<Summary | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loans, setLoans] = useState<Loan[]>([]);
  const [form, setForm] = useState(emptyBook);
  const [editing, setEditing] = useState<Book | null>(null);
  const [search, setSearch] = useState('');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  const fail = (requestError: any) => { setError(requestError.response?.data?.error || 'Operasi gagal.'); setNotice(''); };
  const notify = (message: string) => { setNotice(message); setError(''); };
  const load = async () => {
    try {
      const [summaryRes, booksRes, usersRes, loansRes] = await Promise.all([
        api.get('/api/admin/summary'), api.get('/api/books'), api.get('/api/admin/users'), api.get('/api/admin/loans'),
      ]);
      setSummary(summaryRes.data); setBooks(booksRes.data); setUsers(usersRes.data); setLoans(loansRes.data);
    } catch (requestError: any) { fail(requestError); }
  };

  useEffect(() => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user?.role !== 'ADMIN') { router.replace('/login'); return; }
      load();
    } catch { router.replace('/login'); }
    finally { setChecking(false); }
  }, [router]);

  const saveBook = async (event: FormEvent) => {
    event.preventDefault();
    try {
      const data = { ...form, stock: Number(form.stock) };
      if (editing) { await api.patch(`/api/admin/books/${editing.id}`, data); notify('Data buku diperbarui.'); }
      else { await api.post('/api/books', data); notify('Buku berhasil ditambahkan.'); }
      setForm(emptyBook); setEditing(null); await load();
    } catch (requestError: any) { fail(requestError); }
  };

  const updateUser = async (user: User, values: { role?: string; isActive?: boolean }) => {
    try { await api.patch(`/api/admin/users/${user.id}`, values); notify('Data pengguna diperbarui.'); await load(); }
    catch (requestError: any) { fail(requestError); }
  };

  const returnLoan = async (loan: Loan) => {
    try { await api.post(`/api/admin/loans/${loan.id}/return`); notify('Buku dikembalikan.'); await load(); }
    catch (requestError: any) { fail(requestError); }
  };

  const editBook = (book: Book) => {
    setEditing(book);
    setForm({ title: book.title, author: book.author, isbn: book.isbn || '', stock: String(book.stock), resourceType: book.resourceType, description: book.description || '' });
  };

  const deleteBook = async (book: Book) => {
    if (!window.confirm(`Hapus buku "${book.title}"?`)) return;
    try { await api.delete(`/api/admin/books/${book.id}`); notify('Buku dihapus.'); await load(); }
    catch (requestError: any) { fail(requestError); }
  };

  if (checking) return <p className="p-8 text-center">Memeriksa akses administrator...</p>;
  const visibleBooks = books.filter((book) => `${book.title} ${book.author}`.toLowerCase().includes(search.toLowerCase()));
  const cards = summary ? [['Total buku', summary.books], ['Pengguna', summary.users], ['Sedang dipinjam', summary.activeLoans], ['Terlambat', summary.overdueLoans], ['Salinan tersedia', summary.availableCopies]] : [];
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

  return <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-wider text-blue-600">Pusat kendali</p><h1 className="text-3xl font-bold text-slate-900">Administrasi E-Library</h1><p className="mt-1 text-slate-500">Kelola koleksi, akun anggota, dan sirkulasi buku.</p></div><button onClick={() => { load(); notify('Data diperbarui.'); }} className="rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Muat ulang</button></div>
    {(notice || error) && <div className={`mb-5 rounded-lg p-3 text-sm ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>{error || notice}</div>}
    <div className="mb-6 flex gap-2 overflow-x-auto border-b border-slate-200">{([['overview', 'Ringkasan'], ['books', 'Buku'], ['users', 'Pengguna'], ['loans', 'Peminjaman']] as [Tab, string][]).map(([key, label]) => <button key={key} onClick={() => setTab(key)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-semibold ${tab === key ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-500 hover:text-slate-900'}`}>{label}</button>)}</div>
    {tab === 'overview' && <><div className="grid grid-cols-2 gap-4 md:grid-cols-5">{cards.map(([label, value]) => <div key={label} className="rounded-xl border bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold text-slate-900">{value}</p></div>)}</div><div className="mt-6 rounded-xl border bg-white p-6"><h2 className="font-bold text-slate-900">Aktivitas terbaru</h2><p className="mt-2 text-sm text-slate-500">{loans.length ? `${loans.length} transaksi tercatat. Buka tab Peminjaman untuk memproses pengembalian.` : 'Belum ada transaksi peminjaman.'}</p></div></>}
    {tab === 'books' && <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]"><section className="rounded-xl border bg-white p-5 shadow-sm"><div className="mb-4 flex flex-wrap items-center justify-between gap-3"><h2 className="font-bold">Katalog buku ({visibleBooks.length})</h2><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari judul atau penulis" className="rounded-lg border px-3 py-2 text-sm" /></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b text-xs uppercase text-slate-500"><tr><th className="p-3">Judul</th><th className="p-3">Tipe</th><th className="p-3">Stok</th><th className="p-3 text-right">Aksi</th></tr></thead><tbody>{visibleBooks.map((book) => <tr key={book.id} className="border-b last:border-0"><td className="p-3"><p className="font-semibold">{book.title}</p><p className="text-slate-500">{book.author}</p></td><td className="p-3 text-slate-500">{book.resourceType.replace('_', ' ')}</td><td className="p-3">{book.availableStock}/{book.stock}</td><td className="p-3 text-right"><button onClick={() => editBook(book)} className="mr-3 font-semibold text-blue-600">Edit</button><button onClick={() => deleteBook(book)} className="font-semibold text-red-600">Hapus</button></td></tr>)}</tbody></table></div></section><BookForm form={form} setForm={setForm} editing={editing} onSubmit={saveBook} onCancel={() => { setEditing(null); setForm(emptyBook); }} /></div>}
    {tab === 'users' && <section className="rounded-xl border bg-white p-5 shadow-sm"><h2 className="mb-4 font-bold">Pengguna terdaftar ({users.length})</h2><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b text-xs uppercase text-slate-500"><tr><th className="p-3">Pengguna</th><th className="p-3">Role</th><th className="p-3">Status</th><th className="p-3">Pengaturan</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-b last:border-0"><td className="p-3"><p className="font-semibold">{user.name}</p><p className="text-slate-500">{user.email}</p></td><td className="p-3"><select value={user.role} onChange={(e) => updateUser(user, { role: e.target.value })} className="rounded border px-2 py-1" disabled={user.id === currentUser.id}><option>MEMBER</option><option>LIBRARIAN</option><option>ADMIN</option></select></td><td className="p-3"><span className={user.isActive ? 'text-green-600' : 'text-red-600'}>{user.isActive ? 'Aktif' : 'Nonaktif'}</span></td><td className="p-3"><button onClick={() => updateUser(user, { isActive: !user.isActive })} className="font-semibold text-blue-600">{user.isActive ? 'Nonaktifkan' : 'Aktifkan'}</button></td></tr>)}</tbody></table></div></section>}
    {tab === 'loans' && <section className="rounded-xl border bg-white p-5 shadow-sm"><h2 className="mb-4 font-bold">Peminjaman ({loans.length})</h2><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="border-b text-xs uppercase text-slate-500"><tr><th className="p-3">Buku</th><th className="p-3">Peminjam</th><th className="p-3">Jatuh tempo</th><th className="p-3">Status</th><th className="p-3 text-right">Aksi</th></tr></thead><tbody>{loans.map((loan) => <tr key={loan.id} className="border-b last:border-0"><td className="p-3 font-semibold">{loan.book.title}</td><td className="p-3"><p>{loan.user.name}</p><p className="text-slate-500">{loan.user.email}</p></td><td className="p-3">{new Date(loan.dueDate).toLocaleDateString('id-ID')}</td><td className="p-3"><span className={loan.status === 'RETURNED' ? 'text-green-600' : loan.status === 'OVERDUE' ? 'text-red-600' : 'text-amber-600'}>{loan.status}</span></td><td className="p-3 text-right">{loan.status !== 'RETURNED' && <button onClick={() => returnLoan(loan)} className="font-semibold text-blue-600">Proses kembali</button>}</td></tr>)}</tbody></table></div></section>}
  </div></div>;
}

function BookForm({ form, setForm, editing, onSubmit, onCancel }: { form: typeof emptyBook; setForm: (form: typeof emptyBook) => void; editing: Book | null; onSubmit: (event: FormEvent) => void; onCancel: () => void }) {
  return <form onSubmit={onSubmit} className="h-fit rounded-xl border bg-white p-5 shadow-sm"><h2 className="mb-4 font-bold">{editing ? 'Edit buku' : 'Tambah buku'}</h2><div className="space-y-3"><input required placeholder="Judul buku" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-lg border px-3 py-2" /><input required placeholder="Penulis" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} className="w-full rounded-lg border px-3 py-2" /><input placeholder="ISBN" value={form.isbn} onChange={(e) => setForm({ ...form, isbn: e.target.value })} className="w-full rounded-lg border px-3 py-2" /><div className="grid grid-cols-2 gap-3"><input required type="number" min="0" placeholder="Stok" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="rounded-lg border px-3 py-2" /><select value={form.resourceType} onChange={(e) => setForm({ ...form, resourceType: e.target.value })} className="rounded-lg border px-3 py-2"><option value="PHYSICAL_BOOK">Fisik</option><option value="EBOOK">E-book</option><option value="JOURNAL">Jurnal</option><option value="MULTIMEDIA">Multimedia</option></select></div><textarea placeholder="Deskripsi" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="min-h-24 w-full rounded-lg border px-3 py-2" /><div className="flex gap-2"><button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700">{editing ? 'Simpan perubahan' : 'Tambah buku'}</button>{editing && <button type="button" onClick={onCancel} className="rounded-lg border px-4 py-2">Batal</button>}</div></div></form>;
}
