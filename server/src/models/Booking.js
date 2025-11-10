import { Schema, model, Types } from 'mongoose';

const bookingSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
  eventId: { type: Types.ObjectId, ref: 'Event', required: true, index: true },
  ticketId: { type: String, required: true, unique: true, index: true },
  quantity: { type: Number, required: true, min: 1 }
}, { timestamps: true });

export const Booking = model('Booking', bookingSchema);


