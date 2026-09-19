'use client';
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageCircle, X, Send } from 'lucide-react';

let socket: Socket;

export default function LiveChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ sender: string, text: string }[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    // Inisialisasi koneksi Socket.io
    socket = io('http://localhost:3001');

    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      const msgData = { sender: 'Siswa', text: input };
      socket.emit('sendMessage', msgData);
      setInput('');
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tombol Buka Chat */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Jendela Chat */}
      {isOpen && (
        <div className="bg-white border rounded-xl shadow-2xl w-80 h-96 flex flex-col">
          <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">
            <h3 className="font-bold">Tanya Pustakawan</h3>
            <button onClick={() => setIsOpen(false)}><X className="w-5 h-5" /></button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-2">
            <div className="text-xs text-center text-gray-400 mb-2">Pustakawan online</div>
            {messages.map((msg, idx) => (
              <div key={idx} className={`max-w-[80%] rounded-lg p-2 text-sm ${msg.sender === 'Siswa' ? 'bg-blue-100 self-end text-blue-900' : 'bg-white border self-start'}`}>
                <span className="font-bold text-[10px] block text-gray-500">{msg.sender}</span>
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={sendMessage} className="p-3 border-t bg-white flex gap-2 rounded-b-xl">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ketik pesan..."
              className="flex-1 text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
            <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700">
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

