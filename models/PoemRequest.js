const mongoose = require('mongoose');
const crypto = require('crypto');

const poemRequestSchema = new mongoose.Schema({
  ticketId: { 
    type: String, 
    unique: true, 
    default: () => crypto.randomBytes(6).toString('hex').toUpperCase() 
  },
  patron: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  writer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  topic: { type: String, required: true },
  description: { type: String, required: true },
  poemType: { type: String, enum: ['sonnet', 'haiku', 'free-verse', 'rhyming', 'other'], required: true },
  pages: { type: Number, default: 1, min: 1 },
  chargeAmount: { type: Number, required: true },
  deliveryRequired: { type: Boolean, default: false },
  deliveryDate: Date,
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in-progress', 'completed', 'delivered'],
    default: 'pending'
  },
  poemContent: String,
  deliveredAt: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PoemRequest', poemRequestSchema);
