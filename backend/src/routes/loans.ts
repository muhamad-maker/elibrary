import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Meminjam Buku
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId, bookId, days = 7 } = req.body;

    // Cek ketersediaan buku
    const book = await prisma.book.findUnique({ where: { id: bookId } });
    if (!book || book.availableStock <= 0) {
      res.status(400).json({ error: 'Buku tidak tersedia untuk dipinjam saat ini' });
      return;
    }

    // Hitung tanggal jatuh tempo
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);

    // Buat record peminjaman dan kurangi stok menggunakan transaksi
    const result = await prisma.$transaction([
      prisma.loan.create({
        data: {
          userId,
          bookId,
          dueDate,
          status: 'BORROWED'
        }
      }),
      prisma.book.update({
        where: { id: bookId },
        data: { availableStock: { decrement: 1 } }
      })
    ]);

    res.status(201).json({ message: 'Peminjaman berhasil dicatat', loan: result[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Terjadi kesalahan pada sistem peminjaman' });
  }
});

// Mengembalikan Buku
router.post('/:id/return', async (req: Request, res: Response): Promise<void> => {
  try {
    const loanId = req.params.id;

    const loan = await prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan || loan.status === 'RETURNED') {
      res.status(400).json({ error: 'Data peminjaman tidak valid atau buku sudah dikembalikan' });
      return;
    }

    // Update peminjaman dan tambah stok buku
    await prisma.$transaction([
      prisma.loan.update({
        where: { id: loanId },
        data: {
          status: 'RETURNED',
          returnDate: new Date()
        }
      }),
      prisma.book.update({
        where: { id: loan.bookId },
        data: { availableStock: { increment: 1 } }
      })
    ]);

    res.json({ message: 'Buku berhasil dikembalikan' });
  } catch (error) {
    res.status(500).json({ error: 'Gagal memproses pengembalian buku' });
  }
});

// Melihat Riwayat Peminjaman User
router.get('/user/:userId', async (req: Request, res: Response) => {
  try {
    const loans = await prisma.loan.findMany({
      where: { userId: req.params.userId },
      include: { book: true },
      orderBy: { loanDate: 'desc' }
    });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil riwayat peminjaman' });
  }
});

export default router;

