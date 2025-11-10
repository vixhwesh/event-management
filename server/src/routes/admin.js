import { Router } from 'express';
import { Types } from 'mongoose';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { Event } from '../models/Event.js';
import { User } from '../models/User.js';
import { Booking } from '../models/Booking.js';

const router = Router();

router.get('/events', requireAuth, requireRole('admin'), async (_req, res) => {
  const events = await Event.find().sort({ createdAt: -1 });
  res.json(events);
});

router.patch('/events/:id/approve', requireAuth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
  const updated = await Event.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

router.patch('/events/:id/reject', requireAuth, requireRole('admin'), async (req, res) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
  const updated = await Event.findByIdAndUpdate(id, { status: 'rejected' }, { new: true });
  if (!updated) return res.status(404).json({ message: 'Not found' });
  res.json(updated);
});

router.get('/users', requireAuth, requireRole('admin'), async (_req, res) => {
  const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
  res.json(users);
});

router.get('/bookings', requireAuth, requireRole('admin'), async (_req, res) => {
  const bookings = await Booking.find().sort({ createdAt: -1 });
  res.json(bookings);
});

export default router;


