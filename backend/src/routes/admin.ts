import { Request, Response, Router } from 'express';
import { PrismaClient, Role, ResourceType } from '@prisma/client';
import { AuthenticatedRequest, requireAdmin, requireAuth } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(requireAuth, requireAdmin);

router.get('/summary', async (_req: Request, res: Response) => {
  try {
    const [books, users, activeLoans, overdueLoans, availableBooks] = await Promise.all([
      prisma.book.count(),
      prisma.user.count(),
      prisma.loan.count({ where: { status: 'BORROWED' } }),
      prisma.loan.count({ where: { status: 'OVERDUE' } }),
      prisma.book.aggregate({ _sum: { availableStock: true } }),
    ]);

    res.json({ books, users, activeLoans, overdueLoans, availableCopies: availableBooks._sum.availableStock || 0 });
  } catch {
    res.status(500).json({ error: 'Gagal mengambil ringkasan admin' });
  }
});

router.get('/users', async (_req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, memberId: true, role: true, isActive: true, createdAt: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json(users);
  } catch {
    res.status(500).json({ error: 'Gagal mengambil daftar pengguna' });
  }
});

router.patch('/users/:id', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { role, isActive } = req.body as { role?: Role; isActive?: boolean };
    if (role && !Object.values(Role).includes(role)) {
      res.status(400).json({ error: 'Role tidak valid' });
      return;
    }
    if (req.params.id === req.user?.id && role && role !== 'ADMIN') {
      res.status(400).json({ error: 'Akun administrator aktif tidak boleh menurunkan rolenya sendiri' });
      return;
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: { ...(role ? { role } : {}), ...(typeof isActive === 'boolean' ? { isActive } : {}) },
      select: { id: true, name: true, email: true, role: true, isActive: true },
    });
    res.json(user);
  } catch {
    res.status(404).json({ error: 'Pengguna tidak ditemukan' });
  }
});

router.get('/loans', async (_req: Request, res: Response) => {
  try {
    const loans = await prisma.loan.findMany({
      include: { user: { select: { name: true, email: true } }, book: { select: { title: true } } },
      orderBy: { loanDate: 'desc' },
    });
    res.json(loans);
  } catch {
    res.status(500).json({ error: 'Gagal mengambil daftar peminjaman' });
  }
});

router.post('/loans/:id/return', async (req: Request, res: Response) => {
  try {
    const loan = await prisma.loan.findUnique({ where: { id: req.params.id } });
    if (!loan || loan.status === 'RETURNED') {
      res.status(400).json({ error: 'Peminjaman tidak valid atau sudah dikembalikan' });
      return;
    }
    await prisma.$transaction([
      prisma.loan.update({ where: { id: loan.id }, data: { status: 'RETURNED', returnDate: new Date() } }),
      prisma.book.update({ where: { id: loan.bookId }, data: { availableStock: { increment: 1 } } }),
    ]);
    res.json({ message: 'Buku berhasil dikembalikan' });
  } catch {
    res.status(500).json({ error: 'Gagal memproses pengembalian' });
  }
});

router.patch('/books/:id', async (req: Request, res: Response) => {
  try {
    const { title, author, isbn, stock, resourceType, description } = req.body as {
      title?: string; author?: string; isbn?: string; stock?: number; resourceType?: ResourceType; description?: string;
    };
    const current = await prisma.book.findUnique({ where: { id: req.params.id } });
    if (!current) { res.status(404).json({ error: 'Buku tidak ditemukan' }); return; }
    const nextStock = typeof stock === 'number' ? stock : current.stock;
    const borrowed = current.stock - current.availableStock;
    if (nextStock < borrowed) { res.status(400).json({ error: `Stok minimal ${borrowed} karena masih dipinjam` }); return; }
    const book = await prisma.book.update({
      where: { id: current.id },
      data: { title, author, isbn, resourceType, description, stock: nextStock, availableStock: nextStock - borrowed },
    });
    res.json(book);
  } catch { res.status(500).json({ error: 'Gagal memperbarui buku' }); }
});

router.delete('/books/:id', async (req: Request, res: Response) => {
  try {
    const loans = await prisma.loan.count({ where: { bookId: req.params.id, status: { not: 'RETURNED' } } });
    if (loans > 0) { res.status(400).json({ error: 'Buku masih dipinjam dan tidak dapat dihapus' }); return; }
    await prisma.book.delete({ where: { id: req.params.id } });
    res.json({ message: 'Buku berhasil dihapus' });
  } catch { res.status(404).json({ error: 'Buku tidak ditemukan' }); }
});

export default router;