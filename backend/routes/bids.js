// src/routes/bids.js
import express from 'express';
import { Auction, Bid, User } from '../models/index.js';
import requireUser from '../middleware/supabaseAuth.js';
import { getHighestBid, setHighestBid } from '../services/auctionService.js';

const router = express.Router();

// place bid (buyer only)
router.post('/', requireUser, async (req, res) => {
  try {
    const me = await User.findByPk(req.user.id);
    if (!me || me.role !== 'buyer') return res.status(403).json({ error: 'Buyer only' });

    const { auction_id, amount } = req.body;
    const auction = await Auction.findByPk(auction_id);
    if (!auction) return res.status(404).json({ error: 'Auction not found' });

    const now = new Date();
    if (auction.status !== 'active' || now < new Date(auction.start_time) || now > new Date(auction.end_time)) {
      return res.status(400).json({ error: 'Auction not active' });
    }

    const current = (await getHighestBid(auction.id)) ?? (auction.highest_bid_amount ? parseFloat(auction.highest_bid_amount) : parseFloat(auction.start_price));
    const min = current + parseFloat(auction.bid_increment);

    if (parseFloat(amount) < min) return res.status(400).json({ error: `Bid too low. Minimum ${min}` });

    // Save bid
    const bid = await Bid.create({ auction_id: auction.id, user_id: me.id, amount });

    // Update Redis + auction snapshot
    await setHighestBid(auction.id, amount);
    auction.highest_bid_id = bid.id;
    auction.highest_bid_amount = amount;
    await auction.save();

    // Broadcast real-time update & simple in-app notifications via socket
    req.io.to(`auction_${auction.id}`).emit('new_bid', { auction_id: auction.id, amount: parseFloat(amount), user_id: me.id });
    req.io.to(`auction_${auction.id}`).emit('notify', { type: 'bid', message: `New bid ${amount} on "${auction.title}"` });

    res.json(bid);
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
});

export default router;
