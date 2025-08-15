// src/routes/notifications.js
import express from 'express';
import requireUser from '../middleware/supabaseAuth.js';
import { Notification } from '../models/index.js';

const router = express.Router();

router.get('/', requireUser, async (req, res) => {
  const list = await Notification.findAll({ where: { user_id: req.user.id }, order: [['created_at','desc']] });
  res.json(list);
});

router.post('/:id/read', requireUser, async (req, res) => {
  const n = await Notification.findByPk(req.params.id);
  if (!n || n.user_id !== req.user.id) return res.status(404).json({ error: 'Not found' });
  n.is_read = true; await n.save();
  res.json(n);
});

export default router;
