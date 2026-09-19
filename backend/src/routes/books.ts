import { Router, Request, Response } from 'express';
import { PrismaClient, ResourceType } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Mendapatkan semua buku (Fitur Katalog & Pencarian)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { search, category, type } = req.query;

    const books = await prisma.book.findMany({
      where: {
        AND: [
          search ? { title: { contains: String(search), mode: 'insensitive' } } : {},
          category ? { category: { name: String(category) } } : {},
          type ? { resourceType: type as ResourceType } : {},
        ]
      },
      include: { category: true }
    });

    res.json(books);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data buku' });
  }
});

// Mendapatkan detail satu buku berdasarkan ID
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const book = await prisma.book.findUnique({
      where: { id: req.params.id },
      include: { category: true }
    });
    
    if (!book) {
      res.status(404).json({ error: 'Buku tidak ditemukan' });
      return;
    }
    
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil data buku' });
  }
});

// Endpoint untuk menambahkan buku baru (Khusus Admin/Pustakawan)
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, author, isbn, stock, resourceType, categoryId, description } = req.body;
    const newBook = await prisma.book.create({
      data: {
        title,
        author,
        isbn,
        stock: stock || 1,
        availableStock: stock || 1,
        resourceType: resourceType || 'PHYSICAL_BOOK',
        categoryId,
        description
      }
    });
    res.status(201).json(newBook);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Gagal menambahkan buku' });
  }
});

export default router;

