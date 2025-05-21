const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: String,
  products: [
    {
      productId: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: String,
      quantity: { type: Number, required: true },
    },
  ],
  amount: Number,
  email: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'completed'],
    default: 'pending',
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending', // Default for orders before payment confirmation
  },
  statusTimestamps: {
    pending: { type: Date, default: Date.now },
    processing: { type: Date },
    shipped: { type: Date },
    completed: { type: Date },
  },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;