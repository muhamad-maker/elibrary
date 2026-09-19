import { Router, Request, Response } from 'express';
import QRCode from 'qrcode';

const router = Router();

// Endpoint untuk generate QR Code Buku (Fitur 11)
router.get('/qrcode/:bookId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { bookId } = req.params;
    
    // URL atau Data yang akan dimasukkan ke dalam QR Code
    // Nantinya ketika admin/scanner men-scan, akan membuka halaman detail stok buku ini
    const qrData = `http://localhost:3000/admin/buku/${bookId}`;
    
    // Menghasilkan QR Code dalam bentuk Data URL (Base64)
    const qrCodeImage = await QRCode.toDataURL(qrData);
    
    res.json({ bookId, qrCodeImage });
  } catch (error) {
    res.status(500).json({ error: 'Gagal membuat QR Code' });
  }
});

// Endpoint Upload File (Dummy untuk MinIO)
// Pada implementasi penuh, kita akan menggunakan SDK MinIO (minio.Client) 
// dan multer untuk mengunggah file PDF / Video ke bucket MinIO.
router.post('/upload', (req: Request, res: Response) => {
  res.json({ 
    message: 'File berhasil diunggah', 
    fileUrl: 'http://localhost:9000/elibrary-bucket/sample-ebook.pdf' 
  });
});

export default router;

