// src/index.js
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import sequelize from './config/db.js';
import './models/index.js';

import auctionsRoutes from './routes/auctions.js';
import bidsRoutes from './routes/bids.js';
import notificationsRoutes from './routes/notifications.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || '*' }));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_ORIGIN || '*', methods: ['GET', 'POST'] }
});

// attach io to every request
app.use((req, _res, next) => { req.io = io; next(); });

// API routes
app.use('/auctions', auctionsRoutes);
app.use('/bids', bidsRoutes);
app.use('/notifications', notificationsRoutes);

// health check
app.get('/health', (_req, res) => res.json({ ok: true }));

// sockets: join rooms per auction
io.on('connection', (socket) => {
  console.log('🔌 socket connected', socket.id);
  socket.on('join_auction', (auctionId) => {
    socket.join(`auction_${auctionId}`);
  });
  socket.on('leave_auction', (auctionId) => {
    socket.leave(`auction_${auctionId}`);
  });
  socket.on('disconnect', () => console.log('🔌 socket disconnected', socket.id));
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, 'frontend', 'dist'); // adjust path if needed
  app.use(express.static(buildPath));

  // Catch-all to serve index.html for SPA
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 8080;
server.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ DB connected');
  } catch (e) {
    console.error('❌ DB connect error', e.message);
  }
  console.log(`🚀 Server listening on ${PORT}`);
});
