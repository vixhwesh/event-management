import { Schema, model, Types } from 'mongoose';

const eventSchema = new Schema({
  title: { type: String, required: true, trim: true, index: true },
  description: { type: String, required: true },
  date: { type: Date, required: true, index: true },
  location: { type: String, required: true, trim: true },
  seats: { type: Number, required: true, min: 0 },
  organizerId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true }
}, { timestamps: true });

export const Event = model('Event', eventSchema);


