const mongoose = require('mongoose');

const tempOrderSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  userRole: { type: String, required: true },
  productDetails: [
    {
      id: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      image: { type: String },
      quantity: { type: Number, required: true }
    }
  ],
  originalTotal: { type: Number, required: true },
  discountAmount: { type: Number, default: 0 },
  discountPercentage: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },
  productCount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now, expires: '24h' } // Auto-delete after 24 hours
});

const TempOrder = mongoose.model('TempOrder', tempOrderSchema);
module.exports = TempOrder;