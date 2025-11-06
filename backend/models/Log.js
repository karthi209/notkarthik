import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true, enum: ['games', 'movies', 'series', 'books'] },
  rating: String,
  status: String,
  completion: String,
  author: String,
  content: String,
  date: { type: Date, default: Date.now }
});

export default mongoose.model('Log', logSchema); 