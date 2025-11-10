import { Router } from 'express';
import { Types } from 'mongoose';
import { requireAuth } from '../middleware/auth.js';
import { requireRole } from '../middleware/role.js';
import { Event } from '../models/Event.js';

const router = Router();

router.get('/', async (_req, res) => {
  const events = await Event.find({ status: 'approved' }).sort({ date: 1 });
  res.json(events);
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
  const event = await Event.findById(id);
  if (!event || event.status !== 'approved') return res.status(404).json({ message: 'Not found' });
  res.json(event);
});

router.post('/', requireAuth, requireRole('organizer', 'admin'), async (req, res) => {
  const auth = req.auth;
  const { title, description, date, location, seats } = req.body || {};
  const event = await Event.create({
    title,
    description,
    date: new Date(date),
    location,
    seats,
    organizerId: new Types.ObjectId(auth.userId),
    status: auth.role === 'admin' ? 'approved' : 'pending'
  });
  res.status(201).json(event);
});

router.put('/:id', requireAuth, requireRole('organizer', 'admin'), async (req, res) => {
  const auth = req.auth;
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
  const update = { ...req.body };
  if (update.date) update.date = new Date(update.date);
  delete update.status; delete update.organizerId;
  const event = await Event.findById(id);
  if (!event) return res.status(404).json({ message: 'Not found' });
  if (auth.role !== 'admin' && event.organizerId.toString() !== auth.userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  if (typeof update.seats === 'number' && update.seats < 0) {
    return res.status(400).json({ message: 'seats cannot be negative' });
  }
  const updated = await Event.findByIdAndUpdate(id, update, { new: true });
  res.json(updated);
});

router.delete('/:id', requireAuth, requireRole('organizer', 'admin'), async (req, res) => {
  const auth = req.auth;
  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) return res.status(400).json({ message: 'Invalid id' });
  const event = await Event.findById(id);
  if (!event) return res.status(404).json({ message: 'Not found' });
  if (auth.role !== 'admin' && event.organizerId.toString() !== auth.userId) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  await Event.findByIdAndDelete(id);
  res.json({ message: 'Deleted' });
});

export default router;


