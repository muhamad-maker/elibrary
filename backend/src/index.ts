import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';

import authRoutes from './routes/auth';
import bookRoutes from './routes/books';
import loanRoutes from './routes/loans';
import mediaRoutes from './routes/media';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 3001;

// Setup Socket.io untuk Live Chat (Tanya Pustakawan)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('User connected to chat:', socket.id);
  
  socket.on('sendMessage', (data) => {
    // Mem-broadcast pesan ke pustakawan atau user lain
    io.emit('receiveMessage', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/admin', adminRoutes);

// Endpoint Berita Mock (Fitur 9)
app.get('/api/news', (req: Request, res: Response) => {
  res.json([
    { id: 1, title: 'Bulan Literasi Sekolah 2026', content: 'Ikuti lomba membaca buku terbanyak...', date: '2026-09-01' },
    { id: 2, title: 'Koleksi E-Book Baru dari Erlangga', content: 'Telah hadir ribuan e-book fisika dan matematika...', date: '2026-09-15' }
  ]);
});

// Endpoint Rekomendasi Mock (Fitur 6)
app.get('/api/recommendations', (req: Request, res: Response) => {
  res.json([
    { id: 'rec1', title: 'Belajar React.js untuk Pemula', author: 'John Doe', type: 'EBOOK' },
    { id: 'rec2', title: 'Fisika Kuantum Dasar', author: 'Albert S.', type: 'PHYSICAL_BOOK' }
  ]);
});

// Test Endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'E-Library API & WebSocket Berjalan Sempurna!' });
});

// Start Server dengan HTTP & WebSocket
httpServer.listen(PORT, () => {
  console.log(`🚀 Server Backend & WebSocket berjalan di http://localhost:${PORT}`);
});
