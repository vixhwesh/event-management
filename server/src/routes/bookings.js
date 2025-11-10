import { Router } from 'express';
import { Types } from 'mongoose';
import { requireAuth } from '../middleware/auth.js';
import { Booking } from '../models/Booking.js';
import { Event } from '../models/Event.js';

const router = Router();

function generateTicketId() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TKT-${Date.now()}-${rand}`;
}

router.post('/', requireAuth, async (req, res) => {
  const auth = req.auth;
  const { eventId, quantity } = req.body || {};
  if (!Types.ObjectId.isValid(eventId)) return res.status(400).json({ message: 'Invalid eventId' });
  if (typeof quantity !== 'number' || quantity < 1) return res.status(400).json({ message: 'Invalid quantity' });

  const event = await Event.findById(eventId);
  if (!event || event.status !== 'approved') return res.status(404).json({ message: 'Event not available' });

  const updateResult = await Event.updateOne(
    { _id: event._id, seats: { $gte: quantity } },
    { $inc: { seats: -quantity } }
  );
  if (updateResult.matchedCount === 0) {
    return res.status(400).json({ message: 'Not enough seats' });
  }

  const ticketId = generateTicketId();
  const booking = await Booking.create({
    userId: new Types.ObjectId(auth.userId),
    eventId: event._id,
    ticketId,
    quantity
  });

  res.status(201).json(booking);
});

router.get('/me', requireAuth, async (req, res) => {
  const auth = req.auth;
  const bookings = await Booking.find({ userId: auth.userId }).sort({ createdAt: -1 });
  res.json(bookings);
});

export default router;


